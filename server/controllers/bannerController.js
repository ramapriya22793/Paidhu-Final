const prisma = require("../prismaClient");

let lastSyncTime = 0;
async function maybeSyncFromLive() {
  const now = Date.now();
  if (now - lastSyncTime < 8000) return;
  lastSyncTime = now;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://paidhu-final-anm2.vercel.app/api/banners', { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const liveBanners = await res.json();
      for (const b of liveBanners) {
        await prisma.banner.upsert({
          where: { id: b.id },
          update: {
            pageSlug: (b.pageSlug || '').toLowerCase().trim(),
            webImage: b.webImage,
            webImagePath: b.webImagePath || null,
            mobileImage: b.mobileImage || null,
            mobileImagePath: b.mobileImagePath || null,
            size: b.size || 'medium',
            isActive: b.isActive === true || b.isActive === 'true',
            category: b.category || null
          },
          create: {
            id: b.id,
            pageSlug: (b.pageSlug || '').toLowerCase().trim(),
            webImage: b.webImage,
            webImagePath: b.webImagePath || null,
            mobileImage: b.mobileImage || null,
            mobileImagePath: b.mobileImagePath || null,
            size: b.size || 'medium',
            isActive: b.isActive === true || b.isActive === 'true',
            category: b.category || null
          }
        });
      }
    }
  } catch (err) {
    // Soft ignore if network unavailable
  }
}

const getAllBanners = async (req, res) => {
  try {
    await maybeSyncFromLive();
    const banners = await prisma.banner.findMany({
      orderBy: { id: 'desc' }
    });
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActiveBannerByPage = async (req, res) => {
  try {
    await maybeSyncFromLive();
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

    const banners = await prisma.banner.findMany({
      where: {
        OR: slugConditions,
        isActive: true
      },
      orderBy: { id: 'desc' }
    });
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const { pageSlug, webImage, webImagePath, mobileImage, mobileImagePath, size, isActive, category } = req.body;
    const banner = await prisma.banner.create({
      data: {
        pageSlug: (pageSlug || '').toLowerCase().trim(),
        webImage,
        webImagePath: webImagePath || null,
        mobileImage: mobileImage || null,
        mobileImagePath: mobileImagePath || null,
        size: size || "medium",
        isActive: isActive !== undefined ? (isActive === true || isActive === 'true') : true,
        category: category || null
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
    const { pageSlug, webImage, webImagePath, mobileImage, mobileImagePath, size, isActive, category } = req.body;
    
    const updateData = {};
    if (pageSlug !== undefined) updateData.pageSlug = pageSlug.toLowerCase().trim();
    if (webImage !== undefined) updateData.webImage = webImage;
    if (webImagePath !== undefined) updateData.webImagePath = webImagePath || null;
    if (mobileImage !== undefined) updateData.mobileImage = mobileImage || null;
    if (mobileImagePath !== undefined) updateData.mobileImagePath = mobileImagePath || null;
    if (size !== undefined) updateData.size = size;
    if (category !== undefined) updateData.category = category || null;
    if (isActive !== undefined) {
      updateData.isActive = (isActive === true || isActive === 'true');
    }

    const banner = await prisma.banner.update({
      where: { id: Number(id) },
      data: updateData
    });

    // Mirror update to live backend asynchronously
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        fetch(`https://paidhu-final-anm2.vercel.app/api/banners/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify(updateData)
        }).catch(() => {});
      }
    } catch (e) {}

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

    // Mirror delete to live backend asynchronously
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        fetch(`https://paidhu-final-anm2.vercel.app/api/banners/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': authHeader }
        }).catch(() => {});
      }
    } catch (e) {}

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
