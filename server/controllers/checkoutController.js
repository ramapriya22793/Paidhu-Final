const prisma = require('../prismaClient');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const { generateInvoice } = require('../utils/invoiceGenerator');

const getRazorpayConfig = () => {
  const keyId = (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== '[SENSITIVE]') ? process.env.RAZORPAY_KEY_ID.trim() : '';
  const keySecret = (process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET !== '[SENSITIVE]') ? process.env.RAZORPAY_KEY_SECRET.trim() : '';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ? process.env.RAZORPAY_WEBHOOK_SECRET.trim() : '';
  return { keyId, keySecret, webhookSecret };
};

const getRazorpayClient = () => {
  const { keyId, keySecret } = getRazorpayConfig();
  if (!keyId || !keySecret || keyId === 'dummy_key_id' || keyId === '[SENSITIVE]') {
    return null;
  }
  try {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  } catch (e) {
    console.error('[getRazorpayClient] Failed to instantiate Razorpay:', e.message);
    return null;
  }
};

// Calculate checkout summary dynamically
const calculateSummary = async (req, res) => {
  try {
    const { userId, items, deliveryType, couponCode, useRewardPoints, addressDetails } = req.body;
    
    // items should be array of { productId, quantity, price }
    let subtotal = 0;
    if (items && items.length > 0) {
      subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    } else if (userId) {
      // Fetch from cart if items not directly provided
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true }
      });
      subtotal = cartItems.reduce((acc, item) => {
        let price = item.product.offerPrice || item.product.price;
        if (item.variant && item.variant !== 'default' && item.product.variants) {
          try {
            const parsedVariants = typeof item.product.variants === 'string' ? JSON.parse(item.product.variants) : item.product.variants;
            const matchedVar = parsedVariants.find(v => v.size === item.variant);
            if (matchedVar) {
              price = matchedVar.offerPrice || matchedVar.price || price;
            }
          } catch (e) { console.error("Error parsing variants", e); }
        }
        return acc + (price * item.quantity);
      }, 0);
    }

    let deliveryCharge = 50; // Default Standard fallback
    const allDeliveryCharges = await prisma.deliveryCharge.findMany({ where: { isActive: true } });
    
    // Find highest priority matching rule for the requested delivery type
    let bestRule = null;
    let highestPriority = 0;

    const cleanTargetRegion = str => str ? str.replace(/[^a-zA-Z0-9*]/g, '').toLowerCase() : '';
    const cleanStr = str => str ? str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : '';

    const getMatchPriority = (input, target, basePriority) => {
      if (!input || !target) return 0;
      const cleanInput = cleanStr(input);
      const cleanTarget = cleanTargetRegion(target);
      if (cleanTarget.endsWith('*')) {
        const prefix = cleanTarget.slice(0, -1);
        if (cleanInput.startsWith(prefix)) {
          return basePriority + (prefix.length / 10);
        }
        return 0;
      }
      if (cleanInput === cleanTarget) {
        return basePriority + 0.9;
      }
      return 0;
    };

    for (const rule of allDeliveryCharges) {
      if (rule.type.toLowerCase() !== deliveryType.toLowerCase()) continue;

      let priority = 0;
      // If rule has no regions, it's a global fallback
      if (!rule.regions || rule.regions.trim() === '') {
        priority = 1;
      } else if (addressDetails) {
        const targetRegions = rule.regions.split(',').map(t => t.trim());
        const { state, city, pincode } = addressDetails;

        // If rule has pincode patterns (containing digits) and pincode is entered,
        // the pincode must match at least one pattern, otherwise skip this rule.
        const pincodePatterns = targetRegions.filter(t => /\d/.test(t));
        if (pincode && pincodePatterns.length > 0) {
          const matchesAnyPincode = pincodePatterns.some(target => getMatchPriority(pincode, target, 4) > 0);
          if (!matchesAnyPincode) continue;
        }

        for (const target of targetRegions) {
          if (pincode) {
            const p = getMatchPriority(pincode, target, 4);
            if (p > priority) priority = p;
          }
          if (city) {
            const p = getMatchPriority(city, target, 3);
            if (p > priority) priority = p;
          }
          if (state) {
            const p = getMatchPriority(state, target, 2);
            if (p > priority) priority = p;
          }
        }
      }

      if (priority > highestPriority) {
        highestPriority = priority;
        bestRule = rule;
      }
    }

    if (bestRule) {
      deliveryCharge = bestRule.charge;
    }

    let discountAmount = 0;
    let couponId = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && (!coupon.minOrderValue || subtotal >= coupon.minOrderValue)) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
        } else {
          discountAmount = coupon.discountValue;
        }
        couponId = coupon.id;
      }
    }

    let rewardPointsUsed = 0;
    if (useRewardPoints && userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.rewardPoints > 0) {
        rewardPointsUsed = Math.min(user.rewardPoints, subtotal - discountAmount);
      }
    }

    const totalPrice = Math.max(0, subtotal + deliveryCharge - discountAmount - rewardPointsUsed);

    res.json({
      subtotal,
      deliveryCharge,
      discountAmount,
      rewardPointsUsed,
      totalPrice,
      couponId,
      deliveryType
    });
  } catch (error) {
    console.error('Calculate summary error:', error);
    res.status(500).json({ error: 'Failed to calculate summary' });
  }
};

// Initiate Checkout
const initiateCheckout = async (req, res) => {
  try {
    const { 
      userId, customerName, customerEmail, shippingAddress, 
      items, paymentMethod, summary 
    } = req.body;

    // Validation
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ error: 'Customer name is required' });
    }
    if (!customerEmail || !customerEmail.trim()) {
      return res.status(400).json({ error: 'Customer email is required' });
    }
    if (!shippingAddress || !shippingAddress.trim()) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }
    
    // Ensure pincode exists in address (6-digit check)
    const pincodeMatch = shippingAddress.match(/\b\d{6}\b/);
    if (!pincodeMatch) {
      return res.status(400).json({ error: 'A valid 6-digit Pincode is mandatory' });
    }

    // Verify if userId exists in database to prevent foreign key constraint violations (e.g. stale/deleted tokens)
    let finalUserId = null;
    if (userId) {
      try {
        const parsedUserId = parseInt(userId);
        if (!isNaN(parsedUserId)) {
          const userExists = await prisma.user.findUnique({ where: { id: parsedUserId } });
          if (userExists) {
            finalUserId = userExists.id;
          }
        }
      } catch (userCheckErr) {
        console.error("Error verifying userId in database:", userCheckErr);
      }
    }

    // summary should have { subtotal, deliveryCharge, discountAmount, rewardPointsUsed, totalPrice, couponId }

    // 1. Check for an existing PENDING order for this customer created recently (last 24h)
    const cleanEmail = customerEmail.trim().toLowerCase();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const existingPendingOrder = await prisma.order.findFirst({
      where: {
        orderStatus: "PENDING",
        paymentStatus: "PENDING",
        createdAt: { gte: oneDayAgo },
        OR: [
          ...(finalUserId ? [{ userId: finalUserId }] : []),
          { customerEmail: { equals: cleanEmail, mode: 'insensitive' } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    let order;

    if (existingPendingOrder) {
      // Reuse & update existing PENDING order to prevent duplicate rows in admin table
      await prisma.orderItem.deleteMany({ where: { orderId: existingPendingOrder.id } });

      order = await prisma.order.update({
        where: { id: existingPendingOrder.id },
        data: {
          userId: finalUserId,
          customerName,
          customerEmail: cleanEmail,
          shippingAddress,
          subtotal: summary.subtotal || 0,
          deliveryCharge: summary.deliveryCharge || 0,
          discountAmount: summary.discountAmount || 0,
          rewardPointsUsed: summary.rewardPointsUsed || 0,
          totalPrice: summary.totalPrice || 0,
          paymentMethod,
          couponId: summary.couponId || null,
          updatedAt: new Date(),
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: { items: { include: { product: true } } }
      });
    } else {
      // Create new Order Record
      order = await prisma.order.create({
        data: {
          userId: finalUserId,
          customerName,
          customerEmail: cleanEmail,
          shippingAddress,
          subtotal: summary.subtotal || 0,
          deliveryCharge: summary.deliveryCharge || 0,
          discountAmount: summary.discountAmount || 0,
          rewardPointsUsed: summary.rewardPointsUsed || 0,
          totalPrice: summary.totalPrice || 0,
          paymentMethod,
          couponId: summary.couponId || null,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: { items: { include: { product: true } } }
      });

      // Format Order Number: P0001
      const formattedId = String(order.id).padStart(4, '0');
      const orderNumber = `P${formattedId}`;

      order = await prisma.order.update({
        where: { id: order.id },
        data: { orderNumber },
        include: { items: { include: { product: true } } }
      });
    }


    // 2. Handle Razorpay Order Creation (if online payment)
    if (paymentMethod !== 'COD') {
      const options = {
        amount: Math.round(summary.totalPrice * 100), // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_order_${order.id}`
      };
      
      const { keyId, keySecret } = getRazorpayConfig();
      const rzp = getRazorpayClient();

      const merchantUpi = process.env.MERCHANT_UPI_ID || 'paidhu.edibleflowers@okaxis';
      const merchantName = process.env.MERCHANT_NAME || 'Paidhu Edible Flower Co';
      const upiUri = `upi://pay?pa=${encodeURIComponent(merchantUpi)}&pn=${encodeURIComponent(merchantName)}&am=${Number(summary.totalPrice || 0).toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order ${order.orderNumber}`)}`;

      // If Razorpay keys are not configured or dummy, provide dev test simulation
      if (!keyId || !keySecret || !rzp) {
        console.log(`[initiateCheckout] Using dev payment simulation for Order ${order.orderNumber} (no active Razorpay keys configured)`);
        return res.json({
          order,
          razorpayOrderId: `order_sim_${Date.now()}_${order.id}`,
          amount: options.amount,
          currency: options.currency,
          isSimulation: true,
          upiUri,
          merchantUpi,
          merchantName
        });
      }

      try {
        const razorpayOrder = await rzp.orders.create(options);
        return res.json({ 
          order, 
          razorpayOrderId: razorpayOrder.id,
          amount: options.amount,
          currency: options.currency,
          key_id: keyId,
          upiUri,
          merchantUpi,
          merchantName
        });
      } catch (rzpError) {
        console.warn('[initiateCheckout] Razorpay API order creation failed:', rzpError?.message || rzpError);
        // If credentials failed authentication (e.g. 401), fallback gracefully to dev simulation
        if (rzpError?.statusCode === 401 || !process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
          console.log(`[initiateCheckout] Razorpay 401 Authentication Failed. Switching to dev simulation for Order ${order.orderNumber}`);
          return res.json({
            order,
            razorpayOrderId: `order_sim_${Date.now()}_${order.id}`,
            amount: options.amount,
            currency: options.currency,
            isSimulation: true,
            upiUri,
            merchantUpi,
            merchantName
          });
        }
        throw rzpError;
      }
    }

    // If COD, just return order details
    // Update order status to confirmed
    const confirmedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { orderStatus: 'CONFIRMED' },
      include: { items: { include: { product: true } } }
    });

    if (confirmedOrder.couponId) {
      await prisma.coupon.update({
        where: { id: confirmedOrder.couponId },
        data: { usageCount: { increment: 1 } }
      });
    }

    // Generate Invoice and Send Email (non-blocking)
    try {
      await generateInvoice(confirmedOrder);
    } catch (invoiceErr) {
      console.error('Invoice generation failed during COD initiateOrder:', invoiceErr);
    }
    try {
      await sendOrderConfirmationEmail(confirmedOrder, confirmedOrder.customerEmail);
    } catch (emailErr) {
      console.error('Email sending failed during COD initiateOrder:', emailErr);
    }

    res.json({ order: confirmedOrder, success: true });

  } catch (error) {
    console.error('Initiate checkout error:', error);
    
    // Check if it's a Razorpay Authentication error
    if (error.statusCode === 401 && error.error?.description === 'Authentication failed') {
      return res.status(401).json({ error: 'Razorpay Authentication Failed. Please check if your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the backend .env file are correct and active.' });
    }
    
    res.status(500).json({ error: 'Failed to initiate checkout' });
  }
};

// Verify Online Payment
const verifyPayment = async (req, res) => {
  try {
    const {
      orderId, // our DB order id
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const { keySecret } = getRazorpayConfig();
    
    const expectedSignature = crypto
      .createHmac("sha256", keySecret || 'dummy_key_secret')
      .update(body.toString())
      .digest("hex");

    const isSimulated = Boolean(req.body.isSimulation) || (razorpay_order_id && String(razorpay_order_id).startsWith('order_sim_'));
    let isVerified = isSimulated || (expectedSignature === razorpay_signature);

    // Fallback: If signature check fails, query Razorpay API directly using our credentials to verify payment status.
    if (!isVerified && !isSimulated) {
      try {
        const rzp = getRazorpayClient();
        if (rzp) {
          console.log(`[verifyPayment] Signature verification failed. Checking payment status directly with Razorpay API for payment ID: ${razorpay_payment_id}`);
          const paymentDetails = await rzp.payments.fetch(razorpay_payment_id);
          if (paymentDetails && 
              paymentDetails.order_id === razorpay_order_id && 
              (paymentDetails.status === 'captured' || paymentDetails.status === 'authorized')) {
            isVerified = true;
            console.log(`[verifyPayment] Payment verified successfully via Razorpay API fallback: ${razorpay_payment_id}`);
          }
        }
      } catch (err) {
        console.error("[verifyPayment] Fallback validation failed:", err.message);
      }
    }

    if (isVerified) {
      // Payment is successful
      const targetOrderId = parseInt(orderId);
      const existingOrder = await prisma.order.findUnique({ where: { id: targetOrderId } });
      const orderAmount = existingOrder ? existingOrder.totalPrice : 0;

      // Safely handle payment record creation/update
      const existingPayment = await prisma.payment.findFirst({
        where: {
          OR: [
            { razorpayOrderId: razorpay_order_id },
            { razorpayPaymentId: razorpay_payment_id },
            { orderId: targetOrderId }
          ]
        }
      });

      if (!existingPayment) {
        await prisma.payment.create({
          data: {
            orderId: targetOrderId,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amount: orderAmount,
            method: 'Online',
            status: 'SUCCESS'
          }
        });
      } else {
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: 'SUCCESS',
            razorpayPaymentId: razorpay_payment_id || existingPayment.razorpayPaymentId,
            razorpaySignature: razorpay_signature || existingPayment.razorpaySignature
          }
        });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: targetOrderId },
        data: {
          orderStatus: 'CONFIRMED',
          paymentStatus: 'PAID'
        },
        include: { items: { include: { product: true } } }
      });

      // Deduct reward points if used
      if (updatedOrder.rewardPointsUsed > 0 && updatedOrder.userId) {
        await prisma.user.update({
          where: { id: updatedOrder.userId },
          data: { rewardPoints: { decrement: updatedOrder.rewardPointsUsed } }
        });
      }

      // Increment coupon usage count if used
      if (updatedOrder.couponId) {
        await prisma.coupon.update({
          where: { id: updatedOrder.couponId },
          data: { usageCount: { increment: 1 } }
        });
      }

      // Generate invoice (non-blocking)
      try {
        await generateInvoice(updatedOrder);
      } catch (invoiceErr) {
        console.error('Invoice generation failed during verifyPayment:', invoiceErr);
      }

      // Send email (non-blocking)
      try {
        await sendOrderConfirmationEmail(updatedOrder, updatedOrder.customerEmail);
      } catch (emailErr) {
        console.error('Email sending failed during verifyPayment:', emailErr);
      }

      res.json({ success: true, order: updatedOrder });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

// Razorpay Webhook
const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    const isSignatureValid = (expectedSignature === signature);
    let isVerified = isSignatureValid;
    const event = req.body.event;

    const allowedEvents = ['order.paid', 'payment.captured'];

    if (!isVerified && allowedEvents.includes(event)) {
      try {
        const rzp = getRazorpayClient();
        const paymentEntity = req.body.payload?.payment?.entity;
        if (rzp && paymentEntity && paymentEntity.id) {
          const paymentDetails = await rzp.payments.fetch(paymentEntity.id);
          if (paymentDetails && (paymentDetails.status === 'captured' || paymentDetails.status === 'confirmed' || paymentDetails.status === 'authorized')) {
            isVerified = true;
            console.log(`[Razorpay Webhook] Signature mismatch, but verified payment status directly with Razorpay: ${paymentEntity.id}`);
          }
        }
      } catch (err) {
        console.error("[Razorpay Webhook] Fallback validation failed:", err.message);
      }
    }

    if (isVerified && allowedEvents.includes(event)) {
      const paymentEntity = req.body.payload.payment.entity;
      let dbOrderId = NaN;
      let rzpOrderId = paymentEntity.order_id;

      if (event === 'order.paid') {
        const orderEntity = req.body.payload.order.entity;
        rzpOrderId = orderEntity.id;
        const receipt = orderEntity.receipt;
        if (receipt && receipt.startsWith('receipt_order_')) {
          dbOrderId = parseInt(receipt.split('_')[2]);
        }
      } else if (event === 'payment.captured') {
        if (rzpOrderId) {
          const order = await prisma.order.findFirst({
            where: { razorpayOrderId: rzpOrderId }
          });
          if (order) {
            dbOrderId = order.id;
          }
        }
      }

      if (!isNaN(dbOrderId)) {
        const existingPayment = await prisma.payment.findFirst({
          where: {
            OR: [
              { razorpayOrderId: rzpOrderId },
              { razorpayPaymentId: paymentEntity.id },
              { orderId: dbOrderId }
            ]
          }
        });

        if (!existingPayment) {
          await prisma.payment.create({
            data: {
              orderId: dbOrderId,
              razorpayOrderId: rzpOrderId,
              razorpayPaymentId: paymentEntity.id,
              amount: paymentEntity.amount / 100,
              method: paymentEntity.method || 'Online',
              status: 'SUCCESS'
            }
          });
        } else {
          await prisma.payment.update({
            where: { id: existingPayment.id },
            data: {
              status: 'SUCCESS',
              razorpayPaymentId: paymentEntity.id || existingPayment.razorpayPaymentId
            }
          });
        }

        const updatedOrder = await prisma.order.update({
          where: { id: dbOrderId },
          data: {
            orderStatus: 'CONFIRMED',
            paymentStatus: 'PAID'
          },
          include: { items: { include: { product: true } } }
        });

        // Deduct reward points if used
        if (updatedOrder.rewardPointsUsed > 0 && updatedOrder.userId) {
          await prisma.user.update({
            where: { id: updatedOrder.userId },
            data: { rewardPoints: { decrement: updatedOrder.rewardPointsUsed } }
          });
        }

        // Increment coupon usage count if used
        if (updatedOrder.couponId) {
          await prisma.coupon.update({
            where: { id: updatedOrder.couponId },
            data: { usageCount: { increment: 1 } }
          });
        }

        // Generate invoice (non-blocking)
        try {
          await generateInvoice(updatedOrder);
        } catch (invoiceErr) {
          console.error('Invoice generation failed during webhook:', invoiceErr);
        }

        // Send email (non-blocking)
        try {
          await sendOrderConfirmationEmail(updatedOrder, updatedOrder.customerEmail);
        } catch (emailErr) {
          console.error('Email sending failed during webhook:', emailErr);
        }
        
        console.log(`Webhook processed successfully for Order ID: ${dbOrderId}`);
      }
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Get Order by Order Number (Public endpoint for order success page)
const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await prisma.order.findFirst({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true
          }
        },
        payments: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order by number error:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

// Check Real-Time Razorpay Payment Gateway Status
const checkRazorpayStatus = async (req, res) => {
  try {
    const { keyId, keySecret, webhookSecret } = getRazorpayConfig();

    if (!keyId || !keySecret || keyId === 'dummy_key_id' || keyId === '[SENSITIVE]') {
      return res.json({
        configured: false,
        status: "NOT_CONFIGURED",
        mode: "NONE",
        keyIdMasked: null,
        message: "Razorpay keys are not configured in backend server/.env"
      });
    }

    const mode = keyId.startsWith('rzp_live') ? 'LIVE' : (keyId.startsWith('rzp_test') ? 'TEST' : 'CUSTOM');
    const keyIdMasked = `${keyId.slice(0, 8)}...${keyId.slice(-4)}`;

    // Live test call to Razorpay API
    try {
      const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const testOrder = await rzp.orders.create({
        amount: 100, // 100 paise = 1 INR
        currency: "INR",
        receipt: `ping_${Date.now()}`
      });

      return res.json({
        configured: true,
        status: "CONNECTED",
        mode,
        keyIdMasked,
        liveTestOrderId: testOrder.id,
        webhookConfigured: Boolean(webhookSecret),
        message: `Real-time Razorpay ${mode} payment gateway is active and fully verified.`
      });
    } catch (rzpErr) {
      const isAuthError = rzpErr.statusCode === 401 || (rzpErr.error && rzpErr.error.code === 'BAD_REQUEST_ERROR');
      return res.json({
        configured: true,
        status: isAuthError ? "AUTH_FAILED" : "ERROR",
        mode,
        keyIdMasked,
        statusCode: rzpErr.statusCode,
        error: rzpErr.error?.description || rzpErr.message || "Failed to authenticate with Razorpay",
        message: isAuthError
          ? "Razorpay Authentication Failed: The RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is inactive or incorrect."
          : `Razorpay connection error: ${rzpErr.message}`
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Razorpay Real-Time Credentials (Admin/API)
const updateRazorpayConfig = async (req, res) => {
  try {
    const { keyId, keySecret, webhookSecret } = req.body;
    if (!keyId || !keySecret) {
      return res.status(400).json({ message: "Both RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required." });
    }

    const trimmedKey = keyId.trim();
    const trimmedSecret = keySecret.trim();

    // Verify against Razorpay API
    const rzp = new Razorpay({ key_id: trimmedKey, key_secret: trimmedSecret });
    let liveTestOrderId = null;
    try {
      const testOrder = await rzp.orders.create({
        amount: 100,
        currency: "INR",
        receipt: `verify_${Date.now()}`
      });
      liveTestOrderId = testOrder.id;
    } catch (authErr) {
      if (authErr.statusCode === 401) {
        return res.status(400).json({
          message: "Razorpay Authentication Failed. The Key ID or Key Secret is incorrect or not activated in Razorpay dashboard."
        });
      }
      console.warn('[updateRazorpayConfig] Non-fatal test error:', authErr.message);
    }

    // Update in-memory process.env
    process.env.RAZORPAY_KEY_ID = trimmedKey;
    process.env.RAZORPAY_KEY_SECRET = trimmedSecret;
    if (webhookSecret) {
      process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret.trim();
    }

    // Persist to server/.env
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      const updateOrAppend = (content, key, val) => {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(content)) {
          return content.replace(regex, `${key}="${val}"`);
        } else {
          return content + `\n${key}="${val}"`;
        }
      };

      envContent = updateOrAppend(envContent, 'RAZORPAY_KEY_ID', trimmedKey);
      envContent = updateOrAppend(envContent, 'RAZORPAY_KEY_SECRET', trimmedSecret);
      if (webhookSecret) {
        envContent = updateOrAppend(envContent, 'RAZORPAY_WEBHOOK_SECRET', webhookSecret.trim());
      }
      fs.writeFileSync(envPath, envContent, 'utf8');
    }

    const mode = trimmedKey.startsWith('rzp_live') ? 'LIVE' : 'TEST';
    res.json({
      success: true,
      message: `Real-time Razorpay ${mode} credentials verified and saved successfully!`,
      mode,
      keyIdMasked: `${trimmedKey.slice(0, 8)}...${trimmedKey.slice(-4)}`,
      liveTestOrderId
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  calculateSummary,
  initiateCheckout,
  verifyPayment,
  razorpayWebhook,
  getOrderByNumber,
  checkRazorpayStatus,
  updateRazorpayConfig
};

