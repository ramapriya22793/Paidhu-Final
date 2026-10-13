const prisma = require("../prismaClient");
const { getR2Client, bucketName: r2BucketName, isR2Configured, getR2PublicUrl } = require("../utils/r2Client");
const { ListObjectsV2Command } = require("@aws-sdk/client-s3");

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
    const titles = [
      "Curated Floral Food Starter Pack 🌸",
      "Nourishing Your Family Naturally 🍯",
      "Rich Natural Flower Medleys 🌺",
      "Artisanal Farm-to-Table Process 🌿",
      "Healthy Living and Floral Habitats ✨",
      "Pure Botanical Goodness Daily 🌼"
    ];

    const descs = [
      "Discover how our hand-selected botanical ingredients support daily vitality.",
      "Wholesome nutrients direct from natural floral habitats, zero preservatives.",
      "Hand-mixed blossoms and roots curated for premium flavor and nutrition.",
      "Our sustainable sourcing ensures the purest grade of floral wellness.",
      "Bring nature's premium superfoods into your home and pantry.",
      "Experience wholesome edible flower nourishment crafted for your whole family."
    ];

    // List exclusively from Cloudflare R2
    if (isR2Configured()) {
      const client = getR2Client();
      const r2Res = await client.send(new ListObjectsV2Command({
        Bucket: r2BucketName,
        Prefix: 'starting floral habits videos',
        MaxKeys: 50,
      }));

      const r2Items = (r2Res.Contents || []).filter(item => {
        const key = (item.Key || '').toLowerCase();
        return key.endsWith('.mp4') || key.endsWith('.mov') || key.endsWith('.webm');
      });

      const videos = r2Items.map((item, index) => {
        const fileName = item.Key.split('/').pop();
        return {
          id: fileName,
          name: fileName,
          url: getR2PublicUrl(item.Key, req),
          size: item.Size || 0,
          createdAt: item.LastModified ? item.LastModified.toISOString() : new Date().toISOString(),
          title: titles[index % titles.length],
          description: descs[index % descs.length],
          likes: Math.floor((index * 137 + 452) % 350) + 120,
          shares: Math.floor((index * 47 + 56) % 120) + 24,
          storage: 'cloudflare-r2'
        };
      });
      return res.json(videos);
    }

    return res.json([]);
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
