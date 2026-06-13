const prisma = require("../prismaClient");

const getReviewsForProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await prisma.review.findMany({
      where: { 
        productId: Number(id),
        isApproved: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const { approved, minRating } = req.query;
    const where = {};
    if (approved === 'true') where.isApproved = true;
    if (minRating) where.rating = { gte: Number(minRating) };

    const reviews = await prisma.review.findMany({
      where,
      include: {
        product: { select: { name: true, image: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, reviewerName, image } = req.body;
    
    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        reviewerName,
        image,
        productId: Number(productId),
        isApproved: true // Auto-approved by default per plan
      }
    });
    
    res.status(201).json(review);
  } catch (error) {
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
