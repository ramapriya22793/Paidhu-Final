# PAIDHU ETHICAL FOODS
## ADMIN PORTAL
**Website:** [https://admin.paidhuethicalfoods.com/](https://admin.paidhuethicalfoods.com/) *(Local Development: `http://localhost:5174`)*  
**Document Type:** Admin Portal User Manual & Standard Operating Procedure (SOP)  
**Version:** 1.0  
**Prepared For:** PaidhuEthicalFoods  
**Purpose:** To provide a clear and standardized procedure for managing the Paidhu Ethical Foods website and e-commerce operations through the Admin Portal.

---

## TABLE OF CONTENTS
1. [Admin Login](#1-admin-login)
2. [Dashboard](#2-dashboard)
3. [Products](#3-products)
4. [Categories](#4-categories)
5. [Orders](#5-orders)
6. [Customers](#6-customers)
7. [Inventory / Stock](#7-inventory--stock)
8. [Payments](#8-payments)
9. [Delivery / Shipping](#9-delivery--shipping)
10. [Offers / Discounts](#10-offers--discounts)
11. [Website Content](#11-website-content)
12. [Reviews & Ratings](#12-reviews--ratings)
13. [Notifications](#13-notifications)
14. [Reports](#14-reports)
15. [Search & Filters](#15-search--filters)
16. [Admin Users](#16-admin-users)
17. [Roles & Permissions](#17-roles--permissions)
18. [Settings](#18-settings)
19. [Activity / Audit Logs](#19-activity--audit-logs)
20. [Admin Daily Operations](#20-admin-daily-operations)

---

## 1. Admin Login
### Purpose:
Used by authorized administrators to securely access the Paidhu Ethical Foods Admin Portal.

### Admin can:
- **Login to the portal:** Enter registered administrative email and password at `/login`. The portal authenticates using encrypted `bcryptjs` credentials and issues a secure 7-day JWT session token.
- **Enforce Password Rotation:** First-time staff members are automatically prompted with a forced password change screen at `/change-password` before receiving dashboard access.
- **Access authorized modules:** Based on assigned administrative role (`SUPER_ADMIN`, `ECOMMERCE_ADMIN`, or `ACCOUNTS_ADMIN`), navigation items are filtered dynamically.
- **Logout from the portal:** Click the red **Logout** button at the bottom of the sidebar to invalidate the local session and redirect back to the login screen safely.

---

## 2. Dashboard
### Purpose:
Provides an overall view of the activities and information managed through the Admin Portal.

### Admin can view:
- **Revenue Overview:** Total gross sales (₹) calculated in real time from all captured Razorpay and confirmed COD transactions.
- **Order information:** Total order count, today's order volume, and month-over-month growth trends.
- **Product information:** Total catalog count, active listings, and instant warning indicator for items with low stock ($le 5$ units).
- **Customer information:** Total registered customer count and active buyer telemetry.
- **Sales/business information:** Interactive Recharts visual curve displaying daily and monthly sales trajectories.
- **Pending activities:** Orders awaiting packaging (`Paid`), shipments in transit (`Shipped`), and new consultation leads.
- **Important notifications:** Alerts for newly placed orders, low inventory levels, and customer inquiries.

---

## 3. Products
### Purpose:
Used to manage the products displayed and sold through the Paidhu Ethical Foods website.

### Admin can:
- **View products (`/products`):** Browse the complete catalog table with thumbnail preview, title, category, SKU, stock level, and price.
- **Add products (`/products/new`):** Create new floral food listings:
  1. *Core Data:* Enter Product Title (e.g., "Artisanal Hibiscus Petal Jam"), short promotional summary, and rich culinary description.
  2. *URL Slug:* Automatically generated from the product title for SEO (e.g., `artisanal-hibiscus-petal-jam`).
  3. *Category:* Assign to appropriate catalog section.
- **Update product price:** Set base MRP price and promotional discounted offer price.
- **Update product images:** Drag and drop up to 6 high-resolution product photos. Uploads directly to Supabase Cloud Storage bucket `products` with public CDN URLs.
- **Update product description:** Edit ingredients, storage recommendations, shelf life, and botanical benefits.
- **Manage multi-size variants:** Click **Add Variant** to configure multiple size offerings (e.g., 50g, 100g, 250g, 500g, 1kg) with individual prices, offer prices, stock units, and SKUs.
- **Manage product availability:** Set badges such as `bestseller`, `new_arrival`, `deal_of_the_day`, or `family_combo`.
- **Manage product status:** Toggle products between active (visible on website) and inactive (hidden).

---

## 4. Categories
### Purpose:
Used to organize products into appropriate product categories.

### Admin can:
- **View categories (`/category-grid-management`):** Inspect all active categories including *Bloom Cookies*, *Petal Jams*, *Pure Saffron*, *Floral Teas*, *Brew Flora*, and *Super Value Packs*.
- **Add & Edit categories:** Define category names, subtitle slogans, and category URL slugs.
- **Manage category information:** Set custom background accent color tints matching floral botanicals (rose pink, saffron gold, lavender purple).
- **Manage promotional badges:** Assign display tags to category tiles on the storefront (e.g. "Bestseller", "New Launch", "Chef's Special").
- **Manage category status:** Toggle visibility of category tiles on the homepage category grid.

---

## 5. Orders
### Purpose:
Used to manage customer orders received through the website.

### Admin can:
- **View orders (`/orders`):** Filter orders across status tabs: `ALL`, `PENDING`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, and `CANCELLED`.
- **View order details (`/orders/:id`):** Open order workspace showing complete line items breakdown, selected variant sizes, unit prices, and quantities.
- **View customer details:** Full customer name, telephone number (with one-click WhatsApp/Call button), and email address.
- **View delivery information:** Exact delivery address including flat/door number, street, city, state, and 6-digit postal code.
- **Check order amount & payment information:** Inspect subtotal, coupon discounts applied, delivery charges added, Razorpay transaction ID, and final payment method (UPI, Card, COD).
- **Update order status:** Advance order status from `Paid` $ightarrow$ `Processing` $ightarrow$ `Shipped` $ightarrow$ `Delivered`.
- **Assign courier tracking:** Input courier partner name (e.g. Blue Dart, Delhivery) and AWB Tracking Number.
- **Generate Tax Invoice:** Click **"Print Tax Invoice"** to render a standard printer-ready Paidhu GST Tax Invoice with customer shipping label.
- **Manage cancelled & refunded orders:** Process cancellations and issue refunds with recorded internal reason notes.

---

## 6. Customers
### Purpose:
Used to manage customer information associated with website orders.

### Admin can:
- **View customers (`/customers`):** Searchable customer directory displaying full name, verified mobile number, email, and registration date.
- **View customer details (`/customers/:id`):** Open customer profile card showing account statistics.
- **View contact information:** Mobile number and email for order updates or customer support.
- **View delivery information:** Full address book of saved delivery locations (Home, Work, etc.).
- **View customer order history:** Chronological ledger of all past orders placed by the customer, cumulative lifetime spend (LTV), and average order value.
- **Update customer information where permitted:** Update delivery notes, addresses, or account status upon customer request.

---

## 7. Inventory / Stock
### Purpose:
Used to maintain product availability and stock information.

### Admin can:
- **View product stock:** Real-time stock units count displayed across all products and individual size variants.
- **Update stock quantity:** Adjust physical count after new bakery batches or incoming supplier consignments.
- **Identify available products:** Green badge indicator for items with healthy stock levels.
- **Identify low-stock products:** Amber warning badge for items with remaining stock $le 5$ units, triggering kitchen replenishment.
- **Identify out-of-stock products:** Red badge for items at 0 stock, automatically showing "Sold Out" on the website to prevent overselling.
- **Maintain accurate product availability:** Stock auto-decrements synchronously whenever a customer completes a verified payment.

---

## 8. Payments
### Purpose:
Used to monitor, verify, and reconcile financial transactions from online payment gateways and cash-on-delivery orders.

### Admin can:
- **View payment transactions (`/payments`):** Real-time ledger of all payment attempts.
- **Check payment details (`/payments/:id`):** Inspect Razorpay Payment ID (`pay_xxx`), Razorpay Order ID, captured amount, and payment timestamp.
- **Check payment methods:** Verify whether payment was made via UPI (Google Pay, PhonePe, Paytm), NetBanking, Credit/Debit Card, or COD.
- **Verify gateway status:** Filter by `SUCCESS` (captured), `PENDING` (in checkout), or `FAILED` (bank decline).
- **Process refunds:** Issue full or partial refunds through the portal with audit log tracking and automated order status update to `CANCELLED`.

---

## 9. Delivery / Shipping
### Purpose:
Used to manage the delivery-related information associated with customer orders.

### Admin can:
- **View delivery address:** Complete shipping address and postal pincode on every order card.
- **Configure shipping fees (`/delivery-charges`):**
  - Set **Standard Delivery Charge** (e.g. ₹60).
  - Set **Express Delivery Charge** (e.g. ₹120).
  - Set **Free Delivery Threshold** (e.g. Free shipping automatically on orders above ₹999).
- **Configure delivery timelines:** Set customer-facing promise (e.g. *"Estimated delivery in 3–5 business days"*).
- **Manage regional delivery rules:** Specify pincodes or states requiring special logistics charges.
- **Track dispatch and delivery status:** Update courier tracking URL/AWB so customers receive real-time dispatch updates.

---

## 10. Offers / Discounts
### Purpose:
Used to manage promotional offers and discounts provided to customers.

### Admin can:
- **Create offers (`/coupons`):** Click **"Create Coupon"** to configure new discount codes (e.g. `PAIDHU10`, `WELCOME500`).
- **Set discount types:**
  - *Percentage:* e.g. 10% off entire order.
  - *Fixed Amount:* e.g. Flat ₹150 off.
- **Manage discount information:**
  - Set numeric discount amount.
  - Set minimum cart value required for coupon eligibility (e.g. Min cart ₹999).
  - Set maximum discount ceiling for percentage coupons (e.g. 15% off up to max ₹300).
- **Activate/deactivate offers:** Instant toggle switch to enable or pause promotional codes.
- **Manage offer validity:** Set start and expiration calendar dates, and set per-customer or global usage redemption caps.
- **Manage Flash Deals of the Day (`/deals-management`):** Curate limited-time deals on `/shop/deal-of-the-day` with countdown timers.

---

## 11. Website Content
### Purpose:
Used to manage content displayed on the Paidhu Ethical Foods website.

### Admin can manage:
- **Banners (`/banners`):**
  - Upload desktop hero banners (**exact 1920 x 427 px**) and responsive mobile banners.
  - Assign banners by page: `home`, `shop-all`, `deal-of-the-day`, or specific categories.
  - Set click destination URLs and toggle active status.
- **Floral Habitat Section (`/floral-habitat-management`):**
  - Manage video reels (fetched from Supabase Storage `starting floral habits videos` folder or custom URLs).
  - Update storytelling headlines and starter pack product recommendations.
- **Build Your Own Cart (BYOC) Bundles (`/byoc-management`):**
  - Configure the 3 custom bundle tiers: Tier 1 (3 for ₹799), Tier 2 (4 for ₹1049), Tier 3 (5 for ₹1399).
  - Select eligible products available in the bundle customizer.
- **Mom's Community & Family Tales (`/community-management`):**
  - Upload real community event photos, tasting memories, and captions on `/shop/our-own-community`.
  - Update official WhatsApp community group invitation links.
- **Our Philosophy & About Us (`/philosophy-management`, `/about-us-management`):**
  - Edit botanical nutrition philosophy, pure ingredient guarantees, founder story, and certifications.
- **Static Pages (`/pages`):**
  - Rich-text editor for Privacy Policy, Terms & Conditions, Shipping Policy, and Refund Policy.

---

## 12. Reviews & Ratings
### Purpose:
Used to manage customer feedback and product reviews.

### Admin can:
- **View reviews (`/reviews`):** Browse all customer reviews submitted across the product catalog.
- **View ratings:** Inspect 1 to 5 star ratings submitted by verified buyers.
- **Approve reviews:** One-click approval to publish positive customer feedback onto the live product page.
- **Reject/Delete inappropriate reviews:** Filter and remove spam, offensive comments, or invalid feedback to protect brand trust.
- **Monitor customer feedback:** Track customer satisfaction trends across different floral food recipes.

---

## 13. Notifications
### Purpose:
Provides important alerts and updates related to portal activities.

### Admin can view:
- **Notification Dropdown:** Top-bar bell icon with real-time badge count.
- **New order notifications:** Instant alert when an online order is placed.
- **Payment notifications:** Confirmation of successful Razorpay captures or payment failures.
- **Stock notifications:** Automatic warnings when an SKU reaches critical threshold ($le 5$ units).
- **Lead notifications:** New pregnancy consultation requests or corporate bulk order inquiries.

---

## 14. Reports
### Purpose:
Used to review business and operational information generated through the portal.

### Admin can view or generate:
- **Sales & Revenue Reports:** Daily, weekly, and monthly revenue performance via Dashboard charts.
- **Order Reports:** Summary of completed, processing, and cancelled order volumes.
- **Abandoned Cart Telemetry (`/active-carts`):** Uncompleted customer carts with values and direct WhatsApp recovery triggers.
- **Wishlist Demand Reports (`/wishlists`):** Heatmap of products most desired by customers to guide production planning.
- **Lead Pipeline Reports:**
  - *Saffron Guidance Pregnancy Leads (`/saffron-guidance-leads`):* Gestational month, physician clearance, and consultation status.
  - *B2B Bulk Order Inquiries (`/bulk-order-inquiries`):* Corporate gifting volume requests and deadlines.
  - *Career Applications (`/career-applications`):* Job applicant resumes and hiring stages.

---

## 15. Search & Filters
### Purpose:
Used to quickly locate specific information within the Admin Portal.

### Admin can search/filter:
- **Global Header Search:** Search across products, orders, and customers from the top search bar.
- **Product Filters:** Filter by category, price range, stock availability (`In Stock`, `Low Stock`, `Out of Stock`), or SKU.
- **Order Filters:** Filter by status tab (`Paid`, `Processing`, `Shipped`, etc.), customer name, phone number, or date range.
- **Payment Filters:** Filter by Razorpay ID, payment method (UPI, Card, COD), or transaction status.
- **Lead Filters:** Filter inquiries by status (`Pending`, `Contacted`, `Resolved`).

---

## 16. Admin Users
### Purpose:
Used to manage users who have access to the Admin Portal.

### Admin can:
- **View admin users:** List of all registered staff accounts with assigned emails and roles.
- **Add users:** Provision new administrator accounts with initial credentials.
- **Edit users:** Update staff names, assigned contact information, and role assignments.
- **Activate/deactivate users:** Instantly revoke portal access for departing team members.
- **Manage user access:** Enforce password reset requirements for enhanced security.

---

## 17. Roles & Permissions
### Purpose:
Used to control what different admin users can access and manage.

### Admin can:
- **View role permissions:**
  - `SUPER_ADMIN`: Unrestricted master access across all 28 modules and system settings.
  - `ECOMMERCE_ADMIN`: Operational management of catalog, orders, carts, content, banners, and leads.
  - `ACCOUNTS_ADMIN`: Focused management of financial transactions, orders, invoices, and stock deductions.
- **Assign roles:** Assign appropriate operational roles to new or existing staff.
- **Restrict module access:** Automatically hides restricted navigation links and blocks unauthorized API calls.

---

## 18. Settings
### Purpose:
Contains the configuration options used to manage the portal and website.

### Admin can manage:
- **General Store Information (`/settings`):** Official customer support telephone numbers, WhatsApp contact link, and official email (`info@paidhu.com`).
- **Announcement Bar:** Edit the top scrolling promotional marquee ticker displayed across the storefront.
- **Maintenance Mode Switch:**
  - Toggle **Maintenance Mode** `ON` during website updates or catalog overhauls.
  - Displays the dedicated **Under Maintenance Page** featuring the Paidhu logo, *the edibleflower.co* subtext, and the direct **WhatsApp Order & Support navigation button**.
  - Team members can preview the live website anytime by appending `?preview=true` to any URL.
- **Tracking Scripts Injection (`/tracking`):** One-click script injection for Google Analytics 4 (GA4), Google Tag Manager (GTM), and Meta Pixel with target placement (`HEAD`, `BODY_START`, `BODY_END`).

---

## 19. Activity / Audit Logs
### Purpose:
Used to track administrative activities performed within the portal.

### Admin can view:
- **Login Activity (`/login-history`):** Complete audit log of every login attempt with user email, client IP address, device/browser details, timestamp, and status (`SUCCESS` or `FAILED`).
- **Order status changes:** History of when an order transitioned between status phases.
- **Date and time of changes:** Exact timestamps for every administrative action to ensure operational accountability.

---

## 20. Admin Daily Operations
### Purpose:
Defines the regular activities that the admin should perform to maintain smooth e-commerce operations.

### Daily Standard Operating Procedure (SOP) Checklist:

#### Morning Shift (09:00 AM - 10:30 AM):
1. **Login to Admin Portal:** Authenticate at `https://admin.paidhuethicalfoods.com/`.
2. **Review Dashboard KPIs:** Inspect overnight sales revenue, order counts, and any low-stock alerts.
3. **Check New Orders (`/orders`):**
   - Review all orders in `Paid` status.
   - Click each order, verify item quantities and variants.
   - Click **"Print Tax Invoice"** and send pick-lists to the kitchen/packing team.
   - Advance status to `Processing`.
4. **Follow Up on Pregnancy Leads (`/saffron-guidance-leads`):**
   - Check new saffron consultation inquiries.
   - Contact mothers via WhatsApp/Phone to answer dosage questions, and update status to `Contacted`.

#### Midday Shift (01:00 PM - 02:30 PM):
5. **Recover Abandoned Carts (`/active-carts`):**
   - Review high-value carts dropped off in the last 24 hours.
   - Click **"Chat on WhatsApp"** to send personalized recovery offers or coupon codes.
6. **Review Corporate Bulk Inquiries (`/bulk-order-inquiries`):**
   - Review incoming wholesale/wedding gifting inquiries and email formal quotations.
7. **Moderate Customer Reviews (`/reviews`):**
   - Review newly submitted 1–5 star reviews and approve genuine customer feedback.

#### Evening Shift (05:00 PM - 06:30 PM):
8. **Update Dispatched Shipments (`/orders`):**
   - Collect tracking numbers from the courier partner.
   - Enter Courier Name and AWB Tracking Number on processed orders.
   - Advance status from `Processing` $ightarrow$ `Shipped`.
9. **Check Stock & Inventory (`/products`):**
   - Verify remaining stock for bestselling items.
   - If stock $le 5$ units, notify the kitchen team to schedule baking/production batches.
10. **Review Security & Audit Log (`/login-history`):**
    - Inspect login history to ensure no unauthorized access attempts occurred.
11. **Check Website Status & Settings (`/settings`):**
    - Ensure storefront announcement ticker and banners are active and accurate.
    - If maintenance is required, toggle Maintenance Mode `ON` and verify the WhatsApp order bridge.

---
*Standard Operating Procedure (SOP) authorized for Paidhu Ethical Foods Operations Team.*
