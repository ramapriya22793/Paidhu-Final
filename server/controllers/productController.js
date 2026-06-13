const prisma = require("../prismaClient");

// NAV SECTION → FILTER MAPPING
// Maps each navbar header to a Prisma where-clause builder
const navSectionFilters = {
  'shop-all': () => ({}),
  'deal-of-the-day': () => ({ discountPrice: { not: null }, status: 'ACTIVE' }),
  'shop-by-category': (extra) => extra?.category ? { category: { name: extra.category } } : {},
  'for-your-family': () => ({ tags: { contains: 'family' } }),
  'starting-floral-food-habitat': () => ({ tags: { contains: 'floral' } }),
  'byoc': () => ({ tags: { contains: 'byoc' } }),
  'our-own-community': () => ({ tags: { contains: 'community' } }),
  'our-philosophy': () => ({ tags: { contains: 'philosophy' } }),
  'bulk-orders': () => ({ tags: { contains: 'bulk' } }),
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
      where.status = 'ACTIVE';
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
        where.category = { name: category };
      }
      if (tag) {
        where.tags = { contains: tag };
      }
    }

    // Apply global category filter if provided and not already applied by nav section smart filter
    if (category && category !== 'Shop All' && !where.category) {
      where.category = { name: category };
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
      const allImages = [];
      if (p.image) allImages.push(p.image);
      if (p.productImages && p.productImages.length > 0) {
        p.productImages.forEach(img => {
          if (img.imageUrl && img.imageUrl !== p.image) {
            allImages.push(img.imageUrl);
          }
        });
      }
      return {
        ...p,
        category: p.category?.name || 'Uncategorized',
        image: p.image || (p.productImages && p.productImages.length > 0 ? p.productImages[0].imageUrl : null),
        images: allImages,
        offerPrice: p.discountPrice
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
    const p = await prisma.product.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        category: true,
        productImages: true
      }
    });

    if (!p) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const formattedProduct = {
      ...p,
      category: p.category?.name || 'Uncategorized',
      image: p.image || (p.productImages && p.productImages.length > 0 ? p.productImages[0].imageUrl : null),
      imagePath: p.imagePath || (p.productImages && p.productImages.length > 0 ? p.productImages[0].imagePath : null),
      images: p.productImages ? p.productImages.map(img => ({ imageUrl: img.imageUrl, imagePath: img.imagePath })) : [],
      offerPrice: p.discountPrice
    };

    res.json(formattedProduct);
  } catch (error) {
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

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId: categoryRecord.id,
        price: Number(price) || 0,
        discountPrice: discountPrice ? Number(discountPrice) : null,
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

    const updateData = {
      name,
      description,
      price: price !== undefined ? Number(price) : undefined,
      discountPrice: discountPrice !== undefined ? (discountPrice ? Number(discountPrice) : null) : undefined,
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
};
