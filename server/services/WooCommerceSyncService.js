const prisma = require('../prismaClient');
const wooCommerceService = require('./WooCommerceService');

class WooCommerceSyncService {
  
  // 1. Sync Categories from WooCommerce
  async syncCategories() {
    console.log('[WooCommerceSyncService] Starting categories sync...');
    try {
      const wooCategories = await wooCommerceService.getCategories({ per_page: 100 });
      let syncedCount = 0;

      for (const cat of wooCategories) {
        if (!cat.name) continue;
        await prisma.category.upsert({
          where: { name: cat.name },
          update: {},
          create: {
            name: cat.name
          }
        });
        syncedCount++;
      }
      console.log(`[WooCommerceSyncService] Synced ${syncedCount} categories.`);
      return { success: true, count: syncedCount };
    } catch (error) {
      console.error('[WooCommerceSyncService] Sync Categories Error:', error);
      throw error;
    }
  }

  // 2. Sync Products from WooCommerce
  async syncProducts() {
    console.log('[WooCommerceSyncService] Starting products sync...');
    try {
      await this.syncCategories();
      const wooProducts = await wooCommerceService.getProducts({ per_page: 100 });
      let syncedCount = 0;

      // Default category fallback
      let defaultCategory = await prisma.category.findFirst();
      if (!defaultCategory) {
        defaultCategory = await prisma.category.create({ data: { name: 'General' } });
      }

      for (const p of wooProducts) {
        if (!p.name) continue;

        // Find or map category
        let categoryId = defaultCategory.id;
        if (p.categories && p.categories.length > 0) {
          const categoryName = p.categories[0].name;
          const matchedCategory = await prisma.category.findFirst({
            where: { name: { equals: categoryName, mode: 'insensitive' } }
          });
          if (matchedCategory) {
            categoryId = matchedCategory.id;
          }
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
            description: p.description ? p.description.replace(/<[^>]*>?/gm, '') : p.name,
            shortDescription: p.short_description ? p.short_description.replace(/<[^>]*>?/gm, '') : null,
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
            shortDescription: p.short_description ? p.short_description.replace(/<[^>]*>?/gm, '') : null,
            price: price,
            discountPrice: discountPrice,
            stock: stock,
            image: image,
            categoryId: categoryId,
            status: p.status === 'publish' ? 'ACTIVE' : 'DRAFT'
          }
        });
        syncedCount++;
      }

      console.log(`[WooCommerceSyncService] Synced ${syncedCount} products.`);
      return { success: true, count: syncedCount };
    } catch (error) {
      console.error('[WooCommerceSyncService] Sync Products Error:', error);
      throw error;
    }
  }

  // 3. Sync Customers from WooCommerce
  async syncCustomers() {
    console.log('[WooCommerceSyncService] Starting customers sync...');
    try {
      const wooCustomers = await wooCommerceService.getCustomers({ per_page: 100 });
      let syncedCount = 0;

      for (const c of wooCustomers) {
        if (!c.email) continue;
        const name = `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.username || 'WooCommerce Customer';
        const rawPhone = c.billing?.phone ? c.billing.phone.trim() : null;
        let validPhone = rawPhone;

        if (validPhone) {
          const existingPhoneUser = await prisma.user.findFirst({
            where: { phone: validPhone, NOT: { email: c.email } }
          });
          if (existingPhoneUser) {
            validPhone = null; // Prevent unique constraint crash on phone
          }
        }

        await prisma.user.upsert({
          where: { email: c.email },
          update: {
            name: name,
            ...(validPhone ? { phone: validPhone } : {})
          },
          create: {
            name: name,
            email: c.email,
            phone: validPhone,
            password: 'woocommerce_synced_account',
            isAdmin: false
          }
        });
        syncedCount++;
      }

      console.log(`[WooCommerceSyncService] Synced ${syncedCount} customers.`);
      return { success: true, count: syncedCount };
    } catch (error) {
      console.error('[WooCommerceSyncService] Sync Customers Error:', error);
      throw error;
    }
  }

  // 4. Sync Orders from WooCommerce
  async syncOrders() {
    console.log('[WooCommerceSyncService] Starting orders sync...');
    try {
      const wooOrders = await wooCommerceService.getOrders({ per_page: 100 });
      let syncedCount = 0;

      for (const o of wooOrders) {
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

        // Map status
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

        // Find associated user by email
        const user = await prisma.user.findUnique({ where: { email: customerEmail } });

        const dbOrder = await prisma.order.upsert({
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

        syncedCount++;
      }

      console.log(`[WooCommerceSyncService] Synced ${syncedCount} orders.`);
      return { success: true, count: syncedCount };
    } catch (error) {
      console.error('[WooCommerceSyncService] Sync Orders Error:', error);
      throw error;
    }
  }

  // 5. Full Initial Sync
  async syncAll() {
    console.log('[WooCommerceSyncService] Running FULL WooCommerce Sync...');
    const catResult = await this.syncCategories();
    const prodResult = await this.syncProducts();
    const custResult = await this.syncCustomers();
    const orderResult = await this.syncOrders();

    return {
      success: true,
      summary: {
        categories: catResult.count,
        products: prodResult.count,
        customers: custResult.count,
        orders: orderResult.count
      }
    };
  }
}

module.exports = new WooCommerceSyncService();
