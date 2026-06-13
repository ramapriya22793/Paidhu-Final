const prisma = require("../prismaClient");

const getScripts = async (req, res) => {
  try {
    const scripts = await prisma.trackingScript.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(scripts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActiveScripts = async (req, res) => {
  try {
    const scripts = await prisma.trackingScript.findMany({
      where: { isActive: true }
    });
    // Group by placement for easier consumption by the storefront
    const grouped = {
      HEAD: scripts.filter(s => s.placement === 'HEAD'),
      BODY_START: scripts.filter(s => s.placement === 'BODY_START'),
      BODY_END: scripts.filter(s => s.placement === 'BODY_END'),
    };
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createScript = async (req, res) => {
  try {
    const { name, provider, placement, code, settings, isActive } = req.body;
    
    // For specific providers, we might want to update existing instead of creating multiple
    // e.g. only one GA4 should exist.
    if (provider && provider !== 'CUSTOM') {
      const existing = await prisma.trackingScript.findFirst({
        where: { provider }
      });
      
      if (existing) {
        const updated = await prisma.trackingScript.update({
          where: { id: existing.id },
          data: { name, placement, code, settings, isActive }
        });
        return res.json(updated);
      }
    }

    const script = await prisma.trackingScript.create({
      data: { name, provider, placement, code, settings, isActive }
    });
    res.status(201).json(script);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateScript = async (req, res) => {
  try {
    const { name, provider, placement, code, settings, isActive } = req.body;
    const scriptId = Number(req.params.id);

    const script = await prisma.trackingScript.update({
      where: { id: scriptId },
      data: { name, provider, placement, code, settings, isActive }
    });
    res.json(script);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteScript = async (req, res) => {
  try {
    const scriptId = Number(req.params.id);
    await prisma.trackingScript.delete({ where: { id: scriptId } });
    res.json({ message: "Script deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleScript = async (req, res) => {
  try {
    const scriptId = Number(req.params.id);
    const { isActive } = req.body;
    const script = await prisma.trackingScript.update({
      where: { id: scriptId },
      data: { isActive }
    });
    res.json(script);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getScripts,
  getActiveScripts,
  createScript,
  updateScript,
  deleteScript,
  toggleScript
};
