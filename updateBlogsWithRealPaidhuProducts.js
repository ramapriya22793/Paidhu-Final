const prisma = require('./server/prismaClient');

// Real Paidhu website product images
const PAIDHU_REAL_PRODUCTS = {
  aavaram_brew_flora: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807037614-Aavarempng.png",
  aavaram_cookies: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807081906-AAVARAMPOOpng.png",
  aavaram_brew_alt: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806532876-Aavarempng.png",
  
  lavender_medley: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806823754-4png.png",
  lavender_brew_flora: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806884933-9png.png",
  
  saffron_mongra: "https://wp.paidhu.com/wp-content/uploads/2024/08/Super-Neigin-big-1.jpg",
  saffron_powder: "https://wp.paidhu.com/wp-content/uploads/2024/08/DSC07565-scaled.jpg",
  saffron_super_negin: "https://wp.paidhu.com/wp-content/uploads/2024/08/saffron-neign.jpg",
  saffron_medley: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806804404-2png.png",
  saffron_giftbox: "https://wp.paidhu.com/wp-content/uploads/2024/08/gift-box-big-2.jpg",
  
  bluepea_brew_flora: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806997507-6png.png",
  bluepea_medley: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806750989-MEDLEYTEASpng.png",
  
  hibiscus_brew_flora: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806919503-7png.png",
  hibiscus_medley: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806841675-3png.png",
  hibiscus_cookies: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807060350-hibiscuscookiespng.png",
  hibiscus_jam: "https://wp.paidhu.com/wp-content/uploads/2026/04/WhatsApp-Image-2026-04-17-at-1.05.58-PM.jpeg",
  sinensis_syrup: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807221752-ChatGPTImageApr272026024630PM180x180png.png",
  
  chamomile_brew_flora: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789806858400-CHAMOMILEBREWFLORApng.png",
  
  whitelotus_cookies: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807099194-whitelotuscookiepng.png",
  
  rose_gulkhand: "https://wp.paidhu.com/wp-content/uploads/2025/07/Gulkand-final.jpg",
  neem_jam: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807259641-WhatsAppImage20260403at111337AM1180x180jpeg.jpeg",
  tanners_jam: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789807238758-ChatGPTImageApr242026105405AM180x180png.png",
  cassia_medley: "https://xittsoabiuzuzrzdjktb.supabase.co/storage/v1/object/public/products/products/1789803563135-Screenshot202608061246502png.png"
};

const BLOG_REAL_PRODUCT_MAP = {
  1: PAIDHU_REAL_PRODUCTS.hibiscus_brew_flora,
  2: PAIDHU_REAL_PRODUCTS.bluepea_brew_flora,
  3: PAIDHU_REAL_PRODUCTS.saffron_mongra,
  4: PAIDHU_REAL_PRODUCTS.lavender_medley,
  5: PAIDHU_REAL_PRODUCTS.aavaram_brew_flora,
  6: PAIDHU_REAL_PRODUCTS.bluepea_medley,
  7: PAIDHU_REAL_PRODUCTS.bluepea_brew_flora,
  8: PAIDHU_REAL_PRODUCTS.tanners_jam,
  9: PAIDHU_REAL_PRODUCTS.chamomile_brew_flora,
  10: PAIDHU_REAL_PRODUCTS.aavaram_cookies,
  11: PAIDHU_REAL_PRODUCTS.chamomile_brew_flora,
  12: PAIDHU_REAL_PRODUCTS.sinensis_syrup,
  13: PAIDHU_REAL_PRODUCTS.cassia_medley,
  14: PAIDHU_REAL_PRODUCTS.aavaram_brew_alt,
  15: PAIDHU_REAL_PRODUCTS.lavender_brew_flora,
  16: PAIDHU_REAL_PRODUCTS.chamomile_brew_flora,
  17: PAIDHU_REAL_PRODUCTS.tanners_jam,
  18: PAIDHU_REAL_PRODUCTS.whitelotus_cookies,
  19: PAIDHU_REAL_PRODUCTS.bluepea_medley,
  20: PAIDHU_REAL_PRODUCTS.cassia_medley,
  21: PAIDHU_REAL_PRODUCTS.whitelotus_cookies,
  22: PAIDHU_REAL_PRODUCTS.neem_jam,
  23: PAIDHU_REAL_PRODUCTS.aavaram_brew_flora,
  24: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  25: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  26: PAIDHU_REAL_PRODUCTS.tanners_jam,
  27: PAIDHU_REAL_PRODUCTS.tanners_jam,
  28: PAIDHU_REAL_PRODUCTS.hibiscus_medley,
  29: PAIDHU_REAL_PRODUCTS.aavaram_cookies,
  30: PAIDHU_REAL_PRODUCTS.bluepea_brew_flora,
  31: PAIDHU_REAL_PRODUCTS.hibiscus_brew_flora,
  32: PAIDHU_REAL_PRODUCTS.aavaram_cookies,
  33: PAIDHU_REAL_PRODUCTS.hibiscus_jam,
  34: PAIDHU_REAL_PRODUCTS.hibiscus_brew_flora,
  35: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  36: PAIDHU_REAL_PRODUCTS.aavaram_cookies,
  37: PAIDHU_REAL_PRODUCTS.hibiscus_jam,
  38: PAIDHU_REAL_PRODUCTS.whitelotus_cookies,
  39: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  40: PAIDHU_REAL_PRODUCTS.bluepea_brew_flora,
  41: PAIDHU_REAL_PRODUCTS.whitelotus_cookies,
  42: PAIDHU_REAL_PRODUCTS.neem_jam,
  43: PAIDHU_REAL_PRODUCTS.cassia_medley,
  44: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  45: PAIDHU_REAL_PRODUCTS.aavaram_brew_flora,
  46: PAIDHU_REAL_PRODUCTS.bluepea_medley,
  47: PAIDHU_REAL_PRODUCTS.whitelotus_cookies,
  48: PAIDHU_REAL_PRODUCTS.hibiscus_medley,
  49: PAIDHU_REAL_PRODUCTS.bluepea_brew_flora,
  50: PAIDHU_REAL_PRODUCTS.neem_jam,
  51: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  52: PAIDHU_REAL_PRODUCTS.aavaram_cookies,
  53: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  54: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  55: PAIDHU_REAL_PRODUCTS.bluepea_brew_flora,
  56: PAIDHU_REAL_PRODUCTS.aavaram_brew_flora,
  57: PAIDHU_REAL_PRODUCTS.whitelotus_cookies,
  58: PAIDHU_REAL_PRODUCTS.hibiscus_brew_flora,
  59: PAIDHU_REAL_PRODUCTS.bluepea_medley,
  60: PAIDHU_REAL_PRODUCTS.neem_jam,
  61: PAIDHU_REAL_PRODUCTS.aavaram_cookies,
  62: PAIDHU_REAL_PRODUCTS.tanners_jam,
  63: PAIDHU_REAL_PRODUCTS.tanners_jam,
  64: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  65: PAIDHU_REAL_PRODUCTS.bluepea_brew_flora,
  66: PAIDHU_REAL_PRODUCTS.cassia_medley,
  67: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  68: PAIDHU_REAL_PRODUCTS.neem_jam,
  69: PAIDHU_REAL_PRODUCTS.whitelotus_cookies,
  70: PAIDHU_REAL_PRODUCTS.aavaram_cookies,
  71: PAIDHU_REAL_PRODUCTS.hibiscus_jam,
  72: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  73: PAIDHU_REAL_PRODUCTS.whitelotus_cookies,
  74: PAIDHU_REAL_PRODUCTS.hibiscus_jam,
  75: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  76: PAIDHU_REAL_PRODUCTS.hibiscus_brew_flora,
  77: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  78: PAIDHU_REAL_PRODUCTS.cassia_medley,
  79: PAIDHU_REAL_PRODUCTS.cassia_medley,
  80: PAIDHU_REAL_PRODUCTS.cassia_medley,
  81: PAIDHU_REAL_PRODUCTS.chamomile_brew_flora,
  82: PAIDHU_REAL_PRODUCTS.neem_jam,
  83: PAIDHU_REAL_PRODUCTS.rose_gulkhand,
  84: PAIDHU_REAL_PRODUCTS.bluepea_brew_flora,
  85: PAIDHU_REAL_PRODUCTS.bluepea_medley,
  86: PAIDHU_REAL_PRODUCTS.neem_jam,
  87: PAIDHU_REAL_PRODUCTS.neem_jam,
  88: PAIDHU_REAL_PRODUCTS.hibiscus_brew_flora,
  89: PAIDHU_REAL_PRODUCTS.bluepea_brew_flora,
  90: PAIDHU_REAL_PRODUCTS.bluepea_medley,
  91: PAIDHU_REAL_PRODUCTS.neem_jam,
  92: PAIDHU_REAL_PRODUCTS.hibiscus_brew_flora
};

async function updateBlogs() {
  console.log('Starting blog updates with real Paidhu website products...');
  
  // Update Blog 14 title if needed
  await prisma.blog.updateMany({
    where: { id: 14 },
    data: {
      title: "Aavaram Poo: Nature’s Golden Super Flower of Tamil Nadu",
      slug: "aavaram-poo-natures-golden-super-flower-of-tamil-nadu",
      category: "Brew Flora- Aavaram Poo"
    }
  });

  const blogs = await prisma.blog.findMany({ select: { id: true, title: true } });
  
  let updated = 0;
  for (const b of blogs) {
    const realImg = BLOG_REAL_PRODUCT_MAP[b.id] || PAIDHU_REAL_PRODUCTS.aavaram_brew_flora;
    await prisma.blog.update({
      where: { id: b.id },
      data: {
        image: realImg,
        featuredImage: realImg
      }
    });
    updated++;
  }
  
  console.log(`Updated ${updated} blogs with real Paidhu product photography.`);
}

updateBlogs()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
