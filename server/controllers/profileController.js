const prisma = require('../prismaClient');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        gender: true,
        dateOfBirth: true,
        preferredLanguage: true,
        rewardPoints: true,
        membershipLevel: true,
        referralCode: true,
        communicationPrefs: true,
        createdAt: true,
        addresses: true,
        wishlist: true,
        orders: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, gender, dateOfBirth, avatar, preferredLanguage, communicationPrefs } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        avatar,
        preferredLanguage,
        communicationPrefs
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        gender: true,
        dateOfBirth: true,
        preferredLanguage: true,
        rewardPoints: true,
        membershipLevel: true,
        referralCode: true,
        communicationPrefs: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
