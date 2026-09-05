-- ==========================================
-- PAIDHU ETHICAL FOODS - COMPLETE POSTGRESQL SCHEMA
-- Target Supabase Project: ljrwcciuacjbwocsxiqc
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------
-- Table: "Address"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "Address" (
    "id" SERIAL,
    "userId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "landmark" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT DEFAULT 'India'::text NOT NULL,
    "pincode" TEXT NOT NULL,
    "addressType" TEXT DEFAULT 'Home'::text NOT NULL,
    "isDefault" BOOLEAN DEFAULT false NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "Banner"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "Banner" (
    "id" SERIAL,
    "pageSlug" TEXT NOT NULL,
    "webImage" TEXT NOT NULL,
    "mobileImage" TEXT,
    "size" TEXT DEFAULT 'medium'::text NOT NULL,
    "isActive" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mobileImagePath" TEXT,
    "webImagePath" TEXT,
    "category" TEXT,
    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "Blog"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "Blog" (
    "id" SERIAL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "image" TEXT,
    "author" TEXT DEFAULT 'Paidhu Team'::text NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "authorId" INTEGER,
    "canonicalUrl" TEXT,
    "categories" JSONB,
    "excerpt" TEXT,
    "featuredImage" TEXT,
    "featuredImageAlt" TEXT,
    "featuredImageHeight" INTEGER,
    "featuredImageWidth" INTEGER,
    "lastSynced" TIMESTAMP(3),
    "metaKeywords" TEXT,
    "readingTime" INTEGER DEFAULT 1 NOT NULL,
    "seoDescription" TEXT,
    "seoTitle" TEXT,
    "slug" TEXT,
    "status" TEXT DEFAULT 'publish'::text NOT NULL,
    "tags" JSONB,
    "wordpressId" INTEGER,
    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "BulkOrderInquiry"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "BulkOrderInquiry" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" TEXT DEFAULT 'Pending'::text NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "BulkOrderInquiry_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "CareerApplication"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "CareerApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "graduationYear" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "resumeData" TEXT,
    "resumeName" TEXT,
    "portfolioUrl" TEXT,
    "coverLetter" TEXT,
    "status" TEXT DEFAULT 'New'::text NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "CareerApplication_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "CartItem"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "CartItem" (
    "id" SERIAL,
    "userId" INTEGER,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER DEFAULT 1 NOT NULL,
    "variant" TEXT DEFAULT 'default'::text,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "Category"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "Category" (
    "id" SERIAL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "Coupon"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "Coupon" (
    "id" SERIAL,
    "code" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "minOrderValue" DOUBLE PRECISION,
    "expiryDate" TIMESTAMP(3),
    "isActive" BOOLEAN DEFAULT true NOT NULL,
    "usageLimit" INTEGER,
    "usageCount" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "DeliveryCharge"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "DeliveryCharge" (
    "id" SERIAL,
    "type" TEXT NOT NULL,
    "charge" DOUBLE PRECISION NOT NULL,
    "freeAbove" DOUBLE PRECISION,
    "estimatedDays" TEXT NOT NULL,
    "regions" TEXT,
    "isActive" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "DeliveryCharge_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "LoginHistory"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "LoginHistory" (
    "id" SERIAL,
    "userId" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "loginTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "status" TEXT DEFAULT 'SUCCESS'::text NOT NULL,
    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "NewsletterSubscriber"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
    "id" SERIAL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "Order"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "Order" (
    "id" SERIAL,
    "orderNumber" TEXT,
    "userId" INTEGER,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION DEFAULT 0 NOT NULL,
    "deliveryCharge" DOUBLE PRECISION DEFAULT 0 NOT NULL,
    "discountAmount" DOUBLE PRECISION DEFAULT 0 NOT NULL,
    "rewardPointsUsed" INTEGER DEFAULT 0 NOT NULL,
    "tax" DOUBLE PRECISION DEFAULT 0 NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT DEFAULT 'PENDING'::text NOT NULL,
    "orderStatus" TEXT DEFAULT 'PENDING'::text NOT NULL,
    "trackingNumber" TEXT,
    "courierPartner" TEXT,
    "estimatedDeliveryDate" TIMESTAMP(3),
    "timeline" JSONB,
    "couponId" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "OrderItem"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" SERIAL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "PasswordResetToken"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
    "id" SERIAL,
    "phone" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "Payment"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" SERIAL,
    "orderId" INTEGER NOT NULL,
    "userId" INTEGER,
    "gateway" TEXT DEFAULT 'Razorpay'::text,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "Product"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "Product" (
    "id" SERIAL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER DEFAULT 0 NOT NULL,
    "shortDescription" TEXT,
    "ingredients" TEXT,
    "benefits" JSONB,
    "highlights" JSONB,
    "nutritionInfo" JSONB,
    "faqData" JSONB,
    "tags" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "variants" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "discountPrice" DOUBLE PRECISION,
    "featured" BOOLEAN DEFAULT false NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT DEFAULT 'ACTIVE'::text NOT NULL,
    "image" TEXT,
    "imagePath" TEXT,
    "seoKeywords" TEXT,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "ProductImage"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "ProductImage" (
    "id" SERIAL,
    "imageUrl" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "imagePath" TEXT NOT NULL,
    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "ProductSeo"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "ProductSeo" (
    "id" SERIAL,
    "productId" INTEGER NOT NULL,
    "primaryKeyword" TEXT,
    "secondaryKeywords" JSONB,
    "seoFriendlyPageTitle" TEXT,
    "seoTitle" TEXT,
    "metaDescription" TEXT,
    "seoSlug" TEXT,
    "seoProductDescription" TEXT,
    "internalLinks" JSONB,
    "imageSeo" JSONB,
    "productSchema" JSONB,
    "faqs" JSONB,
    "seoScore" INTEGER DEFAULT 0,
    "canonicalUrl" TEXT,
    "robotsIndex" TEXT DEFAULT 'index'::text,
    "robotsFollow" TEXT DEFAULT 'follow'::text,
    "lastUpdatedBy" TEXT DEFAULT 'Admin'::text,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ProductSeo_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "Refund"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "Refund" (
    "id" SERIAL,
    "paymentId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "refundAmount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "Review"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "Review" (
    "id" SERIAL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "image" TEXT,
    "isApproved" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "SaffronGuidance"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "SaffronGuidance" (
    "id" TEXT NOT NULL,
    "yourName" TEXT NOT NULL,
    "spouseName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "pregnancyMonth" INTEGER NOT NULL,
    "doctorPermission" TEXT NOT NULL,
    "status" TEXT DEFAULT 'Pending'::text NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "SaffronGuidance_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "SeoData"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "SeoData" (
    "id" SERIAL,
    "pageSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SeoData_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "SiteSettings"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "SiteSettings" (
    "id" SERIAL,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "heroImage" TEXT,
    "communityTitle" TEXT,
    "communitySubtitle" TEXT,
    "communityImage" TEXT,
    "faqList" JSONB,
    "promoText" JSONB,
    "videoTitle" TEXT,
    "videoSubtitle" TEXT,
    "videoUrl" TEXT,
    "videoThumbnail" TEXT,
    "productTabs" JSONB,
    "navbarLinks" JSONB,
    "dealCategories" JSONB,
    "familyTitle" TEXT,
    "familyTabs" JSONB,
    "floralHabitatData" JSONB,
    "byocData" JSONB,
    "ourCommunityData" JSONB,
    "ourPhilosophyData" JSONB,
    "bulkOrdersData" JSONB,
    "aboutUsData" JSONB,
    "categoryGridData" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "TiffinRegistration"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "TiffinRegistration" (
    "id" SERIAL,
    "phone" TEXT NOT NULL,
    "consent" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "TiffinRegistration_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "TrackingScript"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "TrackingScript" (
    "id" SERIAL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "code" TEXT,
    "settings" JSONB,
    "isActive" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TrackingScript_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "User"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "gender" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "preferredLanguage" TEXT DEFAULT 'English'::text,
    "rewardPoints" INTEGER DEFAULT 0 NOT NULL,
    "membershipLevel" TEXT DEFAULT 'Silver'::text NOT NULL,
    "referralCode" TEXT,
    "communicationPrefs" JSONB,
    "isAdmin" BOOLEAN DEFAULT false NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "mustChangePassword" BOOLEAN DEFAULT false NOT NULL,
    "role" TEXT DEFAULT 'CUSTOMER'::text NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------
-- Table: "WishlistItem"
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS "WishlistItem" (
    "id" SERIAL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- ==========================================
-- SUPABASE STORAGE CONFIGURATION
-- ==========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('products', 'products', true, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage public read policy
CREATE POLICY IF NOT EXISTS "Public Access to Products Bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Storage authenticated upload policy
CREATE POLICY IF NOT EXISTS "Allow Uploads to Products Bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');

