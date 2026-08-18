const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const PERMISSIONS = {
  SUPER_ADMIN: '*',
  ECOMMERCE_ADMIN: [
    'blogs', 'saffron_guidance', 'bulk_enquiry', 'banners', 
    'products', 'orders', 'active_carts', 'whatsapp_leads_byoc',
    'profile'
  ],
  ACCOUNTS_ADMIN: [
    'orders', 'payments', 'stock_management', 'profile'
  ]
};

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log("verifyToken authHeader:", authHeader);
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      console.log("No token found");
      return res.status(401).json({ message: 'No authentication token found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    // If user is flagged as needing password change, block all routes except change-password
    if (decoded.mustChangePassword && req.baseUrl + req.path !== '/api/admin/change-password') {
      return res.status(403).json({
        message: 'Password change required. You must change your temporary password before accessing other features.',
        mustChangePassword: true
      });
    }

    const userId = decoded.id || decoded.userId;
    if (!userId) {
      console.log("No user ID found in token payload");
      return res.status(401).json({ message: 'Invalid token: user ID missing' });
    }

    // Verify user exists in database to prevent foreign key issues on stale/deleted users
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      console.log("Token points to a user that does not exist in database");
      return res.status(401).json({ message: 'Invalid token: user not found' });
    }

    req.user = { 
      id: userId, 
      isAdmin: userExists.isAdmin, 
      role: userExists.role || 'CUSTOMER'
    };
    next();
  } catch (error) {
    console.log("JWT Verification Error:", error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

const checkPermission = (moduleName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const role = req.user.role;
    
    if (role === 'SUPER_ADMIN') {
      return next();
    }
    
    const allowedModules = PERMISSIONS[role];
    if (allowedModules && allowedModules.includes(moduleName)) {
      return next();
    }
    
    res.status(403).json({ message: `Access denied. Permission for module '${moduleName}' is required.` });
  };
};

verifyToken.verifyAdmin = verifyAdmin;
verifyToken.verifyToken = verifyToken;
verifyToken.checkPermission = checkPermission;

module.exports = verifyToken;
