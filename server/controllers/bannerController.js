const prisma = require("../prismaClient");

let bannerColumnsChecked = false;
const ensureBannerColumns = async () => {
  if (bannerColumnsChecked) return;
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Banner"
      ADD COLUMN IF NOT EXISTS "link" TEXT,
      ADD COLUMN IF NOT EXISTS "webImagePath" TEXT,
      ADD COLUMN IF NOT EXISTS "mobileImagePath" TEXT,
      ADD COLUMN IF NOT EXISTS "category" TEXT;
    `);
    bannerColumnsChecked = true;
  } catch (err) {
    console.log("ensureBannerColumns notice:", err.message);
  }
};

const getAllBanners = async (req, res) => {
  try {
    let banners;
    try {
      banners = await prisma.banner.findMany({
        orderBy: { id: 'desc' }
      });
    } catch (queryErr) {
      console.warn("Banner query initial error, ensuring columns:", queryErr.message);
      await ensureBannerColumns();
      banners = await prisma.banner.findMany({
        orderBy: { id: 'desc' }
      });
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.json(banners);
  } catch (error) {
    console.error("Error in getAllBanners:", error);
    res.status(500).json({ message: error.message });
  }
};

const getActiveBannerByPage = async (req, res) => {
  try {
    const { pageSlug } = req.params;
    const lowerSlug = (pageSlug || '').toLowerCase().trim();

    let slugConditions = [
      { pageSlug: { equals: lowerSlug, mode: 'insensitive' } }
    ];

    if (lowerSlug === 'shop-all' || lowerSlug === 'shop') {
      slugConditions = [
        { pageSlug: { equals: 'shop-all', mode: 'insensitive' } },
        { pageSlug: { equals: 'shop', mode: 'insensitive' } }
      ];
    }

    let banners;
    try {
      banners = await prisma.banner.findMany({
        where: {
          OR: slugConditions,
          isActive: true
        },
        orderBy: { id: 'desc' }
      });
    } catch (queryErr) {
      console.warn("Active banner query error, ensuring columns:", queryErr.message);
      await ensureBannerColumns();
      banners = await prisma.banner.findMany({
        where: {
          OR: slugConditions,
          isActive: true
        },
        orderBy: { id: 'desc' }
      });
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.json(banners);
  } catch (error) {
    console.error("Error in getActiveBannerByPage:", error);
    res.status(500).json({ message: error.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const { pageSlug, webImage, webImagePath, mobileImage, mobileImagePath, size, isActive, category, link } = req.body;
    const banner = await prisma.banner.create({
      data: {
        pageSlug: (pageSlug || '').toLowerCase().trim(),
        webImage,
        webImagePath: webImagePath || null,
        mobileImage: mobileImage || null,
        mobileImagePath: mobileImagePath || null,
        size: size || "medium",
        isActive: isActive !== undefined ? (isActive === true || isActive === 'true') : true,
        category: category || null,
        link: link ? link.trim() : null
      }
    });
    res.status(201).json(banner);
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { pageSlug, webImage, webImagePath, mobileImage, mobileImagePath, size, isActive, category, link } = req.body;
    
    const updateData = {};
    if (pageSlug !== undefined) updateData.pageSlug = pageSlug.toLowerCase().trim();
    if (webImage !== undefined) updateData.webImage = webImage;
    if (webImagePath !== undefined) updateData.webImagePath = webImagePath || null;
    if (mobileImage !== undefined) updateData.mobileImage = mobileImage || null;
    if (mobileImagePath !== undefined) updateData.mobileImagePath = mobileImagePath || null;
    if (size !== undefined) updateData.size = size;
    if (category !== undefined) updateData.category = category || null;
    if (link !== undefined) updateData.link = link ? link.trim() : null;
    if (isActive !== undefined) {
      updateData.isActive = (isActive === true || isActive === 'true');
    }

    const banner = await prisma.banner.update({
      where: { id: Number(id) },
      data: updateData
    });

    res.json(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
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
    console.error("Error deleting banner:", error);
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
