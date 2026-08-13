const prisma = require("../prismaClient");

// --- Helper: Calculate dynamic SEO Score (0 - 100) ---
const calculateSeoScore = (seo, product) => {
  let score = 0;
  const primaryKw = (seo.primaryKeyword || "").trim().toLowerCase();
  const secondaryKws = Array.isArray(seo.secondaryKeywords) ? seo.secondaryKeywords : [];
  const title = (seo.seoTitle || seo.seoFriendlyPageTitle || product?.name || "").trim();
  const metaDesc = (seo.metaDescription || "").trim();
  const slug = (seo.seoSlug || product?.slug || "").trim().toLowerCase();
  const prodDesc = (seo.seoProductDescription || product?.description || "").trim();
  const internalLinks = Array.isArray(seo.internalLinks) ? seo.internalLinks : [];
  const imageSeo = Array.isArray(seo.imageSeo) ? seo.imageSeo : [];
  const faqs = Array.isArray(seo.faqs) ? seo.faqs : [];
  const schema = seo.productSchema;

  // 1. Keyword Optimization (max 20 pts)
  if (primaryKw) {
    score += 5;
    if (secondaryKws.length >= 2) score += 5;
    if (title.toLowerCase().includes(primaryKw)) score += 4;
    if (metaDesc.toLowerCase().includes(primaryKw)) score += 3;
    if (slug.includes(primaryKw.replace(/\s+/g, "-"))) score += 3;
  }

  // 2. Title Optimization (max 20 pts)
  if (title) {
    score += 5;
    const len = title.length;
    if (len >= 45 && len <= 65) {
      score += 15;
    } else if ((len >= 30 && len < 45) || (len > 65 && len <= 75)) {
      score += 8;
    }
  }

  // 3. Meta Description (max 15 pts)
  if (metaDesc) {
    score += 5;
    const len = metaDesc.length;
    if (len >= 130 && len <= 165) {
      score += 10;
    } else if ((len >= 90 && len < 130) || (len > 165 && len <= 180)) {
      score += 5;
    }
  }

  // 4. URL Optimization (max 10 pts)
  if (slug) {
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) score += 5;
    if (primaryKw && slug.includes(primaryKw.replace(/\s+/g, "-"))) score += 5;
  }

  // 5. Content Optimization (max 15 pts)
  const wordCount = prodDesc ? prodDesc.split(/\s+/).filter(Boolean).length : 0;
  if (wordCount >= 100) {
    score += 10;
  } else if (wordCount >= 50) {
    score += 5;
  }
  if (/<h[23][^>]*>/i.test(prodDesc) || prodDesc.includes("##")) {
    score += 5;
  }

  // 6. Internal Linking (max 10 pts)
  if (internalLinks.length >= 1) score += 5;
  if (internalLinks.length >= 2) score += 5;

  // 7. Image SEO (max 5 pts)
  if (imageSeo.length > 0) {
    const hasAltOnAll = imageSeo.every(img => img.altText && img.altText.trim().length > 0);
    if (hasAltOnAll) score += 5;
    else score += 2;
  }

  // 8. Product Schema (max 5 pts)
  if (schema && typeof schema === 'object' && schema['@type'] === 'Product' && schema.name) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
};

// --- Helper: Dynamic Keyword Placement Analysis ---
const analyzeKeywordPlacement = (primaryKw, data, product) => {
  const kw = (primaryKw || "").trim().toLowerCase();
  const check = (text) => {
    if (!kw || !text) return false;
    return text.toString().toLowerCase().includes(kw);
  };

  const title = data.seoTitle || data.seoFriendlyPageTitle || product?.name || "";
  const metaDesc = data.metaDescription || "";
  const slug = data.seoSlug || product?.slug || "";
  const desc = data.seoProductDescription || product?.description || "";
  const h1 = product?.name || title;
  const hasH2 = (desc.match(/<h2[^>]*>(.*?)<\/h2>/gi) || []).some(h => check(h)) || (desc.match(/##\s*(.*)/g) || []).some(h => check(h));
  
  const imageAlts = (data.imageSeo || []).map(img => img.altText || "").join(" ");
  const internalAnchorTexts = (data.internalLinks || []).map(link => link.anchorText || "").join(" ");
  const faqsText = (data.faqs || []).map(f => `${f.question} ${f.answer}`).join(" ");
  const schemaText = JSON.stringify(data.productSchema || {});

  return [
    { location: "SEO Title", status: check(title) ? "optimized" : "missing", detail: "Primary keyword present in title" },
    { location: "Meta Description", status: check(metaDesc) ? "optimized" : "missing", detail: "Primary keyword present in meta description" },
    { location: "URL Slug", status: check(slug) ? "optimized" : "missing", detail: "Primary keyword present in URL slug" },
    { location: "Product Description", status: check(desc) ? "optimized" : "missing", detail: "Primary keyword present in body text" },
    { location: "H1 Heading", status: check(h1) ? "optimized" : "missing", detail: "Primary keyword in main product name / H1" },
    { location: "H2 Headings", status: hasH2 ? "optimized" : (desc ? "needs_improvement" : "missing"), detail: "Primary keyword in subheadings" },
    { location: "Image Alt Text", status: check(imageAlts) ? "optimized" : "needs_improvement", detail: "Primary keyword in image alt attributes" },
    { location: "Internal Link Anchor Text", status: check(internalAnchorTexts) ? "optimized" : "needs_improvement", detail: "Primary keyword in internal anchor texts" },
    { location: "FAQ Content", status: check(faqsText) ? "optimized" : "needs_improvement", detail: "Primary keyword in FAQ Q&A" },
    { location: "Product Schema", status: check(schemaText) ? "optimized" : "missing", detail: "Primary keyword in JSON-LD structured data" }
  ];
};

// --- Helper: Generate Default Schema ---
const generateDefaultProductSchema = (product, seoData = {}) => {
  const domain = process.env.PUBLIC_SITE_URL || "https://www.paidhuethicalfoods.com";
  const slug = seoData.seoSlug || product.slug;
  const canonicalUrl = seoData.canonicalUrl || `${domain}/product/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": seoData.seoTitle || seoData.seoFriendlyPageTitle || product.name,
    "description": seoData.metaDescription || product.shortDescription || product.description?.substring(0, 160),
    "image": product.image ? [product.image] : [],
    "sku": `PDH-PROD-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Paidhu"
    },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "INR",
      "price": (product.discountPrice || product.price || 0).toString(),
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };
};

// GET PRODUCT SEO DATA
const getProductSeo = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        productImages: true,
        productSeo: true
      }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let seo = product.productSeo;
    const domain = process.env.PUBLIC_SITE_URL || "https://www.paidhuethicalfoods.com";

    // Build default initial image SEO list if not explicitly stored
    const defaultImagesSeo = [];
    if (product.image) {
      defaultImagesSeo.push({
        imageId: "primary",
        altText: `${product.name} - Paidhu Premium`,
        title: product.name,
        caption: `${product.name} Edible Flower Product`,
        description: product.shortDescription || product.name
      });
    }
    if (product.productImages && product.productImages.length > 0) {
      product.productImages.forEach((img, idx) => {
        defaultImagesSeo.push({
          imageId: `gallery_${img.id}`,
          altText: `${product.name} View ${idx + 1}`,
          title: `${product.name} Image ${idx + 1}`,
          caption: `${product.name}`,
          description: `${product.name} image gallery`
        });
      });
    }

    // Default FAQs from product.faqData
    let defaultFaqs = [];
    if (product.faqData) {
      try {
        const parsed = typeof product.faqData === 'string' ? JSON.parse(product.faqData) : product.faqData;
        if (Array.isArray(parsed)) {
          defaultFaqs = parsed.map((f, i) => ({
            question: f.question || f.q || "",
            answer: f.answer || f.a || "",
            order: i + 1
          }));
        }
      } catch (e) {}
    }

    if (!seo) {
      // Pre-fill smart defaults for new product SEO
      const autoSlug = product.slug;
      const defaultSchema = generateDefaultProductSchema(product, { seoSlug: autoSlug });

      seo = {
        productId: product.id,
        primaryKeyword: product.name.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim(),
        secondaryKeywords: [product.category?.name || "Edible Flowers", "Paidhu Ethical Foods", "Premium Edible Flowers"],
        seoFriendlyPageTitle: `${product.name} | Premium Quality Paidhu`,
        seoTitle: `Buy ${product.name} Online | Paidhu`,
        metaDescription: `Buy premium ${product.name} online from Paidhu. High quality, food grade, natural floral products with fast delivery across India.`,
        seoSlug: autoSlug,
        seoProductDescription: `<h2>Premium ${product.name}</h2>\n<p>${product.description}</p>`,
        internalLinks: [
          { anchorText: "Shop All Products", targetId: "shop", targetType: "page", url: "/shop" },
          { anchorText: `Explore ${product.category?.name || "Category"}`, targetId: `${product.categoryId}`, targetType: "category", url: `/shop?category=${encodeURIComponent(product.category?.name || "")}` }
        ],
        imageSeo: defaultImagesSeo,
        productSchema: defaultSchema,
        faqs: defaultFaqs,
        seoScore: 0,
        canonicalUrl: `${domain}/product/${autoSlug}`,
        robotsIndex: "index",
        robotsFollow: "follow",
        lastUpdatedBy: "System Default",
        isNewDraft: true
      };
      seo.seoScore = calculateSeoScore(seo, product);
    }

    const keywordPlacement = analyzeKeywordPlacement(seo.primaryKeyword, seo, product);

    res.json({
      success: true,
      seo,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.image,
        category: product.category?.name,
        stock: product.stock
      },
      keywordPlacement
    });
  } catch (error) {
    console.error("Get product SEO error:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPSERT (CREATE / UPDATE) PRODUCT SEO DATA
const upsertProductSeo = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      primaryKeyword,
      secondaryKeywords,
      seoFriendlyPageTitle,
      seoTitle,
      metaDescription,
      seoSlug,
      seoProductDescription,
      internalLinks,
      imageSeo,
      productSchema,
      faqs,
      canonicalUrl,
      robotsIndex,
      robotsFollow,
      lastUpdatedBy
    } = req.body;

    // Sanitize & Format Slug
    let finalSlug = (seoSlug || product.slug)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (!finalSlug) {
      finalSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }

    // Check slug uniqueness against OTHER products
    const existingProductWithSlug = await prisma.product.findFirst({
      where: {
        slug: finalSlug,
        NOT: { id: productId }
      }
    });

    if (existingProductWithSlug) {
      return res.status(409).json({
        message: `The SEO Slug "${finalSlug}" is already used by product "${existingProductWithSlug.name}". Slugs must be unique.`
      });
    }

    // Prepare SEO Object for Score Calculation
    const seoDataForScore = {
      primaryKeyword: primaryKeyword ? primaryKeyword.trim() : "",
      secondaryKeywords: Array.isArray(secondaryKeywords) ? secondaryKeywords : [],
      seoFriendlyPageTitle,
      seoTitle,
      metaDescription,
      seoSlug: finalSlug,
      seoProductDescription,
      internalLinks: Array.isArray(internalLinks) ? internalLinks : [],
      imageSeo: Array.isArray(imageSeo) ? imageSeo : [],
      productSchema: productSchema || generateDefaultProductSchema(product, { seoSlug: finalSlug, seoTitle, metaDescription }),
      faqs: Array.isArray(faqs) ? faqs : [],
      canonicalUrl: canonicalUrl || `https://www.paidhuethicalfoods.com/product/${finalSlug}`,
      robotsIndex: robotsIndex || "index",
      robotsFollow: robotsFollow || "follow"
    };

    const calculatedScore = calculateSeoScore(seoDataForScore, product);

    // Upsert into ProductSeo table
    const savedSeo = await prisma.productSeo.upsert({
      where: { productId },
      create: {
        productId,
        primaryKeyword: seoDataForScore.primaryKeyword,
        secondaryKeywords: seoDataForScore.secondaryKeywords,
        seoFriendlyPageTitle: seoDataForScore.seoFriendlyPageTitle,
        seoTitle: seoDataForScore.seoTitle,
        metaDescription: seoDataForScore.metaDescription,
        seoSlug: seoDataForScore.seoSlug,
        seoProductDescription: seoDataForScore.seoProductDescription,
        internalLinks: seoDataForScore.internalLinks,
        imageSeo: seoDataForScore.imageSeo,
        productSchema: seoDataForScore.productSchema,
        faqs: seoDataForScore.faqs,
        seoScore: calculatedScore,
        canonicalUrl: seoDataForScore.canonicalUrl,
        robotsIndex: seoDataForScore.robotsIndex,
        robotsFollow: seoDataForScore.robotsFollow,
        lastUpdatedBy: lastUpdatedBy || "Admin"
      },
      update: {
        primaryKeyword: seoDataForScore.primaryKeyword,
        secondaryKeywords: seoDataForScore.secondaryKeywords,
        seoFriendlyPageTitle: seoDataForScore.seoFriendlyPageTitle,
        seoTitle: seoDataForScore.seoTitle,
        metaDescription: seoDataForScore.metaDescription,
        seoSlug: seoDataForScore.seoSlug,
        seoProductDescription: seoDataForScore.seoProductDescription,
        internalLinks: seoDataForScore.internalLinks,
        imageSeo: seoDataForScore.imageSeo,
        productSchema: seoDataForScore.productSchema,
        faqs: seoDataForScore.faqs,
        seoScore: calculatedScore,
        canonicalUrl: seoDataForScore.canonicalUrl,
        robotsIndex: seoDataForScore.robotsIndex,
        robotsFollow: seoDataForScore.robotsFollow,
        lastUpdatedBy: lastUpdatedBy || "Admin"
      }
    });

    // Keep Product table columns in sync!
    await prisma.product.update({
      where: { id: productId },
      data: {
        slug: finalSlug,
        seoTitle: savedSeo.seoTitle,
        seoDescription: savedSeo.metaDescription,
        seoKeywords: Array.isArray(savedSeo.secondaryKeywords) ? savedSeo.secondaryKeywords.join(", ") : "",
        faqData: savedSeo.faqs
      }
    });

    const keywordPlacement = analyzeKeywordPlacement(savedSeo.primaryKeyword, savedSeo, product);

    res.json({
      success: true,
      message: "SEO data saved successfully.",
      seo: savedSeo,
      keywordPlacement
    });
  } catch (error) {
    console.error("Save product SEO error:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE PRODUCT SEO DATA
const deleteProductSeo = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    await prisma.productSeo.deleteMany({
      where: { productId }
    });

    res.json({ success: true, message: "Product SEO reset to defaults." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHECK SLUG AVAILABILITY
const checkSlugAvailability = async (req, res) => {
  try {
    const { slug, productId } = req.query;
    if (!slug) {
      return res.status(400).json({ message: "Slug parameter is required" });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    const where = { slug: cleanSlug };

    if (productId && !isNaN(parseInt(productId))) {
      where.NOT = { id: parseInt(productId) };
    }

    const existing = await prisma.product.findFirst({ where });
    res.json({
      slug: cleanSlug,
      isAvailable: !existing,
      message: existing ? `Slug is already used by "${existing.name}"` : "Slug is available"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- GLOBAL SEO ENDPOINTS (Legacy pages support) ---
const getGlobalSeo = async (req, res) => {
  try {
    const seoData = await prisma.seoData.findMany();
    res.json(seoData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSeoBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const seo = await prisma.seoData.findUnique({
      where: { pageSlug: slug }
    });
    if (!seo) {
      return res.json({
        pageSlug: slug,
        title: "",
        description: "",
        keywords: ""
      });
    }
    res.json(seo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSeoBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description, keywords } = req.body;

    const seo = await prisma.seoData.upsert({
      where: { pageSlug: slug },
      update: { title, description, keywords },
      create: { pageSlug: slug, title, description, keywords }
    });

    res.json(seo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductSeo,
  upsertProductSeo,
  deleteProductSeo,
  checkSlugAvailability,
  getGlobalSeo,
  getSeoBySlug,
  updateSeoBySlug
};
