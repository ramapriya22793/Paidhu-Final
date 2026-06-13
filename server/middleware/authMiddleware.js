const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log("verifyToken authHeader:", authHeader);
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      console.log("No token found");
      return res.status(401).json({ message: 'No authentication token found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    req.user = decoded; // { userId, isAdmin }
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

// Export verifyToken as the main function, but attach verifyAdmin and verifyToken to it
// so that both `const authMiddleware = require('...')` and `const { verifyAdmin } = require('...')` work.
verifyToken.verifyAdmin = verifyAdmin;
verifyToken.verifyToken = verifyToken;

module.exports = verifyToken;
