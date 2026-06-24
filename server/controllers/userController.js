const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: 'Invalid credentials or unauthorized' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials or unauthorized' });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req, res) => {
  try {
    const { phone, name, email, addressLine1, city, state, pincode, password } = req.body;
    
    const existingUser = await prisma.user.findFirst({ 
      where: { OR: [{ email }, { phone }] } 
    });
    if (existingUser) {
      if (existingUser.phone === phone) {
        return res.status(400).json({ message: 'Phone number already exists' });
      }
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        phone,
        password: hashedPassword, 
        isAdmin: false,
        addresses: {
          create: {
            fullName: name,
            phone,
            addressLine1,
            city,
            state,
            pincode,
            addressType: 'Home'
          }
        }
      }
    });

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await prisma.user.findUnique({ where: { phone } });
    
    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await prisma.loginHistory.create({
        data: { userId: user.id, ipAddress, userAgent, status: 'FAILED' }
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await prisma.loginHistory.create({
      data: { userId: user.id, ipAddress, userAgent, status: 'SUCCESS' }
    });

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const crypto = require('crypto');

const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(404).json({ message: 'User with this phone number not found' });

    const token = crypto.randomBytes(4).toString('hex').toUpperCase(); // Simple 8-char OTP
    
    await prisma.passwordResetToken.deleteMany({ where: { phone } });
    
    await prisma.passwordResetToken.create({
      data: {
        phone,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    res.json({ message: 'Reset token sent successfully', resetToken: token });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { phone, token, newPassword } = req.body;
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
    
    if (!resetToken || resetToken.phone !== phone) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    if (new Date() > resetToken.expiresAt) {
      return res.status(400).json({ message: 'Token has expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { phone },
      data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.deleteMany({ where: { phone } });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        preferredLanguage: true,
        rewardPoints: true,
        membershipLevel: true,
        referralCode: true,
        communicationPrefs: true,
        createdAt: true,
        avatar: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, dateOfBirth, preferredLanguage } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        phone,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        preferredLanguage
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        preferredLanguage: true,
        rewardPoints: true,
        membershipLevel: true,
        referralCode: true,
        communicationPrefs: true,
        createdAt: true
      }
    });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { communicationPrefs } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        communicationPrefs
      },
      select: {
        communicationPrefs: true
      }
    });

    res.json({ message: 'Preferences updated successfully', preferences: updatedUser.communicationPrefs });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error updating preferences' });
  }
};

// --- ADMIN USER MANAGEMENT ---

const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};
    if (search) {
      whereClause = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true, name: true, email: true, phone: true, isAdmin: true, createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

const adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, isAdmin } = req.body;
    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, phone, isAdmin }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

const blockUser = async (req, res) => {
  // Assuming we might add an isBlocked field later, for now we just return success
  res.json({ message: 'User blocked status toggled' });
};

const guestLogin = async (req, res) => {
  try {
    const { guestId } = req.body;
    if (!guestId) {
      return res.status(400).json({ message: 'Guest ID is required' });
    }
    const email = `guest_${guestId}@paidhu.local`;
    const hashedPassword = await bcrypt.hash(guestId, 10);
    
    let user;
    try {
      user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name: `Guest ${guestId.substring(0, 5)}`,
          email,
          password: hashedPassword,
          isAdmin: false
        }
      });
    } catch (upsertError) {
      // Fallback in case of unique constraint race conditions
      user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw upsertError;
      }
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '30d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error("Guest login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const registerTiffin = async (req, res) => {
  try {
    const { phone, consent } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    const existing = await prisma.tiffinRegistration.findUnique({
      where: { phone }
    });
    
    if (existing) {
      return res.status(400).json({ message: 'This mobile number is already registered!' });
    }
    
    const registration = await prisma.tiffinRegistration.create({
      data: {
        phone,
        consent: consent !== undefined ? consent : true
      }
    });
    
    res.status(201).json({
      message: 'Registration successful!',
      registration
    });
  } catch (error) {
    console.error("Tiffin registration error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  adminLogin,
  register,
  login,
  getProfile,
  updateProfile,
  updatePreferences,
  getAllUsers,
  adminUpdateUser,
  deleteUser,
  blockUser,
  guestLogin,
  registerTiffin,
  forgotPassword,
  resetPassword
};
