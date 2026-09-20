const prisma = require("../prismaClient");

const getReviewsForProduct = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const reviews = await prisma.review.findMany({
        where: { 
          productId: Number(id),
          isApproved: true
        },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(reviews);
    } catch (dbErr) {
      if (dbErr.message && dbErr.message.includes('video')) {
        // Auto-migrate column on the fly
        await prisma.$executeRawUnsafe(`ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "video" TEXT;`).catch(() => {});
        const fallbackReviews = await prisma.$queryRawUnsafe(
          `SELECT r.* FROM "Review" r WHERE r."productId" = $1 AND r."isApproved" = true ORDER BY r."createdAt" DESC`,
          Number(id)
        );
        return res.json(fallbackReviews);
      }
      throw dbErr;
    }
  } catch (error) {
    console.error("getReviewsForProduct error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const { approved, minRating, hasVideo } = req.query;
    
    try {
      const where = {};
      if (approved === 'true') where.isApproved = true;
      if (minRating) where.rating = { gte: Number(minRating) };
      if (hasVideo === 'true') where.video = { not: null };

      const reviews = await prisma.review.findMany({
        where,
        include: {
          product: { select: { id: true, name: true, image: true, price: true, slug: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(reviews);
    } catch (dbErr) {
      if (dbErr.message && dbErr.message.includes('video')) {
        // Auto-migrate column on the fly and query via raw SQL
        await prisma.$executeRawUnsafe(`ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "video" TEXT;`).catch(() => {});
        const rawReviews = await prisma.$queryRawUnsafe(`
          SELECT r.*, 
            json_build_object('id', p.id, 'name', p.name, 'image', p.image, 'price', p.price, 'slug', p.slug) as product
          FROM "Review" r
          LEFT JOIN "Product" p ON r."productId" = p.id
          ORDER BY r."createdAt" DESC
        `);
        return res.json(rawReviews);
      }
      throw dbErr;
    }
  } catch (error) {
    console.error("getAllReviews error:", error);
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, reviewerName, image, video } = req.body;
    
    try {
      const review = await prisma.review.create({
        data: {
          rating: rating ? Number(rating) : 5,
          comment: comment || '',
          reviewerName: (reviewerName && reviewerName.trim()) ? reviewerName.trim() : 'Verified Customer',
          image: image || null,
          video: video || null,
          productId: Number(productId),
          isApproved: true
        }
      });
      return res.status(201).json(review);
    } catch (dbErr) {
      if (dbErr.message && dbErr.message.includes('video')) {
        // Auto-migrate column on the fly
        await prisma.$executeRawUnsafe(`ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "video" TEXT;`).catch(() => {});
        const inserted = await prisma.$queryRawUnsafe(`
          INSERT INTO "Review" ("rating", "comment", "reviewerName", "image", "video", "productId", "isApproved", "createdAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
          RETURNING *;
        `, rating ? Number(rating) : 5, comment || '', (reviewerName && reviewerName.trim()) ? reviewerName.trim() : 'Verified Customer', image || null, video || null, Number(productId), true);
        
        return res.status(201).json(inserted[0] || inserted);
      }
      throw dbErr;
    }
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const review = await prisma.review.update({
      where: { id: Number(id) },
      data: { isApproved }
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({
      where: { id: Number(id) }
    });
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviewsForProduct,
  getAllReviews,
  createReview,
  updateReviewStatus,
  deleteReview
};
