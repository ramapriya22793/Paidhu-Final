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
    const allDeliveryCharges = await prisma.deliveryCharge.findMany({ where: { isActive: true } });
    
    const availableMethods = [];
    
    for (const rule of allDeliveryCharges) {
      // If rule has no regions, it applies everywhere
      if (!rule.regions || rule.regions.trim() === '') {
        availableMethods.push(rule);
        continue;
      }
      
      const targetRegions = rule.regions.split(',').map(r => r.trim().toLowerCase());
      if (targetRegions.includes(pincode.toLowerCase())) {
        availableMethods.push(rule);
      }
    }
    
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
