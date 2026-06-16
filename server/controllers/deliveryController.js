const prisma = require("../prismaClient");

const getDeliveryCharges = async (req, res) => {
  try {
    const charges = await prisma.deliveryCharge.findMany();
    res.json(charges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDeliveryCharge = async (req, res) => {
  try {
    const { type, charge, freeAbove, estimatedDays, isActive, regions } = req.body;
    const newCharge = await prisma.deliveryCharge.create({
      data: { type, charge: Number(charge), freeAbove: freeAbove ? Number(freeAbove) : null, estimatedDays, isActive, regions: regions || null }
    });
    res.status(201).json(newCharge);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "A delivery charge with this type already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateDeliveryCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, charge, freeAbove, estimatedDays, isActive, regions } = req.body;
    
    const updatedCharge = await prisma.deliveryCharge.update({
      where: { id: Number(id) },
      data: { type, charge: Number(charge), freeAbove: freeAbove ? Number(freeAbove) : null, estimatedDays, isActive, regions: regions || null }
    });
    res.json(updatedCharge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDeliveryCharge = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.deliveryCharge.delete({
      where: { id: Number(id) }
    });
    res.json({ message: "Delivery charge deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkPincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    const { city, state } = req.query;
    
    const allDeliveryCharges = await prisma.deliveryCharge.findMany({ where: { isActive: true } });
    
    const bestRulesMap = {}; // { [type]: { rule, priority } }
    const cleanTargetRegion = str => str ? str.replace(/[^a-zA-Z0-9*]/g, '').toLowerCase() : '';
    const cleanStr = str => str ? str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : '';

    const getMatchPriority = (input, target, basePriority) => {
      if (!input || !target) return 0;
      const cleanInput = cleanStr(input);
      const cleanTarget = cleanTargetRegion(target);
      if (cleanTarget.endsWith('*')) {
        const prefix = cleanTarget.slice(0, -1);
        if (cleanInput.startsWith(prefix)) {
          return basePriority + (prefix.length / 10);
        }
        return 0;
      }
      if (cleanInput === cleanTarget) {
        return basePriority + 0.9;
      }
      return 0;
    };

    for (const rule of allDeliveryCharges) {
      let priority = 0;
      
      if (!rule.regions || rule.regions.trim() === '') {
        priority = 1; // Global fallback
      } else {
        const targetRegions = rule.regions.split(',');

        for (const target of targetRegions) {
          if (pincode) {
            const p = getMatchPriority(pincode, target, 4);
            if (p > priority) priority = p;
          }
          if (city) {
            const p = getMatchPriority(city, target, 3);
            if (p > priority) priority = p;
          }
          if (state) {
            const p = getMatchPriority(state, target, 2);
            if (p > priority) priority = p;
          }
        }
      }
      
      if (priority > 0) {
        const existing = bestRulesMap[rule.type];
        if (!existing || priority > existing.priority) {
          bestRulesMap[rule.type] = { rule, priority };
        }
      }
    }
    
    const availableMethods = Object.values(bestRulesMap).map(item => item.rule);
    res.json(availableMethods);
  } catch (error) {
    console.error("Error checking pincode:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDeliveryCharges,
  createDeliveryCharge,
  updateDeliveryCharge,
  deleteDeliveryCharge,
  checkPincode
};
