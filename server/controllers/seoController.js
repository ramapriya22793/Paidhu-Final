const prisma = require("../prismaClient");

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
  getGlobalSeo,
  getSeoBySlug,
  updateSeoBySlug
};
