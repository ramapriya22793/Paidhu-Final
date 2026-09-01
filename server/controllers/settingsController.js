const prisma = require("../prismaClient");
const supabase = require("../utils/supabaseClient");

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
    const supabaseUrl = process.env.SUPABASE_URL || 'https://fvtgukindzmoiwqqkwcl.supabase.co';
    let files = [];
    let bucketName = 'products';
    let folderName = 'starting floral habits videos';

    // 1. Primary: List directly from Supabase storage under bucket 'products' and folder 'starting floral habits videos'
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(folderName, {
          limit: 50,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (!error && data && data.length > 0) {
        files = data;
      }
    } catch (sErr) {
      console.warn("Could not list from products/starting floral habits videos:", sErr);
    }

    // 2. Fallback: Check other possible folder names in 'products' bucket if empty
    if (!files || files.length === 0) {
      const fallbackFolders = ['videos', 'starting-floral-food-habitat'];
      for (const fld of fallbackFolders) {
        try {
          const { data, error } = await supabase.storage.from(bucketName).list(fld, { limit: 50 });
          if (!error && data && data.length > 0) {
            files = data;
            folderName = fld;
            break;
          }
        } catch (e) {}
      }
    }

    // 3. Fallback: Check bucket 'starting-floral-food-habitat'
    if (!files || files.length === 0) {
      try {
        const { data, error } = await supabase.storage.from('starting-floral-food-habitat').list('', { limit: 50 });
        if (!error && data && data.length > 0) {
          files = data;
          bucketName = 'starting-floral-food-habitat';
          folderName = '';
        }
      } catch (e) {}
    }

    // 4. Fallback: PostgreSQL direct query if storage API was unavailable
    if (!files || files.length === 0) {
      try {
        const objects = await prisma.$queryRawUnsafe(`
          SELECT name, metadata, created_at FROM storage.objects
          WHERE bucket_id IN ('products', 'starting-floral-food-habitat')
            AND (name ILIKE '%habitat%' OR name ILIKE '%floral%' OR name ILIKE '%habit%')
          ORDER BY created_at ASC
        `);
        if (objects && objects.length > 0) {
          files = objects.map(o => ({
            name: o.name.includes('/') ? o.name.split('/').pop() : o.name,
            fullName: o.name,
            created_at: o.created_at,
            metadata: o.metadata
          }));
        }
      } catch (pErr) {}
    }

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

    const videos = (files || [])
      .filter(file => {
        const name = (file.name || '').toLowerCase();
        return name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.webm');
      })
      .map((file, index) => {
        const pathPart = folderName ? `${encodeURIComponent(folderName)}/${encodeURIComponent(file.name)}` : encodeURIComponent(file.name);
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${pathPart}`;
        const sizeBytes = file.metadata?.size || 0;

        return {
          id: file.name,
          name: file.name,
          url: publicUrl,
          size: sizeBytes,
          createdAt: file.created_at || file.updated_at || new Date().toISOString(),
          title: titles[index % titles.length],
          description: descs[index % descs.length],
          likes: Math.floor((index * 137 + 452) % 350) + 120,
          shares: Math.floor((index * 47 + 56) % 120) + 24
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
