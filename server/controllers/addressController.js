const prisma = require('../prismaClient');

const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }
    });
    res.json(addresses);
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, addressLine1, addressLine2, landmark, city, state, country, pincode, addressType, isDefault } = req.body;

    if (isDefault) {
      // Remove default from other addresses
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        landmark,
        city,
        state,
        country: country || 'India',
        pincode,
        addressType: addressType || 'Home',
        isDefault: isDefault || false
      }
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = parseInt(req.params.id);
    const { fullName, phone, addressLine1, addressLine2, landmark, city, state, country, pincode, addressType, isDefault } = req.body;

    // Check ownership
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== userId) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        landmark,
        city,
        state,
        country,
        pincode,
        addressType,
        isDefault
      }
    });

    res.json(updatedAddress);
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = parseInt(req.params.id);

    // Check ownership
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== userId) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await prisma.address.delete({ where: { id: addressId } });
    res.json({ message: 'Address deleted' });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
