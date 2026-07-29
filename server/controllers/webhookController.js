const prisma = require('../prismaClient');

const handleOrderWebhook = async (req, res) => {
  try {
    const o = req.body;
    console.log(`[WooCommerce Webhook] Order Event Received: ID ${o.id}, Status: ${o.status}`);

    if (!o.id) {
      return res.status(200).json({ status: "ignored_empty_payload" });
    }

    const orderNumber = `PDH-WC-${o.id}`;
    const customerName = `${o.billing?.first_name || ''} ${o.billing?.last_name || ''}`.trim() || 'Guest Customer';
    const customerEmail = o.billing?.email || 'guest@paidhu.com';
    const shippingAddress = [
      o.shipping?.address_1,
      o.shipping?.address_2,
      o.shipping?.city,
      o.shipping?.state,
      o.shipping?.postcode,
      o.shipping?.country
    ].filter(Boolean).join(', ') || 'Address not provided';

    let paymentStatus = 'PENDING';
    if (o.status === 'completed' || o.status === 'processing') paymentStatus = 'PAID';
    if (o.status === 'refunded') paymentStatus = 'REFUNDED';
    if (o.status === 'failed') paymentStatus = 'FAILED';

    let orderStatus = 'PENDING';
    if (o.status === 'processing') orderStatus = 'CONFIRMED';
    if (o.status === 'completed') orderStatus = 'DELIVERED';
    if (o.status === 'cancelled') orderStatus = 'CANCELLED';

    const totalPrice = parseFloat(o.total || 0);
    const subtotal = parseFloat(o.line_items ? o.line_items.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0) : totalPrice);
    const tax = parseFloat(o.total_tax || 0);
    const deliveryCharge = parseFloat(o.shipping_total || 0);

    const user = await prisma.user.findUnique({ where: { email: customerEmail } });

    await prisma.order.upsert({
      where: { orderNumber: orderNumber },
      update: {
        customerName: customerName,
        customerEmail: customerEmail,
        shippingAddress: shippingAddress,
        subtotal: subtotal,
        tax: tax,
        deliveryCharge: deliveryCharge,
        totalPrice: totalPrice,
        paymentMethod: o.payment_method_title || 'Online',
        paymentStatus: paymentStatus,
        orderStatus: orderStatus
      },
      create: {
        orderNumber: orderNumber,
        userId: user ? user.id : null,
        customerName: customerName,
        customerEmail: customerEmail,
        shippingAddress: shippingAddress,
        subtotal: subtotal,
        tax: tax,
        deliveryCharge: deliveryCharge,
        totalPrice: totalPrice,
        paymentMethod: o.payment_method_title || 'Online',
        paymentStatus: paymentStatus,
        orderStatus: orderStatus
      }
    });

    res.status(200).json({ status: "success", orderNumber });
  } catch (error) {
    console.error("[WooCommerce Webhook] Order Webhook Error:", error);
    res.status(500).json({ error: "Webhook processing failed", details: error.message });
  }
};

const handleProductWebhook = async (req, res) => {
  try {
    const p = req.body;
    console.log(`[WooCommerce Webhook] Product Event Received: ${p.name}`);

    if (!p.name) {
      return res.status(200).json({ status: "ignored_empty_payload" });
    }

    let defaultCategory = await prisma.category.findFirst();
    if (!defaultCategory) {
      defaultCategory = await prisma.category.create({ data: { name: 'General' } });
    }

    let categoryId = defaultCategory.id;
    if (p.categories && p.categories.length > 0) {
      const categoryName = p.categories[0].name;
      const matchedCategory = await prisma.category.findFirst({
        where: { name: { equals: categoryName, mode: 'insensitive' } }
      });
      if (matchedCategory) categoryId = matchedCategory.id;
    }

    const price = parseFloat(p.price || p.regular_price || 0);
    const discountPrice = p.sale_price ? parseFloat(p.sale_price) : null;
    const stock = p.stock_quantity !== null && p.stock_quantity !== undefined ? parseInt(p.stock_quantity) : 50;
    const image = p.images && p.images.length > 0 ? p.images[0].src : null;
    const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await prisma.product.upsert({
      where: { slug: slug },
      update: {
        name: p.name,
        price: price,
        discountPrice: discountPrice,
        stock: stock,
        image: image,
        categoryId: categoryId,
        status: p.status === 'publish' ? 'ACTIVE' : 'DRAFT'
      },
      create: {
        name: p.name,
        slug: slug,
        description: p.description ? p.description.replace(/<[^>]*>?/gm, '') : p.name,
        price: price,
        discountPrice: discountPrice,
        stock: stock,
        image: image,
        categoryId: categoryId,
        status: p.status === 'publish' ? 'ACTIVE' : 'DRAFT'
      }
    });

    res.status(200).json({ status: "success", slug });
  } catch (error) {
    console.error("[WooCommerce Webhook] Product Webhook Error:", error);
    res.status(500).json({ error: "Product webhook processing failed", details: error.message });
  }
};

const handleCustomerWebhook = async (req, res) => {
  try {
    const c = req.body;
    console.log(`[WooCommerce Webhook] Customer Event Received: ${c.email}`);

    if (!c.email) {
      return res.status(200).json({ status: "ignored_empty_payload" });
    }

    const name = `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.username || 'WooCommerce Customer';

    await prisma.user.upsert({
      where: { email: c.email },
      update: {
        name: name,
        phone: c.billing?.phone || null
      },
      create: {
        name: name,
        email: c.email,
        phone: c.billing?.phone || null,
        password: 'woocommerce_synced_account',
        isAdmin: false
      }
    });

    res.status(200).json({ status: "success", email: c.email });
  } catch (error) {
    console.error("[WooCommerce Webhook] Customer Webhook Error:", error);
    res.status(500).json({ error: "Customer webhook processing failed", details: error.message });
  }
};

module.exports = {
  handleOrderWebhook,
  handleProductWebhook,
  handleCustomerWebhook
};
