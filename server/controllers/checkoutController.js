const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const { generateInvoice } = require('../utils/invoiceGenerator');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

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

    const matchRegion = (input, target) => {
      if (!input || !target) return false;
      const cleanInput = cleanStr(input);
      const cleanTarget = cleanTargetRegion(target);
      if (cleanTarget.endsWith('*')) {
        const prefix = cleanTarget.slice(0, -1);
        return cleanInput.startsWith(prefix);
      }
      return cleanInput === cleanTarget;
    };

    for (const rule of allDeliveryCharges) {
      if (rule.type.toLowerCase() !== deliveryType.toLowerCase()) continue;

      let priority = 0;
      // If rule has no regions, it's a global fallback
      if (!rule.regions || rule.regions.trim() === '') {
        priority = 1;
      } else if (addressDetails) {
        const targetRegions = rule.regions.split(',');
        const { state, city, pincode } = addressDetails;

        let pincodeMatched = false;
        let cityMatched = false;
        let stateMatched = false;

        for (const target of targetRegions) {
          if (pincode && matchRegion(pincode, target)) pincodeMatched = true;
          if (city && matchRegion(city, target)) cityMatched = true;
          if (state && matchRegion(state, target)) stateMatched = true;
        }

        if (pincodeMatched) {
          priority = 4; // Pincode / Wildcard Pincode match is most specific
        } else if (cityMatched) {
          priority = 3; // City match
        } else if (stateMatched) {
          priority = 2; // State match
        }
      }

      if (priority > highestPriority) {
        highestPriority = priority;
        bestRule = rule;
      }
    }

    if (bestRule) {
      if (bestRule.freeAbove && subtotal >= bestRule.freeAbove) {
        deliveryCharge = 0;
      } else {
        deliveryCharge = bestRule.charge;
      }
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

    // 1. Create Order Record
    let order = await prisma.order.create({
      data: {
        userId: finalUserId,
        customerName,
        customerEmail,
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
      }
    });

    // Format Order Number: P0001
    const formattedId = String(order.id).padStart(4, '0');
    const orderNumber = `P${formattedId}`;

    order = await prisma.order.update({
      where: { id: order.id },
      data: { orderNumber }
    });

    // 2. Handle Razorpay Order Creation (if online payment)
    if (paymentMethod !== 'COD') {
      const options = {
        amount: Math.round(summary.totalPrice * 100), // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_order_${order.id}`
      };
      
      const razorpayOrder = await razorpay.orders.create(options);
      
      return res.json({ 
        order, 
        razorpayOrderId: razorpayOrder.id,
        amount: options.amount,
        currency: options.currency
      });
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

    // Generate Invoice and Send Email
    await generateInvoice(confirmedOrder);
    await sendOrderConfirmationEmail(confirmedOrder, confirmedOrder.customerEmail);

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
    
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is successful
      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: {
          orderStatus: 'CONFIRMED',
          payments: {
            create: {
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              razorpaySignature: razorpay_signature,
              amount: 0, // Should be fetched but 0 for now as placeholder or fetch from order
              method: 'Online',
              status: 'SUCCESS'
            }
          }
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

      // Generate invoice
      await generateInvoice(updatedOrder);

      // Send email
      await sendOrderConfirmationEmail(updatedOrder, updatedOrder.customerEmail);

      res.json({ success: true, order: updatedOrder });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

module.exports = {
  calculateSummary,
  initiateCheckout,
  verifyPayment
};
