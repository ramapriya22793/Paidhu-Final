const prisma = require("../prismaClient");

const getSettings = async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      // Create default if none exists
      settings = await prisma.siteSettings.create({
        data: {
          heroTitle: "Premium Artisanal Floral Foods",
          heroSubtitle: "Handcrafted with the finest botanical ingredients for a luxurious gourmet experience.",
          heroImage: "https://images.unsplash.com/photo-1490818387583-1b0570f550ce?auto=format&fit=crop&q=80",
          communityTitle: "The Paidhu Club",
          communitySubtitle: "Join our exclusive community of luxury floral food lovers.",
          communityImage: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&q=80",
        }
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { 
      heroTitle, heroSubtitle, heroBgColor, heroImage, 
      communityTitle, communitySubtitle, communityImage, 
      faqList, promoText,
      videoTitle, videoSubtitle, videoUrl, videoThumbnail,
      featureIcons,
      productTabs, navbarLinks, dealCategories,
      familyTitle, familyTabs, floralHabitatData, byocData, ourCommunityData, ourPhilosophyData, bulkOrdersData, aboutUsData, categoryGridData
    } = req.body;
    let settings = await prisma.siteSettings.findFirst();
    
    const updateData = {};
    if (heroTitle !== undefined) updateData.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) updateData.heroSubtitle = heroSubtitle;
    if (heroBgColor !== undefined) updateData.heroBgColor = heroBgColor;
    if (heroImage !== undefined) updateData.heroImage = heroImage;
    if (communityTitle !== undefined) updateData.communityTitle = communityTitle;
    if (communitySubtitle !== undefined) updateData.communitySubtitle = communitySubtitle;
    if (communityImage !== undefined) updateData.communityImage = communityImage;
    if (faqList !== undefined) updateData.faqList = faqList;
    if (promoText !== undefined) updateData.promoText = promoText;
    if (videoTitle !== undefined) updateData.videoTitle = videoTitle;
    if (videoSubtitle !== undefined) updateData.videoSubtitle = videoSubtitle;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (videoThumbnail !== undefined) updateData.videoThumbnail = videoThumbnail;
    if (featureIcons !== undefined) updateData.featureIcons = featureIcons;
    if (productTabs !== undefined) updateData.productTabs = productTabs;
    if (navbarLinks !== undefined) updateData.navbarLinks = navbarLinks;
    if (dealCategories !== undefined) updateData.dealCategories = dealCategories;
    if (familyTitle !== undefined) updateData.familyTitle = familyTitle;
    if (familyTabs !== undefined) updateData.familyTabs = familyTabs;
    if (floralHabitatData !== undefined) updateData.floralHabitatData = floralHabitatData;
    if (byocData !== undefined) updateData.byocData = byocData;
    if (ourCommunityData !== undefined) updateData.ourCommunityData = ourCommunityData;
    if (ourPhilosophyData !== undefined) updateData.ourPhilosophyData = ourPhilosophyData;
    if (bulkOrdersData !== undefined) updateData.bulkOrdersData = bulkOrdersData;
    if (aboutUsData !== undefined) updateData.aboutUsData = aboutUsData;
    if (categoryGridData !== undefined) updateData.categoryGridData = categoryGridData;

    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: updateData
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: updateData
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
