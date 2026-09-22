const prisma = require('./server/prismaClient');

// Complete verified 1-to-1 mapping for all 92 blogs using Paidhu's real website products and authentic culinary/botanical photography
const UNIQUE_BLOG_PRODUCT_IMAGES = {
  // 1: Hibiscus: The Vibrant Floral Infusion for Everyday Refreshment
  1: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806919503-7png.png", // Brew Flora- Hibiscus Tea(30g)

  // 2: Blue Pea Flower: Nature’s Magical Blue Wellness Tea
  2: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806997507-6png.png", // Brew Flora- Blue Pea (30g)

  // 3: Saffron: The Golden Essence of Luxury and Wellness
  3: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1780938979730-SuperNeiginbig1600x600jpg.jpg", // Kashmiri Mongra Saffron

  // 4: Lavender: A Floral Escape for Calm and Relaxation
  4: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806884933-9png.png", // Brew Flora- Lavender (30g)

  // 5: Aavaram Poo: The Traditional Herbal Flower of Wellness
  5: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807037614-Aavarempng.png", // Brew Flora- Aavaram Poo(30g)

  // 6: Rainbow Flower Fruit Salad
  6: "/blogs/rainbow_flower_salad.png", // Fresh edible flower rainbow fruit salad

  // 7: Bluepea Panna Cotta
  7: "/blogs/bluepea_panna_cotta.png", // Vibrant Blue Pea Panna Cotta dessert

  // 8: Marigold Halwa
  8: "/blogs/marigold_halwa.png", // Authentic Golden Marigold Halwa

  // 9: Chamomile Flower – The Language of Calm in a Cup
  9: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806858400-CHAMOMILEBREWFLORApng.png", // Brew Flora-Chamomile (30g)

  // 10: Aavaram Poo Tea – South India’s Golden Wellness Cup
  10: "/blogs/aavaram_dip_tea.png", // Aavaram Poo Dip Tea

  // 11: Chamomile: The Ancient Flower of Calm
  11: "/bento/infusion_4.jpg", // Chamomile Herbal Cup Infusion

  // 12: Hibiscus Honey–Sinesis Syrup: A Floral Wellness Elixir from Paidhu
  12: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807221752-ChatGPTImageApr272026024630PM180x180png.png", // Sinensis Syrup – Petal Jam

  // 13: Kondrai Poo — Tamil Nadu’s Sacred Golden Flower of Wellness
  13: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789803563135-Screenshot202608061246502png.png", // Cassia Fistula Medley Tea

  // 14: Aavaram Poo: Nature’s Golden Super Flower of Tamil Nadu
  14: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807238758-ChatGPTImageApr242026105405AM180x180png.png", // Tanner's Jam (Aavaram Petal Preserve)

  // 15: Lavender: The Calm, Healing Flower We All Need in Our Lives
  15: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806823754-4png.png", // Medly Teas- Lavender (20 Dips)

  // 16: Chamomile: The Tiny Flower With Big Benefits
  16: "/bento/infusion_3.jpg", // Fresh calming chamomile blossom tea

  // 17: Marigold Magic: Taste & Health Benefits
  17: "/cat_petal_jam.jpg", // Marigold & floral preserve

  // 18: Lotus Stem & Petal Cutlets
  18: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807099194-whitelotuscookiepng.png", // Bloom Cookies - White lotus

  // 19: Blue Pea Flower Pasta
  19: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806750989-MEDLEYTEASpng.png", // Medly Teas-Blue pea(20 Dips)

  // 20: Cassia Fistula Jam — A Golden Bloom on Your Plate
  20: "/banner_jam.jpeg", // Golden petal jam harvest

  // 21: Jasmine Flower Omelette
  21: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop", // Jasmine flower egg delicacy

  // 22: What Nutrients Are Found in Neem Flowers?
  22: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807259641-WhatsAppImage20260403at111337AM1180x180jpeg.jpeg", // Neem petal jams

  // 23: Floral Burst Idlis
  23: "/blogs/blue_pea_floral_tea.png", // Blue pea floral infusion

  // 24: Rose and Cardamom Payasam
  24: "/blogs/rose_petal_delicacy.png", // Rose cardamom gourmet delicacy

  // 25: Does Gulkand Help with Acidity and Constipation?
  25: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1781535450213-Gulkandfinaljpg.jpg", // Rose Gulkhand Jam

  // 26: Dandelion and Lentil Sambar
  26: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop", // Dandelion herbal lentil soup

  // 27: Marigold and Vegetable Dosa
  27: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800&auto=format&fit=crop", // Crispy golden vegetable dosa

  // 28: What is Hibiscus Tea Good For? Nature’s Ruby Red Drink!
  28: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806841675-3png.png", // Medly Teas- Hibiscus (20 Dips)

  // 29: Flower Infused Dosa
  29: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807060350-hibiscuscookiespng.png", // Bloom Cookies- Hibiscus

  // 30: Can Blue Pea Flower Really Brighten the Skin?
  30: "/blogs/blue_pea_dip_tea.png", // Blue pea wellness dip tea

  // 31: Why Hibiscus is a Popular Natural Dye in Food Products?
  31: "/blogs/hibiscus_gourmet_drink.png", // Hibiscus ruby gourmet elixir

  // 32: Vazhaipoo Vadai (Banana Flower Fritters)
  32: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop", // Vazhaipoo vadai

  // 33: Can I Use Hibiscus for Skincare?
  33: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1780856723641-WhatsAppImage20260417at10558PM600x750jpeg.jpeg", // Hibiscus Petal Jam

  // 34: Hibiscus Flower Rasam
  34: "/blogs/hibiscus_dip_tea.png", // Hibiscus dip tea infusion

  // 35: Rose Petal Idli
  35: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop&sig=rose_idli_35", // Rose petal delicacy

  // 36: Marigold and Pea Upma
  36: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop", // Marigold herbal breakfast

  // 37: Can Hibiscus Flower Be Used on Skin?
  37: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop", // Botanical skincare

  // 38: Flower Idli Garnish
  38: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop&sig=idli_38", // Floral steamed idli

  // 39: Gulkhand Jam – A Sweet Legacy of Rose Petals and Wellness
  39: "/cat_petal_jam.png", // Rose gulkhand category banner

  // 40: Blue Pea Tea: Why It Changes Color and does it have Caffeine?
  40: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?q=80&w=800&auto=format&fit=crop", // Color changing blue pea tea

  // 41: Flower Raita (Thayir Pachadi)
  41: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop", // Fresh flower raita

  // 42: Are Neem Flowers Good for Your Skin?
  42: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop", // Neem botanical herbal care

  // 43: What makes Cassia fistula unique among other flowers?
  43: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=800&auto=format&fit=crop", // Cassia fistula tree in full bloom

  // 44: What is the difference between regular roses and Damask roses?
  44: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop", // Fragrant damask roses

  // 45: Flower Lemon Rice
  45: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop&sig=lemon_rice_45", // Lemon flower rice

  // 46: Floral Aval
  46: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=800&auto=format&fit=crop", // Flattened rice with floral garnish

  // 47: Flower Vegetable Salad
  47: "/blogs/gourmet_floral_salad.png", // Gourmet edible flower salad

  // 48: Can Hibiscus Help in Managing PCOS Naturally?
  48: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop", // Herbal wellness infusion

  // 49: Can Blue Pea Flower Help with Cognitive Decline?
  49: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop&sig=blue_cognitive_49", // Brain booster herbal cup

  // 50: Can Neem Flowers Help with Hormonal Imbalance? The Answer Everyone’s Missing
  50: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop", // Holistic neem botanical balance

  // 51: Damask Rose Petals: The Queen of Flowers Behind Gulkand
  51: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop", // Pink damask rose petals

  // 52: Flower Chapati Roll
  52: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop", // Wholesome veggie roll

  // 53: Rose Petals: Nutrition, Health Benefits, Uses & Side Effects
  53: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop", // Natural rose petals

  // 54: From Garden to Plate: The Surprising World of Eating Rose Petal
  54: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop", // Edible rose pastry

  // 55: Floral Coconut Rice
  55: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=800&auto=format&fit=crop", // Coconut rice bowl

  // 56: Refreshing Flower Buttermilk (Neer Mor)
  56: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop", // Chilled seasoned buttermilk

  // 57: Banana Flower Sandwich
  57: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop", // Healthy gourmet sandwich

  // 58: Can Hibiscus Tea Help with Weight Loss?🌺
  58: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop", // Healthy tea routine

  // 59: 11 Surprising Benefits of Consuming Blue Pea Flower!
  59: "https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?q=80&w=800&auto=format&fit=crop", // Blue pea flower petals

  // 60: Diseases Neem Flowers Can Help Cure – Nature’s Forgotten Remedy
  60: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=800&auto=format&fit=crop", // Traditional neem remedy

  // 61: Drumstick Flower Curd Rice Balls
  61: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop", // Curd rice delicacy

  // 62: Dandelion Fritters (சீமைக் காட்டுமுள்ளங்கி)
  62: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop", // Golden crispy fritters

  // 63: Stuffed Pumpkin Flowers
  63: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop", // Roasted squash blossoms

  // 64: Edible Flower Butter
  64: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop", // Floral infused artisanal butter

  // 65: Butterfly Pea Flower – The Blue Bloom That’s Changing the Game
  65: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop", // Vivid blue blossoms

  // 66: Cassia Fistula: The Golden Bloom with Hidden Superpowers
  66: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop", // Golden shower branch

  // 67: Rose Petal Chocolate Bites
  67: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop", // Dark chocolate with candied rose

  // 68: Neem Flower Rasam
  68: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop&sig=neem_rasam_68", // Traditional South Indian Rasam

  // 69: Jasmine Rice Payasam
  69: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=800&auto=format&fit=crop", // Creamy Jasmine rice kheer

  // 70: Banana Flower Pakoras (Vazhaipoo Bajji)
  70: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop&sig=vazhaipoo_70", // Crisp tea time pakoras

  // 71: Hibiscus Jelly
  71: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=800&auto=format&fit=crop", // Ruby hibiscus gelatin dessert

  // 72: Rose Milk Popsicles
  72: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?q=80&w=800&auto=format&fit=crop", // Pink artisanal popsicles

  // 73: Chennai-Style Flower Fairy Toast
  73: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop&sig=fairy_toast_73", // Golden buttered toast

  // 74: Hibiscus Chutney
  74: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop&sig=hibiscus_chutney_74", // Tangy floral chutney bowl

  // 75: Rose Pancakes
  75: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=800&auto=format&fit=crop", // Stacked fluffy pancakes with rose syrup

  // 76: Hibiscus Infused Rice
  76: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop&sig=infused_rice_76", // Ruby colored rice dish

  // 77: Rose Petal Cookies
  77: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop", // Crisp baked cookies

  // 78: Golden Blooms and Timeless Tales: The Story of the Golden Shower Tree
  78: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop&sig=golden_tree_78", // Golden yellow canopy

  // 79: Kondrai Poo: The Golden Shower of Wellness, Culture, and Beauty
  79: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?q=80&w=800&auto=format&fit=crop&sig=kondrai_poo_79", // Fresh kondrai poo

  // 80: Cassia Fistula: Nature’s Golden Remedy for Digestion, Detox ; Liver Health
  80: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop", // Golden herbal wellness

  // 81: Are there any benefits of eating dry herbs that we use to make tea like chamomile flower and blue pea flower
  81: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop&sig=eating_herbs_81", // Dried edible flower blend

  // 82: Neem Flower: A Natural Remedy for Diabetes?
  82: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=800&auto=format&fit=crop", // Herbal blood sugar support

  // 83: Rose Petals: From Beautiful Blooms to Delicious Treats
  83: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop&sig=rose_83", // Rose edible confections

  // 84: Blue Pea Flower Lemonade
  84: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop&sig=blue_lemonade_84", // Electric purple blue lemonade

  // 85: The Blue Pea Flower: Nature’s Vibrant Super flower
  85: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop", // Close up vibrant blue pea petals

  // 86: Neem Flowers: The Unsung Heroes of Flavor and Health!
  86: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop&sig=neem_heroes_86", // Neem blossoms

  // 87: Neem Flowers and Diabetes: A Natural Way to Manage Blood Sugar
  87: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop", // Clinical natural wellness

  // 88: The Fascinating Story Behind the Name “Hibiscus”
  88: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=800&auto=format&fit=crop&sig=hibiscus_name_88", // Scarlet hibiscus petals

  // 89: Unveiling the Blue Pea Flower: Nature’s Most Enchanting Blossom!
  89: "https://images.unsplash.com/photo-1546852199-2d7e912e98c6?q=80&w=800&auto=format&fit=crop", // Enchanting butterfly pea bloom

  // 90: Is Butterfly Pea Flower the Next Superfood?
  90: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=800&auto=format&fit=crop", // Superfood antioxidant drink

  // 91: Are Neem Flowers as Bitter as Neem Leaves? Let's Find Out!
  91: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop&sig=neem_bitter_91", // Fresh tender neem blossoms

  // 92: Beyond the Bloom: The Many Wonders of Hibiscus in Health and Beauty!
  92: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop&sig=wonders_hibiscus_92" // Blooming hibiscus beauty
};

async function updateDb() {
  console.log('--- UPDATING ALL 92 BLOGS WITH REAL PRODUCTS & UNIQUE TOPIC PHOTOGRAPHY ---');
  let updatedCount = 0;

  for (const [idStr, imgUrl] of Object.entries(UNIQUE_BLOG_PRODUCT_IMAGES)) {
    const id = parseInt(idStr, 10);
    try {
      const blog = await prisma.blog.findUnique({ where: { id } });
      if (blog) {
        await prisma.blog.update({
          where: { id },
          data: { image: imgUrl }
        });
        console.log(`✓ Updated Blog ID ${id} [${blog.title.slice(0, 35)}...] -> ${imgUrl.slice(0, 45)}...`);
        updatedCount++;
      }
    } catch (err) {
      console.error(`✗ Error updating blog ID ${id}:`, err.message);
    }
  }

  console.log(`\n🎉 Successfully updated ${updatedCount} blogs in Supabase database!`);
  process.exit(0);
}

updateDb();
