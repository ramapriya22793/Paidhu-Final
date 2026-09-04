# PAIDHU ETHICAL FOODS — ADMIN PORTAL OPERATIONS & FEATURE MANUAL
**Document Version:** 3.0 | **Last Updated:** September 2026 | **Classification:** Official Administrative Guide  
**Application:** Paidhu Admin Management Portal  
**Portal Access:** [https://admin.paidhuethicalfoods.com](https://admin.paidhuethicalfoods.com) (or local port `http://localhost:5174`)

---

## TABLE OF CONTENTS
1. [Overview & Role-Based Access Control (RBAC)](#1-overview--role-based-access-control-rbac)
2. [Authentication & Account Security](#2-authentication--account-security)
3. [Executive Dashboard & Real-Time Analytics](#3-executive-dashboard--real-time-analytics)
4. [Product Catalog & Inventory Management](#4-product-catalog--inventory-management)
5. [Order Fulfillment & Invoice Generation](#5-order-fulfillment--invoice-generation)
6. [Abandoned Carts & Customer Wishlist Telemetry](#6-abandoned-carts--customer-wishlist-telemetry)
7. [Customer Management & Profiles](#7-customer-management--profiles)
8. [Financials, Payments & Refunds](#8-financials-payments--refunds)
9. [Coupons, Discounts & Flash Deals](#9-coupons-discounts--flash-deals)
10. [Promotional Banners (Desktop & Mobile)](#10-promotional-banners-desktop--mobile)
11. [Delivery Rules & Shipping Fee Engine](#11-delivery-rules--shipping-fee-engine)
12. [CMS & Dynamic Content Sections](#12-cms--dynamic-content-sections)
    - 12.1 Floral Food Habitat & Reel Videos
    - 12.2 BYOC (Build Your Own Cart) Bundles
    - 12.3 Family Combos & Category Grid
    - 12.4 Mom's Community & Event Moments Gallery
    - 12.5 Our Philosophy & About Us
13. [Lead Pipelines & Consultations](#13-lead-pipelines--consultations)
    - 13.1 WhatsApp Leads & Tiffin Subscriptions
    - 13.2 Saffron Guidance Pregnancy Leads
    - 13.3 B2B Bulk Order Inquiries
    - 13.4 Career & Job Applications
14. [Blog Publishing & Customer Reviews Moderation](#14-blog-publishing--customer-reviews-moderation)
15. [SEO & Search Engine Optimization](#15-seo--search-engine-optimization)
16. [Tracking Scripts (GA4, GTM, Meta Pixel)](#16-tracking-scripts-ga4-gtm-meta-pixel)
17. [Global Store Settings & Maintenance Mode](#17-global-store-settings--maintenance-mode)
18. [Quick Reference Workflow Guide](#18-quick-reference-workflow-guide)

---

## 1. OVERVIEW & ROLE-BASED ACCESS CONTROL (RBAC)

The Paidhu Admin Operations Portal provides 360-degree control over the entire e-commerce ecosystem. To ensure data privacy, financial integrity, and operational separation of duties, the system enforces **Role-Based Access Control (RBAC)** across three administrative tiers:

| Role Name | Access Scope | Intended Team |
| :--- | :--- | :--- |
| **SUPER_ADMIN** | Full, unrestricted access to all 28 modules, financial records, API keys, tracking codes, role provisioning, and store settings. | Business Owners & System Administrators |
| **ECOMMERCE_ADMIN** | Access to Products, Orders, Active Carts, WhatsApp Leads, Banners, BYOC Bundles, Blogs, Saffron Leads, and Bulk Inquiries. Financial gateway settings and tracking codes are restricted. | Store Operations, Catalog & Marketing Team |
| **ACCOUNTS_ADMIN** | Dedicated access to Dashboard, Order financials, Payment records, Stock Deductions, and Invoices. Customer management and content CMS are restricted. | Accounting, Finance & Inventory Controllers |

---

## 2. AUTHENTICATION & ACCOUNT SECURITY

### 2.1 Admin Login
- **URL:** `/login`
- **Authentication:** JWT (JSON Web Token) with 7-day expiration stored securely in client storage.
- **Password Protection:** Encrypted with `bcryptjs` (10 salt rounds).

### 2.2 Forced Password Rotation
- First-time admin users created by the system have the `mustChangePassword: true` flag enabled.
- Upon initial login, the admin is immediately redirected to `/change-password` and blocked from viewing operational data until a unique, secure password is set.

### 2.3 Login History & Audit Trail (`/login-history`)
- Automatically records every authentication attempt across the admin portal.
- **Logged Attributes:**
  - Administrator User ID and Email.
  - Client IP address.
  - Device User-Agent / Browser.
  - Exact Timestamp.
  - Login Status: `SUCCESS` or `FAILED`.

---

## 3. EXECUTIVE DASHBOARD & REAL-TIME ANALYTICS

**Route:** `/` (Dashboard)

The Dashboard provides executive management with an instant pulse of business performance:
- **Real-Time KPI Cards:**
  - **Total Revenue (₹):** Cumulative gross sales across all completed payments.
  - **Total Orders:** Count of orders with current period comparison.
  - **Total Registered Customers:** Growth in active user base.
  - **Low Stock Warnings:** Immediate count of items with stock <= 5 units.
- **Revenue & Orders Velocity Charts:** Interactive monthly/daily sales charts rendered via Recharts.
- **Recent Orders Table:** Last 10 customer orders with quick links to view invoice or update fulfillment status.
- **Bestseller Performance:** Ranking of top-performing floral products by sales volume.

---

## 4. PRODUCT CATALOG & INVENTORY MANAGEMENT

### 4.1 Product List (`/products`)
- Search by product name, SKU, or category.
- Filter by Category (Bloom Cookies, Petal Jam, Saffron, Medley Teas, Brew Flora, etc.).
- Direct stock status indicators: `In Stock`, `Low Stock`, or `Out of Stock`.
- Quick action buttons to Edit, Duplicate, or Delete products.

### 4.2 Add New Product (`/products/new`) & Edit Product (`/products/edit/:id`)
- **Core Information:** Product Name, URL Slug (auto-generated from title), Category assignment, and Rich Description.
- **Pricing & Discounts:** Base Price (₹), Discount / Sale Price (₹).
- **Product Images:** Multi-image upload manager with drag-and-drop support. Images are uploaded directly to Supabase Storage (`products` bucket) with CDN public URLs.
- **Multi-Variant Manager:**
  - Add multiple size/pack variants (e.g. 50g, 100g, 250g, 500g, 1kg).
  - Assign individual Base Price, Offer Price, and Stock quantity per variant.
- **Tags & Badges:** Assign badges such as `bestseller`, `new_arrival`, `family_combos`, or `pure_saffron`.

### 4.3 Stock Deductions
- Stock automatically decrements upon successful payment completion.
- Admins can manually adjust stock units in real time for physical inventory reconciliation.

---

## 5. ORDER FULFILLMENT & INVOICE GENERATION

### 5.1 Orders Overview (`/orders`)
- Filter orders by status tabs:
  - `ALL` — Complete order ledger.
  - `PENDING` — Created orders awaiting payment verification.
  - `PAID` — Payment confirmed via Razorpay or COD approved.
  - `PROCESSING` — Order in packing / kitchen preparation.
  - `SHIPPED` — Handed over to courier with tracking number.
  - `DELIVERED` — Successfully received by customer.
  - `CANCELLED` — Order refunded or cancelled.

### 5.2 Order Details & Invoice (`/orders/:id`)
- **Customer Information:** Full name, mobile phone number, email address.
- **Shipping Address:** House/Flat, Street, City, State, and 6-digit Pincode.
- **Line Items Breakdown:** Products purchased, selected size variant, unit price, quantity, and line total.
- **Cost Summary:** Subtotal, Applied Coupon Code & Discount amount, Delivery Charge, and Grand Total.
- **Status Machine Controls:** One-click dropdown to advance order status.
- **Print Tax Invoice:** Generates clean, printer-ready official Paidhu Tax Invoice with GST calculations and customer shipping label.

---

## 6. ABANDONED CARTS & CUSTOMER WISHLIST TELEMETRY

### 6.1 Active Carts Telemetry (`/active-carts`)
- Displays real-time abandoned carts where customers added products but did not complete checkout.
- **Visible Data:** Customer Phone Number, Email, Cart Subtotal, Items in Cart, and Last Updated Time.
- **Direct WhatsApp Recovery Button:** One click opens WhatsApp with a pre-drafted recovery message offering assistance or a personalized discount code to close the sale.

### 6.2 Wishlist Insights (`/wishlists`)
- Aggregates all products currently saved in customer wishlists.
- Identifies unfulfilled customer demand to guide batch production, restocking, or targeted promotion campaigns.

---

## 7. CUSTOMER MANAGEMENT & PROFILES

**Route:** `/customers` and `/customers/:id`
- **Customer Directory:** Full listing of all registered users on the Paidhu storefront.
- **Customer Profile View:**
  - Account creation date and verified contact numbers.
  - Saved shipping addresses.
  - Lifetime Order Count and Cumulative Spend.
  - Complete historical order timeline.

---

## 8. FINANCIALS, PAYMENTS & REFUNDS

### 8.1 Payment Transactions (`/payments`)
- Real-time ledger of Razorpay transactions.
- **Attributes:** Razorpay Payment ID (`pay_xxx`), Order ID, Amount, Payment Method (UPI, NetBanking, Credit Card, COD), and Payment Status (`SUCCESS`, `PENDING`, `FAILED`).

### 8.2 Refund Management
- View refund requests and logged reasons.
- Issue refunds with status tracking (`PENDING`, `APPROVED`, `PROCESSED`, `REJECTED`).
- Automatically updates the corresponding order status to `CANCELLED` upon refund completion.

---

## 9. COUPONS, DISCOUNTS & FLASH DEALS

### 9.1 Coupon Manager (`/coupons`)
- Create promotional coupon codes (e.g. `FLORAL10`, `WELCOME100`).
- **Discount Types:**
  - `PERCENTAGE` (e.g. 15% off).
  - `FIXED` (e.g. Flat ₹150 off).
- **Rule Constraints:**
  - Minimum Cart Value required for coupon eligibility.
  - Maximum discount ceiling for percentage coupons.
  - Expiration Date & Active/Inactive toggle switch.
  - Usage Limits per customer or global redemption cap.

### 9.2 Deals of the Day (`/deals-management`)
- Curate special limited-time promotional products featured on the storefront under `/shop/deal-of-the-day`.
- Configure promotional discount badges and countdown timer schedules.

---

## 10. PROMOTIONAL BANNERS (DESKTOP & MOBILE)

**Route:** `/banners`

- **Target Page Routing:** Assign banners to specific pages:
  - `home` — Main storefront homepage slider.
  - `shop-all` — Full catalog banner (**recommended dimensions: 1920 x 427 px**).
  - `deal-of-the-day` — Flash deals page banner.
  - Specific product category slugs (e.g. `bloom-cookies`, `saffron`).
- **Responsive Multi-Device Uploads:**
  - **Web Image:** High-resolution desktop banner.
  - **Mobile Image:** Vertically optimized banner for mobile smartphone viewports.
- **Banner Controls:** Toggle banners active or inactive instantly without deleting uploaded assets.

---

## 11. DELIVERY RULES & SHIPPING FEE ENGINE

**Route:** `/delivery-charges`

- **Standard & Express Delivery Rules:** Set custom delivery fees for standard and expedited shipping.
- **Free Delivery Threshold:** Configure minimum order amount (e.g. Orders above ₹999 receive Free Shipping).
- **Regional Pincode Rules:** Set specific shipping fees based on customer delivery states or metro zones.
- **Estimated Delivery Timelines:** Configure customer-facing delivery promises (e.g. *"Delivery in 3–5 Business Days"*).

---

## 12. CMS & DYNAMIC CONTENT SECTIONS

The Admin Portal includes comprehensive Content Management modules for every dynamic storefront section:

### 12.1 Floral Food Habitat Management (`/floral-habitat-management`)
- Controls content on `/shop/starting-floral-food-habitat`.
- Curate video reel links (queried automatically from Supabase Storage `starting floral habits videos` folder or custom CDN URLs).
- Edit headline, introduction paragraph, and starter product recommendations.

### 12.2 BYOC (Build Your Own Cart) Management (`/byoc-management`)
- Controls bundle pricing tiers:
  - Tier 1: 3 Items for ₹799.
  - Tier 2: 4 Items for ₹1049.
  - Tier 3: 5 Items for ₹1399.
- Select eligible products included in the custom bundle builder.

### 12.3 Family Combos & Category Grid Management (`/family-management` & `/category-grid-management`)
- Manage category display cards on the homepage.
- Set custom accent colors, badge text (e.g. *Bestseller*, *New Arrival*), and fallback imagery.

### 12.4 Mom's Community & Family Tales (`/community-management`)
- Manage slideshow and photo highlights on `/shop/our-own-community`.
- Update community event captions, celebration photos, and WhatsApp group invitation links.

### 12.5 Our Philosophy & About Us (`/philosophy-management` & `/about-us-management`)
- Edit founder story, botanical food standards, certifications, and brand mission statements.

---

## 13. LEAD PIPELINES & CONSULTATIONS

### 13.1 WhatsApp Leads & Tiffin Subscriptions (`/whatsapp-leads`)
- Captures telephone numbers from storefront newsletter popups, tiffin registrations, and WhatsApp quick-buy prompts.
- Provides immediate export or direct one-click WhatsApp chat link.

### 13.2 Saffron Guidance Pregnancy Leads (`/saffron-guidance-leads`)
- Captures inquiries submitted through the Saffron Pregnancy Guidance consultation form (`/saffron-guidance`).
- **Attributes:** Mother's Name, Spouse's Name, Contact Number, Pregnancy Month (1st to 9th month), Doctor's Permission Status (*Yes/No*), and Notes.
- **Consultation Status Machine:** Update inquiry status: `Pending`, `Contacted`, or `Resolved`.

### 13.3 B2B Corporate Bulk Inquiries (`/bulk-order-inquiries`)
- Captures corporate gifting and wholesale inquiries from `/shop/bulk-orders`.
- Displays company name, requested volume, target delivery date, and budget.

### 13.4 Career & Job Applications (`/career-applications`)
- Captures job applicant submissions from `/careers`.
- Review applicant qualifications, resume attachments (PDF view), portfolio links, and update hiring stage: `New`, `Reviewed`, `Shortlisted`, or `Rejected`.

---

## 14. BLOG PUBLISHING & CUSTOMER REVIEWS MODERATION

### 14.1 Blog Publishing Engine (`/blogs`)
- Create and edit floral food blog articles, health guides, and recipe stories.
- **Features:** Rich text editor, SEO slug generation, featured cover photo upload, author name, category tags, and publication toggle (*Draft vs. Published*).

### 14.2 Reviews Moderation (`/reviews`)
- View all product reviews and star ratings submitted by customers.
- Approve or reject reviews before they appear publicly on the storefront product detail pages.

---

## 15. SEO & SEARCH ENGINE OPTIMIZATION

**Route:** `/seo` and `/products/seo`
- **Global Page Meta:** Manage Meta Titles, Descriptions, and OpenGraph social sharing images for all core pages.
- **Product SEO Manager:** Inspect and customize search engine snippets for each product in the catalog.

---

## 16. TRACKING SCRIPTS (GA4, GTM, META PIXEL)

**Route:** `/tracking`
- Inject third-party conversion and analytics tracking scripts without modifying source code.
- **Supported Providers:** Google Analytics 4 (GA4), Google Tag Manager (GTM), Meta Pixel (Facebook Pixel), Google Ads, and Custom Verification tags.
- **Placement Controls:** Choose injection target: `HEAD`, `BODY_START`, or `BODY_END`.
- Active/Inactive toggle switch to enable or disable tracking instantly.

---

## 17. GLOBAL STORE SETTINGS & MAINTENANCE MODE

**Route:** `/settings`
- **Store Contact Information:** Official support phone numbers, WhatsApp contact, and support email.
- **Announcement Bar:** Edit top scrolling promotional marquee text on the storefront.
- **Maintenance Mode:**
  - Toggle Under Maintenance mode on or off.
  - When enabled, customers see the dedicated Under Maintenance page with the direct WhatsApp order-taking bridge.
  - Admin team can bypass maintenance mode anytime by appending `?preview=true` to any storefront URL.

---

## 18. QUICK REFERENCE WORKFLOW GUIDE

| Administrative Task | Admin Route | Action to Take |
| :--- | :--- | :--- |
| **Add New Product** | `/products/new` | Enter title, price, size variants, upload images to Supabase, click *Save Product*. |
| **Process & Ship Order** | `/orders` | Open order, verify payment & items, update status to *Shipped*, click *Print Invoice*. |
| **Recover Abandoned Cart** | `/active-carts` | Review customer phone number, click *Chat on WhatsApp* with pre-drafted offer message. |
| **Create Coupon Code** | `/coupons` | Enter code (e.g. `WELCOME10`), set discount percentage, set minimum cart value, save. |
| **Upload Shop All Banner** | `/banners` | Select `shop-all`, upload desktop image (1920x427 px) & mobile image, click *Save*. |
| **Handle Pregnancy Lead** | `/saffron-guidance-leads` | Check gestational month, click phone number to connect on WhatsApp, update status to *Contacted*. |
| **Publish Blog Post** | `/blogs/new` | Write recipe or wellness article, upload featured image, select category tags, click *Publish*. |
| **Check Payment / Refund** | `/payments` | Locate transaction by Razorpay Payment ID, verify gateway receipt, initiate refund if needed. |

---
*Documentation maintained for Paidhu Ethical Foods Operations Team.*
