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

    const matchRegion = (input, target) => {
      if (!input || !target) return false;
      const cleanInput = cleanStr(input);
      const cleanTarget = cleanTargetRegion(target);
      if (cleanTarget.endsWith('*')) {
        const prefix = cleanTarget.slice(0, -1);
        return cleanInput.startsWith(prefix);
      }
      return cleanInput === cleanTarget;
    };

    for (const rule of allDeliveryCharges) {
      let priority = 0;
      
      if (!rule.regions || rule.regions.trim() === '') {
        priority = 1; // Global fallback
      } else {
        const targetRegions = rule.regions.split(',');
        
        let pincodeMatched = false;
        let cityMatched = false;
        let stateMatched = false;

        for (const target of targetRegions) {
          if (pincode && matchRegion(pincode, target)) pincodeMatched = true;
          if (city && matchRegion(city, target)) cityMatched = true;
          if (state && matchRegion(state, target)) stateMatched = true;
        }

        if (pincodeMatched) {
          priority = 4; // Pincode match is highest specificity
        } else if (cityMatched) {
          priority = 3; // City match
        } else if (stateMatched) {
          priority = 2; // State match
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
