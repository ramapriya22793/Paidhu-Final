const prisma = require("../prismaClient");
const https = require("https");
const http = require("http");

const formatImageUrl = (url) => {
  if (!url) return null;
  if (url.includes('wp.paidhu.com')) {
    return `https://paidhu-final-anm2.vercel.app/api/products/image-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
};

const getImageProxy = (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send('Image URL is required');
  }

  try {
    const parsedUrl = new URL(imageUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    client.get(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (response) => {
      if (response.statusCode >= 400) {
        return res.status(response.statusCode).send('Failed to fetch image');
      }

      res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      response.pipe(res);
    }).on('error', (err) => {
      console.error('Image proxy error:', err.message);
      res.status(502).send('Proxy error');
    });
  } catch (err) {
    res.status(400).send('Invalid URL');
  }
};

// NAV SECTION → FILTER MAPPING
// Maps each navbar header to a Prisma where-clause builder

const navSectionFilters = {
  'shop-all': () => ({}),
  'deal-of-the-day': () => ({ status: { in: ['ACTIVE', 'PREORDER'] } }),
  'shop-by-category': (extra) => extra?.category ? { category: { name: { equals: extra.category, mode: 'insensitive' } } } : {},
  'for-your-family': () => ({ 
    OR: [
      { category: { name: { equals: 'Combos', mode: 'insensitive' } } },
      { category: { name: { equals: 'Family Combos', mode: 'insensitive' } } },
      { category: { name: { equals: 'Saffron', mode: 'insensitive' } } },
      { tags: { contains: 'combo', mode: 'insensitive' } },
      { tags: { contains: 'family', mode: 'insensitive' } },
      { tags: { contains: 'saffron', mode: 'insensitive' } }
    ] 
  }),
  'starting-floral-food-habitat': () => ({ tags: { contains: 'floral', mode: 'insensitive' } }),
  'byoc': () => ({ tags: { contains: 'byoc', mode: 'insensitive' } }),
  'our-own-community': () => ({ tags: { contains: 'community', mode: 'insensitive' } }),
  'our-philosophy': () => ({ tags: { contains: 'philosophy', mode: 'insensitive' } }),
  'bulk-orders': () => ({ tags: { contains: 'bulk', mode: 'insensitive' } }),
  'blogs': null, // handled separately – not products
  'about-us': null,
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;
    const tag = req.query.tag;
    const navSection = req.query.navSection; // e.g. 'deal-of-the-day'
    const search = req.query.search;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
    const sort = req.query.sort || 'newest'; // newest | price-asc | price-desc | discount
    const status = req.query.status;

    let where = {};
    if (status) {
      if (status !== 'all') {
        where.status = status;
      }
    } else {
      where.status = { in: ['ACTIVE', 'PREORDER'] };
    }

    // Nav section smart filters
    if (navSection && navSectionFilters[navSection]) {
      const filterFn = navSectionFilters[navSection];
      if (filterFn) {
        const navWhere = filterFn({ category });
        where = { ...where, ...navWhere };
      }
    } else {
      // Legacy category / tag filters
      if (category && category !== 'Shop All') {
        const catLower = category.toLowerCase();
        if (catLower === 'combos' || catLower === 'combos & gift boxes') {
          where.OR = [
            { category: { name: { equals: 'Combos', mode: 'insensitive' } } },
            { category: { name: { equals: 'Saffron Giftbox', mode: 'insensitive' } } },
            { tags: { contains: 'combo', mode: 'insensitive' } }
          ];
        } else {
          where.category = { name: { equals: category, mode: 'insensitive' } };
        }
      }
      if (tag) {
        where.tags = { contains: tag, mode: 'insensitive' };
      }
    }

    // Apply global category filter if provided and not already applied by nav section smart filter
    if (category && category !== 'Shop All' && !where.category && !where.OR) {
      const catLower = category.toLowerCase();
      if (catLower === 'combos' || catLower === 'combos & gift boxes') {
        where.OR = [
          { category: { name: { equals: 'Combos', mode: 'insensitive' } } },
          { category: { name: { equals: 'Saffron Giftbox', mode: 'insensitive' } } },
          { tags: { contains: 'combo', mode: 'insensitive' } }
        ];
      } else {
        where.category = { name: { equals: category, mode: 'insensitive' } };
      }
    }

    // Full-text search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Sorting
    let orderBy = { id: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    else if (sort === 'price-desc') orderBy = { price: 'desc' };
    else if (sort === 'discount') orderBy = { discountPrice: 'asc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        category: true,
        productImages: true
      }
    });

    const total = await prisma.product.count({ where });

    // Map to keep frontend compatible
    const formattedProducts = products.map(p => {
      const rawImg = p.image || (p.productImages && p.productImages.length > 0 ? p.productImages[0].imageUrl : null);
      const imgUrl = formatImageUrl(rawImg);

      const allImages = [];
      if (imgUrl) allImages.push(imgUrl);
      if (p.productImages && p.productImages.length > 0) {
        p.productImages.forEach(img => {
          const formatted = formatImageUrl(img.imageUrl);
          if (formatted && formatted !== imgUrl) {
            allImages.push(formatted);
          }
        });
      }
      return {
        ...p,
        category: p.category?.name || 'Uncategorized',
        image: imgUrl,
        images: allImages,
        offerPrice: p.discountPrice,
        keywords: p.seoKeywords
      };
    });

    res.json({
      products: formattedProducts,
      total,
      page,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
  try {
    const rawId = req.params.id || '';
    const isIdNumeric = !isNaN(Number(rawId)) && /^\d+$/.test(rawId);
    
    let p;
    if (isIdNumeric) {
      p = await prisma.product.findFirst({
        where: { id: Number(rawId) },
        include: {
          category: true,
          productImages: true
        }
      });
    } else {
      let decodedParam = rawId;
      try {
        decodedParam = decodeURIComponent(rawId).trim();
      } catch (e) {
        decodedParam = rawId;
      }

      const normalizedSlug = decodedParam.toLowerCase().replace(/\s+/g, '-').replace(/–/g, '-');
      const spaceParam = decodedParam.replace(/-/g, ' ');

      p = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: rawId },
            { slug: decodedParam },
            { slug: normalizedSlug },
            { slug: { contains: normalizedSlug, mode: 'insensitive' } },
            { name: { equals: decodedParam, mode: 'insensitive' } },
            { name: { contains: spaceParam, mode: 'insensitive' } }
          ]
        },
        include: {
          category: true,
          productImages: true
        },
        orderBy: { updatedAt: 'desc' }
      });
    }


    if (!p) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const rawImg = p.image || (p.productImages && p.productImages.length > 0 ? p.productImages[0].imageUrl : null);
    const imgUrl = formatImageUrl(rawImg);

    const formattedProduct = {
      ...p,
      category: p.category?.name || 'Uncategorized',
      image: imgUrl,
      imagePath: p.imagePath || (p.productImages && p.productImages.length > 0 ? p.productImages[0].imagePath : null),
      images: p.productImages ? p.productImages.map(img => ({ imageUrl: formatImageUrl(img.imageUrl), imagePath: img.imagePath })) : [],
      offerPrice: p.discountPrice,
      keywords: p.seoKeywords
    };

    res.json(formattedProduct);

  } catch (error) {
    console.error("Get product detail error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD PRODUCT
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      offerPrice,
      stock,
      shortDescription,
      ingredients,
      benefits,
      highlights,
      nutritionInfo,
      faqData,
      tags,
      seoTitle,
      seoDescription,
      seoKeywords,
      variants,
      featured,
      status,
      image,
      imagePath,
      productImages
    } = req.body;

    // Generate slug
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Resolve Category
    let categoryRecord = await prisma.category.findUnique({ where: { name: category || 'Uncategorized' } });
    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({ data: { name: category || 'Uncategorized' } });
    }

    const parseIfString = (val) => typeof val === 'string' ? JSON.parse(val) : val;

    const resolvedDiscountPrice = discountPrice !== undefined ? discountPrice : offerPrice;
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId: categoryRecord.id,
        price: Number(price) || 0,
        discountPrice: (resolvedDiscountPrice !== undefined && resolvedDiscountPrice !== '' && resolvedDiscountPrice !== null) ? Number(resolvedDiscountPrice) : null,
        stock: Number(stock) || 0,
        shortDescription,
        ingredients,
        benefits: parseIfString(benefits),
        highlights: parseIfString(highlights),
        nutritionInfo: parseIfString(nutritionInfo),
        faqData: parseIfString(faqData),
        tags,
        seoTitle,
        seoDescription,
        seoKeywords,
        variants: parseIfString(variants),
        featured: String(featured) === 'true',
        status: status || 'ACTIVE',
        image,
        imagePath
      },
    });

    if (productImages && Array.isArray(productImages) && productImages.length > 0) {
      await prisma.productImage.createMany({
        data: productImages.map(img => ({
          imageUrl: img.imageUrl,
          imagePath: img.imagePath,
          productId: product.id
        }))
      });
    }

    res.status(201).json(product);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      offerPrice,
      stock,
      shortDescription,
      ingredients,
      benefits,
      highlights,
      nutritionInfo,
      faqData,
      tags,
      seoTitle,
      seoDescription,
      seoKeywords,
      variants,
      featured,
      status,
      image,
      imagePath,
      productImages
    } = req.body;

    const parseIfString = (val) => typeof val === 'string' ? JSON.parse(val) : val;

    let categoryRecord;
    if (category) {
      categoryRecord = await prisma.category.findUnique({ where: { name: category } });
      if (!categoryRecord) {
        categoryRecord = await prisma.category.create({ data: { name: category } });
      }
    }

    const resolvedDiscountPrice = discountPrice !== undefined ? discountPrice : offerPrice;
    const updateData = {
      name,
      description,
      price: price !== undefined ? Number(price) : undefined,
      discountPrice: resolvedDiscountPrice !== undefined ? (resolvedDiscountPrice !== '' && resolvedDiscountPrice !== null ? Number(resolvedDiscountPrice) : null) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      shortDescription,
      ingredients,
      benefits: benefits !== undefined ? parseIfString(benefits) : undefined,
      highlights: highlights !== undefined ? parseIfString(highlights) : undefined,
      nutritionInfo: nutritionInfo !== undefined ? parseIfString(nutritionInfo) : undefined,
      faqData: faqData !== undefined ? parseIfString(faqData) : undefined,
      tags,
      seoTitle,
      seoDescription,
      seoKeywords,
      variants: variants !== undefined ? parseIfString(variants) : undefined,
      featured: featured !== undefined ? String(featured) === 'true' : undefined,
      status,
      image,
      imagePath
    };

    if (categoryRecord) {
      updateData.categoryId = categoryRecord.id;
    }

    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: updateData,
    });

    if (productImages && Array.isArray(productImages)) {
      // First delete existing product images if we are updating them
      await prisma.productImage.deleteMany({
        where: { productId: product.id }
      });
      if (productImages.length > 0) {
        await prisma.productImage.createMany({
          data: productImages.map(img => ({
            imageUrl: img.imageUrl,
            imagePath: img.imagePath,
            productId: product.id
          }))
        });
      }
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Product Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getImageProxy,
};

