# PAIDHU ETHICAL FOODS — ADMIN PORTAL
## COMPLETE MULTI-ROLE OPERATIONS & STANDARD OPERATING PROCEDURE (SOP) MANUAL
**Website:** [https://admin.paidhuethicalfoods.com/](https://admin.paidhuethicalfoods.com/) *(Local Development: `http://localhost:5174`)*  
**Document Type:** Unified Standard Operating Procedure (SOP) & Admin User Manual  
**Version:** 2.0  
**Prepared For:** Paidhu Ethical Foods Operations Team  
**Coverage:** All 3 Administrative Roles (`SUPER_ADMIN`, `ECOMMERCE_ADMIN`, `ACCOUNTS_ADMIN`) across all 20 operational features.

---

## EXECUTIVE SUMMARY: ROLE ACCESS SUMMARY

| # | Feature | SUPER_ADMIN | ECOMMERCE_ADMIN | ACCOUNTS_ADMIN |
| :-: | :--- | :---: | :---: | :---: |
| **1** | **Admin Login** | Full Access | Staff Login (Forced Password Change) | Staff Login (Forced Password Change) |
| **2** | **Dashboard** | Full Executive KPIs | Sales, Orders & Low Stock Telemetry | Revenue, Transactions & Daily Charts |
| **3** | **Products** | Full Add/Edit/Delete/Variants | Full Add/Edit/Images/Variants | 🚫 Restricted *(Stock View Only)* |
| **4** | **Categories** | Full Category & Theme Control | Category Titles, Badges & Images | 🚫 Restricted (403) |
| **5** | **Orders** | Full Lifecycle & Invoicing | Fulfillment & Shipping *(Payments Redacted)* | Payment Verification & Invoices *(Shipping Blocked)* |
| **6** | **Customers** | Full Directory & Address Books | Customer Contact & Order History | 🚫 Restricted (403) |
| **7** | **Inventory / Stock** | Master Stock Control | Real-Time Stock Updates & Alerts | Dedicated Stock Audit & Reconciliation |
| **8** | **Payments** | Full Gateway & Refund Control | 🚫 Restricted (403) *(Payments Redacted)* | Full Razorpay Ledger & Refund Processing |
| **9** | **Delivery / Shipping** | Full Shipping Fee Engine | View Customer Delivery Details | 🚫 Restricted (403) |
| **10** | **Offers / Discounts** | Full Coupon & Deal Creation | View Coupons & Customer Assistance | 🚫 Restricted (403) |
| **11** | **Website Content** | Full Banners, BYOC, CMS Control | Manage Banners, BYOC, Habitat, Blogs | 🚫 Restricted (403) |
| **12** | **Reviews & Ratings** | Full Review Approval & Deletion | Moderate & Approve Reviews | 🚫 Restricted (403) |
| **13** | **Notifications** | All System Alerts | Orders, Stock & Lead Alerts | Payments & Zero-Stock Alerts |
| **14** | **Reports** | Master Business Intelligence | Abandoned Carts, Wishlists, Leads | Sales, Revenue & Refund Reconciliation |
| **15** | **Search & Filters** | Global Master Search | Products, Orders, Customers | Orders, Payments, Invoices |
| **16** | **Admin Users** | Full Provisioning & Deactivation | 🚫 Restricted (403) | 🚫 Restricted (403) |
| **17** | **Roles & Permissions**| Full RBAC Management | 🚫 Restricted (403) | 🚫 Restricted (403) |
| **18** | **Settings** | Full Config, Scripts & Maintenance | 🚫 Restricted (403) | 🚫 Restricted (403) |
| **19** | **Activity / Audit Logs**| Full Security IP & Login Logs | 🚫 Restricted (403) | 🚫 Restricted (403) |
| **20** | **Daily Operations** | Strategic Oversight & Reviews | Order Fulfillment & Cart Recovery SOP | Payment Verification & Invoicing SOP |

---

# FEATURE-BY-FEATURE OPERATIONAL BREAKDOWN (ALL 20 FEATURES)

---

### 1. Admin Login
- **Route:** `/login`
- **Purpose:** Used by authorized administrators to securely access the Paidhu Ethical Foods Admin Portal.

#### Role Actions:
- **SUPER_ADMIN:**
  - Login with master administrator credentials.
  - Reset or unlock passwords for any staff account.
  - Invalidate active JWT sessions across the organization.
- **ECOMMERCE_ADMIN:**
  - Login with assigned staff email and password.
  - Required to rotate initial temporary password upon first login (`mustChangePassword: true`).
  - Access authorized store operations and marketing modules.
- **ACCOUNTS_ADMIN:**
  - Login with assigned staff email and password.
  - Required to rotate initial temporary password upon first login.
  - Access authorized financial, payment, and inventory audit modules.

#### Step-by-Step Procedure:
1. Navigate to `https://admin.paidhuethicalfoods.com/login`.
2. Enter your registered email address and secure password.
3. Click **"Sign In"**.
4. If prompted with the **Change Password** screen, input a new private password (minimum 8 characters with numbers and symbols) and submit.
5. To end your shift, click the red **Logout** button at the bottom of the sidebar.

---

### 2. Dashboard
- **Route:** `/`
- **Purpose:** Provides an overall view of the activities and information managed through the Admin Portal.

#### Role Actions:
- **SUPER_ADMIN:**
  - Full visibility across gross revenue, net margin, order volumes, customer acquisition, and low-stock warnings.
  - Complete Recharts interactive revenue velocity charts.
- **ECOMMERCE_ADMIN:**
  - View total orders placed today and month-over-month sales trends.
  - Monitor low-stock indicators ($le 5$ units) to alert the kitchen for upcoming batch bakes.
  - View top-selling floral food products (Bloom Cookies, Petal Jams, Saffron).
- **ACCOUNTS_ADMIN:**
  - View gross revenue generated through Razorpay and Cash on Delivery.
  - Track payment capture rates and transaction failure rates.
  - Audit daily cashflow curves and order count reconciliation.

---

### 3. Products
- **Route:** `/products`, `/products/new`, `/products/edit/:id`
- **Purpose:** Used to manage the products displayed and sold through the Paidhu Ethical Foods website.

#### Role Actions:
- **SUPER_ADMIN:**
  - Unrestricted authority to create, edit, duplicate, price, and permanently delete products.
  - Manage all multi-size packaging variants (50g, 100g, 250g, 500g, 1kg).
- **ECOMMERCE_ADMIN:**
  - Add new products: Title, URL slug, category, short summary, and culinary description.
  - Upload high-resolution product photography directly to Supabase CDN bucket `products`.
  - Configure multi-size pack variants with individual prices, offer prices, stock units, and SKUs.
  - Assign merchandising badges: `bestseller`, `new_arrival`, `deal_of_the_day`, `family_combo`.
  - Toggle product active/inactive visibility on the live website.
- **ACCOUNTS_ADMIN:**
  - 🚫 **Restricted from creating, editing, or deleting products.**
  - Accesses the product table in **Stock Monitoring Mode** only to audit physical inventory against financial deductions.

#### Step-by-Step Procedure (Adding a Product):
1. Go to **Products** $ightarrow$ Click **"Add Product"**.
2. Fill in Product Title (e.g. "Kashmiri Pure Saffron").
3. Select Category (e.g. *Pure Saffron*).
4. Drag and drop product images into the upload container.
5. In the **Variants** section, click **"Add Variant"** and enter Size Label (e.g. "1g Box"), MRP Price, Offer Price, and Stock Units.
6. Click **"Save Product"**.

---

### 4. Categories
- **Route:** `/category-grid-management`
- **Purpose:** Used to organize products into appropriate product categories.

#### Role Actions:
- **SUPER_ADMIN:**
  - Full creation, editing, reordering, and deletion of categories.
  - Set custom theme color accents matching floral ingredients (rose pink, saffron gold, lavender purple).
- **ECOMMERCE_ADMIN:**
  - Update category titles, promotional subtitles, and category photography.
  - Assign promotional badges to homepage category tiles (*Bestseller*, *New Launch*, *Chef's Choice*).
  - Toggle category tile visibility on the homepage grid.
- **ACCOUNTS_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Categories module is hidden from the sidebar.

---

### 5. Orders
- **Route:** `/orders`, `/orders/:id`
- **Purpose:** Used to manage customer orders received through the website.

#### Role Actions:
- **SUPER_ADMIN:**
  - Master control across all status tabs: `ALL`, `PENDING`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
  - Override order status, edit courier tracking, and print GST Tax Invoices.
- **ECOMMERCE_ADMIN:**
  - View order line items, selected pack variants, and customer delivery address.
  - Advance fulfillment status: `Paid` $ightarrow$ `Processing` $ightarrow$ `Shipped`.
  - Enter Courier Partner name (e.g. Blue Dart, Delhivery) and AWB Tracking Number.
  - Print GST Tax Invoices and packing pick-lists.
  - 🚫 *Financial payment transactions are stripped and hidden.* Cannot mark unpaid orders as Paid.
- **ACCOUNTS_ADMIN:**
  - View order financial totals, line items, applied coupon discounts, and delivery fees.
  - Verify payment capture against Razorpay transaction records.
  - Update payment status from Unpaid to Paid for manual offline transfers.
  - Print official GST Tax Invoices for corporate accounting and tax reconciliation.
  - 🚫 *Cannot change delivery status to Shipped or edit courier tracking numbers.*

#### Step-by-Step Procedure (Processing an Order):
1. Navigate to **Orders** $ightarrow$ Click on the `PAID` tab.
2. Click on the order number to open the Order Details workspace.
3. Verify the purchased products and variants.
4. Click **"Print Tax Invoice"** for the shipping package.
5. In the status dropdown, change status from `Paid` to `Processing`.
6. Once packed and picked up by courier, enter the Courier Name and AWB Tracking Number and advance status to `Shipped`.

---

### 6. Customers
- **Route:** `/customers`, `/customers/:id`
- **Purpose:** Used to manage customer information associated with website orders.

#### Role Actions:
- **SUPER_ADMIN:**
  - Access complete customer directory, verified mobile numbers, email addresses, and saved delivery locations.
  - View lifetime customer spend (LTV) and order chronology.
- **ECOMMERCE_ADMIN:**
  - Search customer directory by name, email, or telephone number.
  - Use one-click **Call** or **WhatsApp** buttons to assist customers with delivery inquiries or address corrections.
  - View past orders to understand customer preferences.
- **ACCOUNTS_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Personal customer directory and address books are restricted for privacy compliance.

---

### 7. Inventory / Stock
- **Route:** `/products`
- **Purpose:** Used to maintain product availability and stock information.

#### Role Actions:
- **SUPER_ADMIN:**
  - Master stock oversight with ability to set stock thresholds and override counts.
- **ECOMMERCE_ADMIN:**
  - Update physical stock quantities following new bakery batches.
  - Monitor amber warning badges for items with low stock ($le 5$ units) and notify the kitchen.
  - Mark products as sold out to prevent overselling.
- **ACCOUNTS_ADMIN:**
  - Accesses dedicated **Stock Management** view.
  - Audits automated stock deductions against completed customer orders.
  - Performs physical vs. system stock reconciliations at month-end.

---

### 8. Payments
- **Route:** `/payments`, `/payments/:id`
- **Purpose:** Used to monitor, verify, and reconcile financial transactions from online payment gateways and cash-on-delivery orders.

#### Role Actions:
- **SUPER_ADMIN:**
  - Complete visibility over all Razorpay gateway transactions, captured amounts, transaction fees, and net settlements.
  - Authorize and execute full or partial customer refunds.
- **ECOMMERCE_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Payments module is completely hidden from the sidebar. Gateway transaction records and refund processing are blocked.
- **ACCOUNTS_ADMIN:**
  - Inspect transaction ledger: Razorpay Payment ID (`pay_xxx`), Order ID, Amount, and Payment Method (UPI, NetBanking, Card, COD).
  - Verify payment status: `SUCCESS`, `PENDING`, `FAILED`.
  - Process customer refunds with mandatory reason logging, automatically updating the order status to `CANCELLED`.
  - Reconcile gateway settlements with the corporate bank account.

---

### 9. Delivery / Shipping
- **Route:** `/delivery-charges`
- **Purpose:** Used to manage the delivery-related information associated with customer orders.

#### Role Actions:
- **SUPER_ADMIN:**
  - Configure **Standard Delivery Charge** (e.g. ₹60) and **Express Delivery Charge** (e.g. ₹120).
  - Configure **Free Delivery Threshold** (e.g. Free delivery on all orders above ₹999).
  - Set estimated delivery timelines (e.g. *"Delivery in 3–5 Business Days"*).
  - Define regional surcharges by state or pincode.
- **ECOMMERCE_ADMIN:**
  - View delivery information on customer orders and coordinate dispatch timelines.
  - 🚫 *Cannot alter shipping fees or free delivery thresholds.*
- **ACCOUNTS_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Delivery fee engine is restricted.

---

### 10. Offers / Discounts
- **Route:** `/coupons`, `/deals-management`
- **Purpose:** Used to manage promotional offers and discounts provided to customers.

#### Role Actions:
- **SUPER_ADMIN:**
  - Create, modify, and delete discount coupons (Percentage and Fixed Amount).
  - Set minimum cart value requirements, maximum discount caps, and start/expiry calendar dates.
  - Set per-customer usage limits or store-wide redemption caps.
  - Curate flash **Deals of the Day** on `/shop/deal-of-the-day` with live countdown timers.
- **ECOMMERCE_ADMIN:**
  - View active coupons to assist customers inquiring on WhatsApp.
  - Provide approved promotional codes to recover abandoned carts.
  - 🚫 *Cannot create or edit coupon rules or discount percentages.*
- **ACCOUNTS_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Offers module is restricted.

---

### 11. Website Content
- **Route:** `/banners`, `/floral-habitat-management`, `/byoc-management`, `/community-management`, `/blogs`, `/pages`
- **Purpose:** Used to manage content displayed on the Paidhu Ethical Foods website.

#### Role Actions:
- **SUPER_ADMIN:**
  - Master authority across all CMS modules, static legal pages, banners, and video reels.
- **ECOMMERCE_ADMIN:**
  - **Banners (`/banners`):** Upload desktop banners (**exact 1920 x 427 px**) and mobile responsive banners; assign to `home`, `shop-all`, or category pages.
  - **Floral Food Habitat (`/floral-habitat-management`):** Manage video reels from Supabase Storage and configure starter packs.
  - **BYOC Bundles (`/byoc-management`):** Configure bundle pricing tiers (₹799/3, ₹1049/4, ₹1399/5) and select eligible products.
  - **Mom's Community (`/community-management`):** Upload family tasting moments, event photos, and update the official WhatsApp group link.
  - **Blogs (`/blogs`):** Author and publish botanical food recipes, wellness guides, and health articles.
- **ACCOUNTS_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** All website content CMS modules are hidden and restricted.

---

### 12. Reviews & Ratings
- **Route:** `/reviews`
- **Purpose:** Used to manage customer feedback and product reviews.

#### Role Actions:
- **SUPER_ADMIN:**
  - Approve customer reviews, reject feedback, or permanently delete spam.
- **ECOMMERCE_ADMIN:**
  - Inspect customer 1–5 star ratings and written reviews.
  - Click **Approve** to publish verified positive feedback onto the live product pages.
  - Flag or delete inappropriate, abusive, or competitor spam reviews.
- **ACCOUNTS_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Reviews module is restricted.

---

### 13. Notifications
- **Route:** Top Header Notification Dropdown
- **Purpose:** Provides important alerts and updates related to portal activities.

#### Role Actions:
- **SUPER_ADMIN:**
  - Receives all system alerts: new orders, captured payments, gateway declines, stock warnings, and consultation leads.
- **ECOMMERCE_ADMIN:**
  - Receives alerts for: Newly placed orders, low inventory items ($le 5$ units), Saffron Guidance pregnancy inquiries, and corporate bulk order leads.
- **ACCOUNTS_ADMIN:**
  - Receives alerts for: Successful Razorpay captures, payment failures, refund requests, and zero-stock inventory events.

---

### 14. Reports
- **Route:** Dashboard & Specialty Lead Screens
- **Purpose:** Used to review business and operational information generated through the portal.

#### Role Actions:
- **SUPER_ADMIN:**
  - Full business intelligence: Gross sales, net revenue, order volume trajectories, customer lifetime value, and lead conversion rates.
- **ECOMMERCE_ADMIN:**
  - **Active Carts Telemetry (`/active-carts`):** Real-time report of dropped carts with direct WhatsApp recovery button.
  - **Wishlist Demand Insights (`/wishlists`):** Report of products most wishlisted by customers to guide production.
  - **Lead Pipeline Reports:** Saffron Guidance pregnancy leads (`/saffron-guidance-leads`), B2B bulk inquiries (`/bulk-order-inquiries`), and Career applications (`/career-applications`).
- **ACCOUNTS_ADMIN:**
  - Financial sales reports, Razorpay fee deduction summaries, refund reports, and tax reconciliation ledgers.

---

### 15. Search & Filters
- **Purpose:** Used to quickly locate specific information within the Admin Portal.

#### Role Actions:
- **SUPER_ADMIN:**
  - Global master search across products, orders, customers, transactions, and staff accounts.
- **ECOMMERCE_ADMIN:**
  - Search products by title, SKU, or category.
  - Search orders by order ID, customer name, or phone number.
  - Search customers by mobile number or email.
- **ACCOUNTS_ADMIN:**
  - Search orders by monetary amount, date range, and payment status.
  - Search payments by Razorpay Payment ID (`pay_xxx`) or gateway status.

---

### 16. Admin Users
- **Route:** `/settings`
- **Purpose:** Used to manage users who have access to the Admin Portal.

#### Role Actions:
- **SUPER_ADMIN:**
  - View complete list of administrative accounts.
  - Create new staff credentials and set initial temporary passwords.
  - Update staff details or instantly deactivate access for departing personnel.
- **ECOMMERCE_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Cannot view or manage admin accounts.
- **ACCOUNTS_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Cannot view or manage admin accounts.

---

### 17. Roles & Permissions
- **Purpose:** Used to control what different admin users can access and manage.

#### Role Actions:
- **SUPER_ADMIN:**
  - Assign operational roles: `SUPER_ADMIN`, `ECOMMERCE_ADMIN`, or `ACCOUNTS_ADMIN`.
  - Enforce module-level and field-level operational boundaries.
- **ECOMMERCE_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Cannot modify roles or permissions.
- **ACCOUNTS_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Cannot modify roles or permissions.

---

### 18. Settings
- **Route:** `/settings`, `/tracking`
- **Purpose:** Contains the configuration options used to manage the portal and website.

#### Role Actions:
- **SUPER_ADMIN:**
  - Edit store contact information: official support phone, WhatsApp link, and support email (`info@paidhu.com`).
  - Edit the top scrolling announcement marquee ticker.
  - **Toggle Maintenance Mode:** Enable Under Maintenance page with direct WhatsApp order bridge; test full store anytime with `?preview=true`.
  - **Tracking Codes Management (`/tracking`):** Inject GA4, GTM, Meta Pixel, and Google Ads scripts into `HEAD`, `BODY_START`, or `BODY_END`.
- **ECOMMERCE_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Settings and Tracking Codes modules are hidden and blocked.
- **ACCOUNTS_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Settings and Tracking Codes modules are hidden and blocked.

---

### 19. Activity / Audit Logs
- **Route:** `/login-history`
- **Purpose:** Used to track administrative activities performed within the portal.

#### Role Actions:
- **SUPER_ADMIN:**
  - View master security audit log: staff email, client IP address, device User-Agent, timestamp, and login status (`SUCCESS` or `FAILED`).
  - Review order timeline status changes to ensure accountability.
- **ECOMMERCE_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Security login history is hidden.
- **ACCOUNTS_ADMIN:**
  - 🚫 **Restricted (403 Forbidden).** Security login history is hidden.

---

### 20. Admin Daily Operations
- **Purpose:** Defines the regular standard operating procedure (SOP) that each admin performs daily.

#### SUPER_ADMIN Daily Routine:
1. Review overall business health and gross revenue on the Dashboard.
2. Review audit logs (`/login-history`) for unauthorized login attempts.
3. Review promotional performance and approve new marketing banners or flash deals.
4. Verify system health, tracking scripts, and store settings.

#### ECOMMERCE_ADMIN Daily Routine:
1. **Morning (09:00 AM):** Open `/orders` $ightarrow$ Filter by `PAID` $ightarrow$ Verify line items $ightarrow$ Print pick-lists $ightarrow$ Advance status to `Processing`.
2. **Morning (10:00 AM):** Open `/saffron-guidance-leads` $ightarrow$ Review gestational month and doctor clearance $ightarrow$ Call/WhatsApp mother to provide authentic dosage guidance $ightarrow$ Update status to `Contacted`.
3. **Midday (01:30 PM):** Open `/active-carts` $ightarrow$ Review high-intent dropped carts $ightarrow$ Click **"Chat on WhatsApp"** to send personalized recovery offers.
4. **Midday (02:30 PM):** Open `/reviews` $ightarrow$ Approve verified positive customer reviews.
5. **Evening (05:00 PM):** Open `/orders` $ightarrow$ Enter courier partner name and AWB tracking numbers $ightarrow$ Advance status to `Shipped`.
6. **Evening (06:00 PM):** Open `/products` $ightarrow$ Check inventory levels; alert kitchen team for any item with stock $le 5$ units.

#### ACCOUNTS_ADMIN Daily Routine:
1. **Morning (09:00 AM):** Open `/payments` $ightarrow$ Reconcile online Razorpay captures and confirmed COD orders against the bank account.
2. **Morning (10:30 AM):** Open `/orders` $ightarrow$ Click **"Print Tax Invoice"** for all packed orders to include official GST invoices in delivery parcels.
3. **Midday (02:00 PM):** Open `/payments` $ightarrow$ Review refund requests $ightarrow$ Process approved refunds with mandatory reason notes.
4. **Evening (05:30 PM):** Open `/products` (Stock Management view) $ightarrow$ Audit daily stock deductions against dispatched orders to reconcile physical inventory.
5. **Evening (06:30 PM):** Generate daily sales and transaction summary report for management.

---
*Authorized Standard Operating Procedure (SOP) for Paidhu Ethical Foods Operations Team.*
