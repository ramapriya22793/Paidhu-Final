const prisma = require("../prismaClient");

const getAllBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActiveBannerByPage = async (req, res) => {
  try {
    const { pageSlug } = req.params;
    const banners = await prisma.banner.findMany({
      where: { pageSlug, isActive: true },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const { pageSlug, webImage, webImagePath, mobileImage, mobileImagePath, size, isActive } = req.body;
    const banner = await prisma.banner.create({
      data: {
        pageSlug,
        webImage,
        webImagePath,
        mobileImage,
        mobileImagePath,
        size: size || "medium",
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { pageSlug, webImage, webImagePath, mobileImage, mobileImagePath, size, isActive } = req.body;
    const banner = await prisma.banner.update({
      where: { id: Number(id) },
      data: {
        pageSlug,
        webImage,
        webImagePath,
        mobileImage,
        mobileImagePath,
        size,
        isActive
      }
    });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.banner.delete({
      where: { id: Number(id) }
    });
    res.json({ message: "Banner deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBanners,
  getActiveBannerByPage,
  createBanner,
  updateBanner,
  deleteBanner
};
