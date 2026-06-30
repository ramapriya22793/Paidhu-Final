const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get cart items for a user
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, variant = 'default' } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Atomic upsert to prevent duplicate rows and race conditions
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId_variant: { userId, productId, variant }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        userId,
        productId,
        quantity,
        variant
      },
      include: { product: true }
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, variant = 'default' } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        userId_productId_variant: { userId, productId, variant }
      },
      data: { quantity },
      include: { product: true }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    // Handle both POST (body) and DELETE (params + query) formats
    const variantQuery = req.body.variant || req.query.variant || 'default';
    const prodId = parseInt(req.body.productId || req.params.productId);

    if (isNaN(prodId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId,
        productId: prodId,
        variant: variantQuery
      }
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await prisma.cartItem.deleteMany({
      where: { userId }
    });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Sync local cart to db upon login
const syncCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { localCart } = req.body; // Array of { productId, quantity }

    if (!localCart || !Array.isArray(localCart) || localCart.length === 0) {
      return res.json({ message: 'Nothing to sync' });
    }

    // Merge logic
    for (const item of localCart) {
      const variant = item.variant || 'default';
      const existing = await prisma.cartItem.findUnique({
        where: { userId_productId_variant: { userId, productId: item.productId, variant } }
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: Math.max(existing.quantity, item.quantity) }
        });
      } else {
        await prisma.cartItem.create({
          data: {
            userId,
            productId: item.productId,
            quantity: item.quantity,
            variant
          }
        });
      }
    }

    // Return the updated cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(cartItems);
  } catch (error) {
    console.error('Error syncing cart:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ADMIN: Get all active carts
const getAllActiveCarts = async (req, res) => {
  try {
    const allCarts = await prisma.cartItem.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, avatar: true }
        },
        product: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Group by user
    const grouped = allCarts.reduce((acc, item) => {
      const uId = item.userId;
      if (!acc[uId]) {
        acc[uId] = {
          user: item.user,
          items: [],
          totalValue: 0,
          lastUpdated: item.updatedAt
        };
      }
      acc[uId].items.push(item);
      acc[uId].totalValue += (item.product.offerPrice || item.product.price) * item.quantity;
      if (new Date(item.updatedAt) > new Date(acc[uId].lastUpdated)) {
        acc[uId].lastUpdated = item.updatedAt;
      }
      return acc;
    }, {});

    res.json(Object.values(grouped));
  } catch (error) {
    console.error('Error fetching all carts:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
  getAllActiveCarts
};
