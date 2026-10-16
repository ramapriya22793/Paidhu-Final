const helmet = require('helmet');

const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: [
        "'self'", 
        "data:", 
        "blob:", 
        "https://paidhu.com",
        "https://www.paidhu.com",
        "https://admin.paidhu.com",
        "https://paidhuethicalfoods.com",
        "https://www.paidhuethicalfoods.com",
        "https://admin.paidhuethicalfoods.com",
        "https://szgqtggokqqaoomryljr.supabase.co", 
        "https://images.unsplash.com", 
        "https://res.cloudinary.com"
      ],
      connectSrc: [
        "'self'", 
        "https://paidhu.com",
        "https://www.paidhu.com",
        "https://admin.paidhu.com",
        "https://paidhuethicalfoods.com",
        "https://www.paidhuethicalfoods.com",
        "https://admin.paidhuethicalfoods.com",
        "https://paidhu-final-anm2.vercel.app", 
        "https://szgqtggokqqaoomryljr.supabase.co", 
        "https://api.razorpay.com"
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      mediaSrc: [
        "'self'", 
        "blob:", 
        "data:", 
        "https://paidhu.com", 
        "https://www.paidhu.com", 
        "https://paidhuethicalfoods.com", 
        "https://www.paidhuethicalfoods.com", 
        "https://paidhu-final-anm2.vercel.app"
      ],
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

module.exports = securityHeaders;
