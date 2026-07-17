const prisma = require('../prismaClient');

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(wishlist);
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId: parseInt(productId) }
      }
    });

    if (existingItem) {
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id }
      });
      return res.json({ message: 'Removed from wishlist', isAdded: false });
    } else {
      await prisma.wishlistItem.create({
        data: { userId, productId: parseInt(productId) }
      });
      return res.status(201).json({ message: 'Added to wishlist', isAdded: true });
    }
  } catch (error) {
    console.error("Toggle wishlist error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId);

    await prisma.wishlistItem.deleteMany({
      where: { userId, productId }
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error("Remove wishlist error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const syncWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { localWishlist } = req.body; // Array of productIds

    if (!localWishlist || !Array.isArray(localWishlist) || localWishlist.length === 0) {
      return res.json({ message: 'Nothing to sync' });
    }

    for (const productId of localWishlist) {
      const existing = await prisma.wishlistItem.findUnique({
        where: { userId_productId: { userId, productId: parseInt(productId) } }
      });

      if (!existing) {
        await prisma.wishlistItem.create({
          data: { userId, productId: parseInt(productId) }
        });
      }
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(wishlistItems);
  } catch (error) {
    console.error('Error syncing wishlist:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getWishlistInsights = async (req, res) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      include: { product: true }
    });

    const frequencyMap = {};
    items.forEach(item => {
      if (!frequencyMap[item.productId]) {
        frequencyMap[item.productId] = {
          product: item.product,
          count: 0,
          latestAdd: item.createdAt
        };
      }
      frequencyMap[item.productId].count += 1;
      if (new Date(item.createdAt) > new Date(frequencyMap[item.productId].latestAdd)) {
        frequencyMap[item.productId].latestAdd = item.createdAt;
      }
    });

    const insights = Object.values(frequencyMap).sort((a, b) => b.count - a.count);
    res.json(insights);
  } catch (error) {
    console.error('Error fetching wishlist insights:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getWishlist,
  toggleWishlistItem,
  removeWishlistItem,
  syncWishlist,
  getWishlistInsights
};
