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

const getHabitatVideos = async (req, res) => {
  try {
    const objects = await prisma.$queryRawUnsafe(`
      SELECT name, metadata, created_at FROM storage.objects
      WHERE bucket_id = 'starting-floral-food-habitat'
      ORDER BY created_at ASC
    `);

    const videos = objects
      .filter(obj => {
        const name = obj.name.toLowerCase();
        return name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.webm');
      })
      .map((obj, index) => {
        const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/starting-floral-food-habitat/${encodeURIComponent(obj.name)}`;
        const sizeBytes = obj.metadata?.size || 0;
        
        // Create an elegant visual title
        const titles = [
          "Curated Floral Food Starter Pack 🌸",
          "Nourishing Your Family Naturally 🍯",
          "Rich Organic Flower Medleys 🌺",
          "Artisanal Farm-to-Table Process 🌿",
          "Healthy Living and Floral Habitats ✨"
        ];
        const title = titles[index % titles.length];

        const descs = [
          "Discover how our hand-selected botanical ingredients support daily vitality.",
          "Wholesome nutrients direct from organic floral habitats, zero preservatives.",
          "Hand-mixed blossoms and roots curated for premium flavor and nutrition.",
          "Our sustainable sourcing ensures the purest grade of floral wellness.",
          "Bring nature's premium superfoods into your home and pantry."
        ];
        const desc = descs[index % descs.length];

        return {
          id: obj.name,
          name: obj.name,
          url: publicUrl,
          size: sizeBytes,
          createdAt: obj.created_at,
          title,
          description: desc,
          likes: Math.floor((index * 137 + 452) % 350) + 120, // Stable, dynamic mock likes
          shares: Math.floor((index * 47 + 56) % 120) + 24 // Stable, dynamic mock shares
        };
      });

    res.json(videos);
  } catch (error) {
    console.error("Error in getHabitatVideos:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getHabitatVideos
};
