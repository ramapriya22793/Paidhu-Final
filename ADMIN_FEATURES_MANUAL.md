# PAIDHU ETHICAL FOODS — COMPLETE ADMIN PORTAL FEATURE-BY-FEATURE MANUAL
**Document Version:** 3.5 | **Classification:** Official Comprehensive Administrative Operations Manual  
**Repository:** Paidhu-Final | **Admin Portal:** [https://admin.paidhuethicalfoods.com](https://admin.paidhuethicalfoods.com) (Local: `http://localhost:5174`)

---

# TABLE OF CONTENTS
1. [Role-Based Access Control (RBAC) & Permissions](#1-role-based-access-control-rbac--permissions)
2. [Authentication & Account Security](#2-authentication--account-security)
3. [Dashboard & Executive Analytics](#3-dashboard--executive-analytics)
4. [Product Catalog & Inventory Management](#4-product-catalog--inventory-management)
5. [Order Fulfillment, Lifecycle & Invoices](#5-order-fulfillment-lifecycle--invoices)
6. [Abandoned Carts Telemetry & WhatsApp Recovery](#6-abandoned-carts-telemetry--whatsapp-recovery)
7. [Customer Wishlist Demand Insights](#7-customer-wishlist-demand-insights)
8. [Customer Directory & Profiles](#8-customer-directory--profiles)
9. [Payment Transactions & Gateway Records](#9-payment-transactions--gateway-records)
10. [Coupons, Discounts & Promotions Engine](#10-coupons-discounts--promotions-engine)
11. [Deals of the Day & Flash Sales](#11-deals-of-the-day--flash-sales)
12. [Promotional Banners (Desktop & Mobile)](#12-promotional-banners-desktop--mobile)
13. [Delivery Charges & Shipping Rules Engine](#13-delivery-charges--shipping-rules-engine)
14. [Floral Food Habitat Management](#14-floral-food-habitat-management)
15. [BYOC (Build Your Own Cart) Bundle Manager](#15-byoc-build-your-own-cart-bundle-manager)
16. [Category Grid Management](#16-category-grid-management)
17. [Family Combos Management](#17-family-combos-management)
18. [Mom's Community & Event Moments Gallery](#18-moms-community--event-moments-gallery)
19. [Our Philosophy & Botanical Nutrition CMS](#19-our-philosophy--botanical-nutrition-cms)
20. [About Us Management](#20-about-us-management)
21. [Bulk Orders Content & Corporate Gifting](#21-bulk-orders-content--corporate-gifting)
22. [B2B Corporate Bulk Order Inquiries](#22-b2b-corporate-bulk-order-inquiries)
23. [Saffron Guidance Pregnancy Consultation Leads](#23-saffron-guidance-pregnancy-consultation-leads)
24. [WhatsApp Prompt & Tiffin Leads](#24-whatsapp-prompt--tiffin-leads)
25. [Career & Job Applications Pipeline](#25-career--job-applications-pipeline)
26. [Blog Authoring & Editorial Engine](#26-blog-authoring--editorial-engine)
27. [Customer Reviews Moderation](#27-customer-reviews-moderation)
28. [Static CMS Pages & Legal Policies](#28-static-cms-pages--legal-policies)
29. [SEO & Search Engine Optimization](#29-seo--search-engine-optimization)
30. [Tracking Scripts Injection (GA4, GTM, Meta Pixel)](#30-tracking-scripts-injection-ga4-gtm-meta-pixel)
31. [Global Store Settings & Maintenance Mode Switch](#31-global-store-settings--maintenance-mode-switch)
32. [Admin Profile & Password Rotation](#32-admin-profile--password-rotation)

---

## 1. ROLE-BASED ACCESS CONTROL (RBAC) & PERMISSIONS

The Paidhu Admin Portal utilizes a multi-tier authorization security matrix. Every administrator account is assigned one of three operational roles:

### 1.1 SUPER_ADMIN
- **Privileges:** Unrestricted master access to all 28 modules, financial records, payment gateway credentials, script injection, user provisioning, and maintenance settings.
- **Assigned To:** Founders, Directors, and Lead Technical Administrators.

### 1.2 ECOMMERCE_ADMIN
- **Privileges:** Operational control over catalog, inventory, order processing, active abandoned carts, customer inquiries, banners, BYOC bundles, blogs, and marketing leads.
- **Restrictions:** Restricted from viewing payment gateway configurations, financial refund processing, and tracking code injection.
- **Assigned To:** Store Managers, Merchandisers, and Marketing Team.

### 1.3 ACCOUNTS_ADMIN
- **Privileges:** Focused access to Dashboard financial charts, Orders, Payment transaction histories, Stock deduction auditing, and Tax Invoices.
- **Restrictions:** Restricted from editing storefront CMS banners, blogs, career applications, and customer leads.
- **Assigned To:** Accountants, Finance Officers, and Inventory Auditors.

---

## 2. AUTHENTICATION & ACCOUNT SECURITY

### 2.1 Admin Login (`/login`)
- **How It Works:** Administrators enter their registered email and password. Upon successful verification via `bcryptjs`, a signed JSON Web Token (JWT) is issued with a 7-day validity period.
- **Session Security:** Automatically logs the administrator out if the token expires or is revoked.

### 2.2 Forced Initial Password Change (`/change-password`)
- **How It Works:** When a new staff account is created, the system sets `mustChangePassword: true`.
- **Enforcement:** On first login, the admin is immediately redirected to the Change Password screen and cannot navigate to any dashboard data until they establish a strong, private password.

### 2.3 Login History & Audit Trail (`/login-history`)
- **Purpose:** Cybersecurity monitoring and internal compliance.
- **What It Displays:**
  - **Admin User:** Email and Account Name.
  - **IP Address:** Real-time client IP location.
  - **Browser & OS:** Complete User-Agent string.
  - **Timestamp:** Exact date and time of authentication.
  - **Status:** `SUCCESS` (green badge) or `FAILED` (red badge).
- **How to Use:** Review weekly to detect any unauthorized login attempts or abnormal IP activities.

---

## 3. DASHBOARD & EXECUTIVE ANALYTICS

**Route:** `/`

### 3.1 Real-Time KPI Metric Cards
- **Total Revenue (₹):** Live sum of all completed, verified transactions.
- **Total Orders:** Count of placed orders with percentage trajectory compared to previous month.
- **Total Customers:** Number of registered customer accounts on the storefront.
- **Low Stock Alerts:** Real-time count of products with remaining inventory $le 5$ units.

### 3.2 Sales & Orders Velocity Chart
- Visualizes daily and monthly gross sales curves rendered via Recharts.
- Allows executive management to spot sales peaks following marketing campaigns.

### 3.3 Recent Orders Overview Table
- Displays the 10 most recent customer purchases with customer name, order value, payment method, and real-time fulfillment status.
- Clicking any order opens the full fulfillment workspace.

### 3.4 Bestselling Products Leaderboard
- Ranks top floral products (e.g. Kashmiri Pure Saffron, Hibiscus Petal Jam, Rose Bloom Cookies) by total revenue and quantity sold.

---

## 4. PRODUCT CATALOG & INVENTORY MANAGEMENT

### 4.1 Product List (`/products`)
- **Search Bar:** Real-time search by product title, SKU code, or tags.
- **Category Filter Dropdown:** Filter by category (e.g. *Bloom Cookies*, *Petal Jams*, *Pure Saffron*, *Floral Teas*, *Brew Flora*, *Super Value Packs*).
- **Stock Status Badges:**
  - `In Stock` (Green): Safe inventory levels.
  - `Low Stock` (Amber): Units $le 5$.
  - `Out of Stock` (Red): Zero inventory; triggers out-of-stock badge on storefront.
- **Action Buttons:** Edit Product, Duplicate Product, or Delete Product.

### 4.2 Adding a New Product (`/products/new`)
- **Step 1: Basic Information:**
  - *Title:* Name of the product (e.g., "Artisanal Hibiscus Petal Jam").
  - *Slug:* Auto-generated URL path (e.g., `artisanal-hibiscus-petal-jam`).
  - *Category:* Select from predefined categories.
  - *Short Summary:* 1-2 sentence compelling summary for product card previews.
  - *Full Description:* Rich-text botanical story, flavor profile, ingredients list, and storage instructions.
- **Step 2: Media & Image Upload:**
  - Drag and drop up to 6 high-resolution product photos.
  - Uploads automatically to Supabase Cloud Storage bucket `products` with instant CDN delivery.
  - First image acts as primary storefront thumbnail; secondary images populate the image carousel.
- **Step 3: Multi-Size Variants Manager:**
  - Click **Add Variant** to define size offerings:
    - *Variant Label:* e.g. "100g Jar", "250g Jar", "500g Family Pack", "1g Saffron Box".
    - *Base Price (₹):* Original MRP.
    - *Offer Price (₹):* Discounted customer price.
    - *Stock Units:* Physical units available for that specific size.
    - *SKU Code:* Unique internal inventory identifier (e.g., `PH-JAM-HIB-250`).
- **Step 4: Badges & Merchandising Tags:**
  - Check tags: `bestseller`, `new_arrival`, `deal_of_the_day`, `family_combo`.
- **Step 5: Click "Save & Publish Product".**

### 4.3 Editing Existing Products (`/products/edit/:id`)
- Modify prices, descriptions, images, or stock units. Updates reflect instantly across the storefront without requiring code deployments.

---

## 5. ORDER FULFILLMENT, LIFECYCLE & INVOICES

### 5.1 Orders Ledger (`/orders`)
- **Filter Tabs:**
  - `ALL` — Complete historical ledger.
  - `PENDING` — Customer initiated order; payment not yet verified.
  - `PAID` — Online payment successfully captured via Razorpay or COD order confirmed.
  - `PROCESSING` — Order printed; items being packed and quality checked.
  - `SHIPPED` — Dispatched with courier tracking details.
  - `DELIVERED` — Customer received package.
  - `CANCELLED` — Order cancelled or refunded.
- **Search:** Search by Order ID, customer phone number, or customer name.

### 5.2 Order Details & Fulfillment Screen (`/orders/:id`)
- **Customer & Shipping Card:** Full name, phone number (with direct call/WhatsApp link), email, and full postal address including pincode.
- **Line Items Breakdown:** Table showing thumbnail, product title, selected variant, unit price, quantity, and line total.
- **Cost Calculation Box:**
  - Items Subtotal.
  - Applied Coupon Code and discount amount deducted.
  - Delivery charge applied (or Free Delivery indicator).
  - Net Grand Total paid.
- **Order State Machine Dropdown:**
  - Select new status (`Processing`, `Shipped`, `Delivered`, `Cancelled`).
  - Enter Courier Partner name (e.g. Blue Dart, Delhivery, DTDC) and Tracking AWB Number.
- **Print Tax Invoice Button:**
  - Formats an official Paidhu Tax Invoice in standard A4 format with GST breakdown, company contact information, and shipping address label.

---

## 6. ABANDONED CARTS TELEMETRY & WHATSAPP RECOVERY

**Route:** `/active-carts`

### 6.1 What It Does
Tracks high-intent shoppers who added items to their shopping cart and entered their contact details but dropped off before completing payment.

### 6.2 Key Attributes Displayed
- **Customer Phone & Email:** Contact identity.
- **Cart Value (₹):** Total monetary value of items in the cart.
- **Products in Cart:** List of specific items, variants, and quantities.
- **Last Updated:** Exact timestamp showing how long ago the cart was updated.

### 6.3 One-Click WhatsApp Recovery Workflow
1. Locate customer in the Active Carts table.
2. Click the green **"Chat on WhatsApp"** button.
3. Automatically opens WhatsApp Web or WhatsApp Desktop with a pre-filled, personalized recovery message:
   *"Hi [Customer], we noticed you left some lovely floral delicacies in your cart at Paidhu! Would you like help completing your order? Here is a special 5% coupon for you: WELCOME5"*
4. Dramatically boosts store conversion rates by recovering lost revenue.

---

## 7. CUSTOMER WISHLIST DEMAND INSIGHTS

**Route:** `/wishlists`

### 7.1 What It Does
Aggregates all products added to wishlists across all registered users, functioning as an unfulfilled demand heatmap.

### 7.2 How Admins Use It
- Identifies which out-of-stock items have high customer interest, helping the kitchen prioritize baking/production batches.
- Guides promotional campaigns: if 50+ users wishlisted a specific cookie pack, create a flash deal for that product to trigger immediate checkout conversions.

---

## 8. CUSTOMER DIRECTORY & PROFILES

**Route:** `/customers` and `/customers/:id`

### 8.1 Customer Directory
- Master list of all registered buyers.
- Searchable by name, email, or telephone number.
- Shows total orders placed, cumulative spend, and registration date.

### 8.2 Customer Detail Profile
- **Contact Summary:** Verified mobile number, email, and notification preferences.
- **Saved Address Book:** Delivery addresses saved for home, office, etc.
- **Lifetime Purchase Timeline:** Full chronology of all orders, items purchased, and payment records.

---

## 9. PAYMENT TRANSACTIONS & GATEWAY RECORDS

**Route:** `/payments`

### 9.1 Transaction Ledger
- Live audit log of all gateway events.
- **Columns:**
  - *Razorpay Payment ID:* e.g. `pay_O1b2c3d4e5f6`.
  - *Order Number:* Linked Paidhu order reference.
  - *Customer Name & Phone.*
  - *Amount (₹):* Exact captured amount.
  - *Payment Method:* UPI (Google Pay, PhonePe, Paytm), NetBanking, Credit/Debit Card, or COD.
  - *Gateway Status:* `SUCCESS`, `PENDING`, or `FAILED`.

### 9.2 Refund Management
- View refund requests with logged reasons.
- Issue partial or full refunds directly through the portal with audit log tracking.

---

## 10. COUPONS, DISCOUNTS & PROMOTIONS ENGINE

**Route:** `/coupons`

### 10.1 Creating a Coupon Code
1. Click **"Create Coupon"**.
2. **Coupon Code:** Unique alphanumeric code (e.g. `FLORAL10`, `FESTIVE500`).
3. **Discount Type:**
   - *Percentage:* e.g. 10% off entire order.
   - *Fixed Amount:* e.g. Flat ₹150 off.
4. **Discount Value:** Enter the numeric discount value.
5. **Minimum Cart Amount (₹):** e.g., Coupon valid only on orders above ₹999.
6. **Maximum Discount Cap (₹):** Caps the maximum discount for percentage coupons (e.g., 15% off up to max ₹300).
7. **Expiration Date:** Set end date/time after which the code auto-expires.
8. **Usage Limits:** Limit redemptions per customer (e.g. 1 per customer) or total store redemptions.
9. **Active Toggle:** Instantly activate or pause coupon code.

---

## 11. DEALS OF THE DAY & FLASH SALES

**Route:** `/deals-management`

### 11.1 What It Does
Curates the special promotional offerings featured on the dedicated storefront deals page (`/shop/deal-of-the-day`).

### 11.2 Configurable Options
- **Featured Product Selection:** Choose which catalog items receive the special deal spotlight.
- **Promotional Ribbon Text:** e.g. "Save 25% Today", "Limited Kitchen Batch".
- **Countdown Timer Schedule:** Set start and expiry timestamps to display a live countdown timer on the storefront.

---

## 12. PROMOTIONAL BANNERS (DESKTOP & MOBILE)

**Route:** `/banners`

### 12.1 Target Page Placement
Banners can be assigned to specific storefront destinations:
- `home` — Main storefront homepage hero slider.
- `shop-all` — Shop All catalog header banner (**Recommended size: 1920 x 427 px**).
- `deal-of-the-day` — Flash sales page banner.
- Category slugs — Specific category pages (e.g. `bloom-cookies`, `pure-saffron`).

### 12.2 Responsive Image Architecture
- **Web Banner:** High-resolution landscape image (1920 x 427 px) engineered for desktop monitors.
- **Mobile Banner:** Vertically optimized image formatted for smartphone touch screens.
- Uploads directly to Supabase CDN bucket with zero server load.

### 12.3 Banner Controls
- **Link URL:** Set destination link when customer clicks the banner (e.g. `/shop/byoc`).
- **Active Switch:** Toggle banners online/offline without having to re-upload image files.

---

## 13. DELIVERY CHARGES & SHIPPING RULES ENGINE

**Route:** `/delivery-charges`

### 13.1 Configurable Parameters
- **Standard Delivery Charge (₹):** Base shipping cost (e.g. ₹60).
- **Express Delivery Charge (₹):** Expedited priority shipping cost (e.g. ₹120).
- **Free Delivery Threshold (₹):** Minimum cart subtotal required for automated free shipping (e.g. ₹999).
- **Estimated Delivery Timelines:** Text displayed in the cart and checkout (e.g. *"Estimated delivery in 3–5 business days"*).
- **Regional Surcharges:** Specify pincodes or states requiring special logistics charges.

---

## 14. FLORAL FOOD HABITAT MANAGEMENT

**Route:** `/floral-habitat-management`

### 14.1 What It Does
Manages the educational and sensory immersion page at `/shop/starting-floral-food-habitat`.

### 14.2 Configurable Options
- **Headline & Narrative Copy:** Edit the introductory storytelling explaining how to incorporate edible flowers into daily wellness.
- **Curated Video Reels:** Add or reorder video links (queried automatically from Supabase Storage folder `starting floral habits videos` or custom MP4 URLs).
- **Starter Packs Selection:** Select starter combo products showcased beneath the videos.

---

## 15. BYOC (BUILD YOUR OWN CART) BUNDLE MANAGER

**Route:** `/byoc-management`

### 15.1 What It Does
Controls the custom floral gift box bundle builder page at `/shop/byoc`.

### 15.2 Configurable Pricing Tiers
- **Tier 1:** 3 Items Bundle Price (e.g. ₹799).
- **Tier 2:** 4 Items Bundle Price (e.g. ₹1049).
- **Tier 3:** 5 Items Bundle Price (e.g. ₹1399).

### 15.3 Eligible Product Catalog
- Select which catalog products are available in the BYOC builder (e.g. cookies, tea tins, saffron jars).
- System automatically applies tier bundle discounts when customer completes their selection.

---

## 16. CATEGORY GRID MANAGEMENT

**Route:** `/category-grid-management`

### 16.1 What It Does
Manages the visual category navigation tiles displayed on the homepage.

### 16.2 Configurable Options
- **Category Titles:** Display names for each tile.
- **Card Images:** Custom photography showcasing the category.
- **Accent Theme Color:** Set custom background tints matching floral ingredients.
- **Promotional Badge Text:** e.g. "Bestseller", "New Launch", "Chef's Special".

---

## 17. FAMILY COMBOS MANAGEMENT

**Route:** `/family-management`

### 17.1 What It Does
Manages family-sized value bundles and multi-generation sharing packs.

### 17.2 Options
- Curate featured family combo products.
- Configure promotional banners and description copy.

---

## 18. MOM'S COMMUNITY & EVENT MOMENTS GALLERY

**Route:** `/community-management`

### 18.1 What It Does
Controls the community storytelling page at `/shop/our-own-community`.

### 18.2 Configurable Assets
- **Event Moments Slideshow:** Upload and arrange high-resolution photos of real family gatherings, kids tasting sessions, and community events.
- **Community Captions:** Edit testimonial stories and photo captions.
- **WhatsApp Group Invite Link:** Manage direct invitation link to the official Paidhu WhatsApp Mothers Community group.

---

## 19. OUR PHILOSOPHY & BOTANICAL NUTRITION CMS

**Route:** `/philosophy-management`

### 19.1 What It Does
Manages brand authenticity storytelling, non-GMO promises, and pure natural ingredients messaging.

### 19.2 Options
- Edit brand philosophy paragraphs and pillar values (Pure, Clean, Botanical, Handcrafted).
- Manage certifications (FSSAI compliance, chemical-free testing).

---

## 20. ABOUT US MANAGEMENT

**Route:** `/about-us-management`

### 20.1 What It Does
Controls the founder story, farm-to-table origin story, and culinary journey displayed at `/about`.

### 20.2 Options
- Founder letter and signature.
- Farm sourcing photography and milestones timeline.

---

## 21. BULK ORDERS CONTENT & CORPORATE GIFTING

**Route:** `/bulk-orders-management`

### 21.1 What It Does
Controls the promotional B2B landing page at `/shop/bulk-orders`.

### 21.2 Options
- Corporate gifting catalogue download link.
- Wedding favors and corporate hampers photo gallery.
- Custom branding packaging options showcase.

---

## 22. B2B CORPORATE BULK ORDER INQUIRIES

**Route:** `/bulk-order-inquiries`

### 22.1 What It Does
Captures lead inquiries submitted through the Corporate & Bulk Orders contact form.

### 22.2 Data Attributes
- **Company Name & Contact Person.**
- **Phone Number & Business Email.**
- **Estimated Quantity:** Units needed (e.g. 100 boxes, 500 hampers).
- **Target Event Date & Delivery Location.**
- **Requirement Notes:** Custom box customization requests.

### 22.3 Action Steps
- Click phone number to call or email to reply with a formal B2B quotation.

---

## 23. SAFFRON GUIDANCE PREGNANCY CONSULTATION LEADS

**Route:** `/saffron-guidance-leads`

### 23.1 What It Does
Captures medical and lifestyle consultation requests submitted through `/saffron-guidance`.

### 23.2 Attributes Displayed
- **Mother's Full Name & Spouse's Name.**
- **Contact Telephone Number:** Clickable for direct WhatsApp/Phone call.
- **Month of Pregnancy:** Gestational month (Month 1 through Month 9).
- **Doctor's Permission:** *Yes* or *No* flag indicating physician clearance.
- **Purpose & Notes:** Customer questions regarding dosage and authentic saffron preparation.

### 23.3 Lead Pipeline Status Machine
- `Pending` (Yellow): Newly received inquiry.
- `Contacted` (Blue): Consultation specialist called or messaged customer.
- `Resolved` (Green): Consultation completed and customer guided or order placed.

---

## 24. WHATSAPP PROMPT & TIFFIN LEADS

**Route:** `/whatsapp-leads`

### 24.1 What It Does
Captures phone numbers from newsletter subscription modals, tiffin service registrations, and WhatsApp quick-buy prompts across the store.

### 24.2 Features
- Filter by date captured.
- One-click export to CSV for SMS or WhatsApp broadcast marketing.
- Direct link to open WhatsApp conversation.

---

## 25. CAREER & JOB APPLICATIONS PIPELINE

**Route:** `/career-applications`

### 25.1 What It Does
Captures job applicant submissions from the `/careers` storefront portal.

### 25.2 Attributes Displayed
- **Candidate Name, Email, and Phone.**
- **Applied Position:** (e.g. Pastry Chef, Digital Marketer, Operations Lead).
- **Education & Experience:** College, degree, and graduation year.
- **Portfolio Link & Cover Letter.**
- **Resume Attachment:** One-click preview and download of uploaded PDF resume.

### 25.3 Hiring Workflow Status
- Update candidate status: `New` $ightarrow$ `Reviewed` $ightarrow$ `Shortlisted` $ightarrow$ `Rejected`.

---

## 26. BLOG AUTHORING & EDITORIAL ENGINE

**Route:** `/blogs`

### 26.1 Publishing New Articles (`/blogs/new`)
- **Article Title:** Compelling recipe or floral wellness title.
- **URL Slug:** Clean SEO-friendly path.
- **Cover Image:** High-resolution featured banner upload.
- **Rich-Text Editor:** Supports headings, bold/italic, lists, blockquotes, and inline images.
- **Author & Category Tags:** Assign author credit and tags (e.g., *Recipes*, *Health & Wellness*, *Saffron Care*).
- **Publication Status:** Toggle between `Draft` (private) and `Published` (live on `/blogs`).

---

## 27. CUSTOMER REVIEWS MODERATION

**Route:** `/reviews`

### 27.1 What It Does
Moderates customer reviews and star ratings submitted on product pages.

### 27.2 Controls
- Inspect review text, customer name, star rating (1–5 stars), and referenced product.
- Click **Approve** to publish review publicly, or **Reject/Delete** to suppress spam or inappropriate content.

---

## 28. STATIC CMS PAGES & LEGAL POLICIES

**Route:** `/pages` and `/pages/edit/:slug`

### 28.1 Managed Pages
- Privacy Policy (`/privacy-policy`)
- Terms & Conditions (`/terms-conditions`)
- Shipping Policy (`/shipping-policy`)
- Refund & Cancellation Policy (`/refund-policy`)
- Contact Us (`/contact-us`)

### 28.2 How It Works
Admins can update legal terms, company addresses, and policy clauses directly through the rich editor without developer assistance.

---

## 29. SEO & SEARCH ENGINE OPTIMIZATION

**Route:** `/seo` and `/products/seo`

### 29.1 Global Pages SEO
- Set custom **Meta Titles** (under 60 characters).
- Set custom **Meta Descriptions** (under 160 characters).
- Upload custom **OpenGraph (OG) Social Share Images** so links shared on WhatsApp, Facebook, or Twitter display branded cards.

### 29.2 Product SEO Inspector
- Inspect search engine preview cards for each product catalog item.

---

## 30. TRACKING SCRIPTS INJECTION (GA4, GTM, META PIXEL)

**Route:** `/tracking`

### 30.1 What It Does
Allows marketing teams to deploy analytics and advertising conversion scripts without modifying codebase files.

### 30.2 Supported Providers
- Google Analytics 4 (GA4 Measurement ID).
- Google Tag Manager (GTM Container ID).
- Meta Pixel (Facebook Pixel ID & Conversion API).
- Google Ads Remarketing Tag.
- Custom Site Verification tags (Google Search Console, Pinterest, Bing).

### 30.3 Placement Controls
- `HEAD`: Injected before `</head>` (recommended for GA4, GTM, Meta Pixel).
- `BODY_START`: Injected immediately after `<body>` (recommended for GTM noscript).
- `BODY_END`: Injected before `</body>` (recommended for chat widgets).
- **Active Switch:** Toggle tracking on/off with zero downtime.

---

## 31. GLOBAL STORE SETTINGS & MAINTENANCE MODE SWITCH

**Route:** `/settings`

### 31.1 Brand Contact Parameters
- Official Customer Support Telephone Number.
- Official WhatsApp Business Chat URL.
- Official Support Email (`info@paidhu.com`).
- Kitchen / Office Physical Address.

### 31.2 Announcement Marquee Ticker
- Edit the scrolling promotional banner running across the top of the storefront (e.g. *"Free shipping on orders above ₹999 | 100% Preservative Free Floral Foods"*).

### 31.3 Under Maintenance Mode Switch
- **How It Works:**
  - Toggle **Maintenance Mode** switch to `ON` when performing system upgrades or inventory overhauls.
  - When `ON`, visitors to the storefront (or localhost) cannot view unfinished pages and are shown the dedicated **Under Maintenance Page** with the Paidhu logo, *the edibleflower.co* subtext, and the direct **WhatsApp Order & Support navigation button**.
  - **Admin Preview Bypass:** Team members can bypass maintenance mode anytime by appending `?preview=true` to any storefront URL (e.g., `https://paidhuethicalfoods.com/?preview=true`).

---

## 32. ADMIN PROFILE & PASSWORD ROTATION

**Route:** `/profile`

### 32.1 Profile Details
- View registered email, assigned role name, and permissions scope.

### 32.2 Password Change
- Enter Current Password $ightarrow$ Enter New Password $ightarrow$ Confirm New Password.
- Changes take effect immediately; system enforces minimum 8 characters with alphanumeric requirements.

---
*Manual compiled and maintained for Paidhu Ethical Foods Management & Operations.*
