# PAIDHU ETHICAL FOODS — ADMIN PORTAL
## COMPLETE MULTI-ROLE OPERATIONS & ROLE-BASED ACTIONS MANUAL (ALL 20 FEATURES)

**Website:** [https://admin.paidhuethicalfoods.com/](https://admin.paidhuethicalfoods.com/) *(Local Development: `http://localhost:5174`)*  
**Document Type:** Master Standard Operating Procedure (SOP) & Admin Role Manual  
**Version:** 2.5  
**Prepared For:** Paidhu Ethical Foods Management & Operations Staff  
**Roles Covered:** `SUPER_ADMIN`, `ECOMMERCE_ADMIN`, `ACCOUNTS_ADMIN`  

---

## 1. COLUMN-WISE ROLE-BASED ACTIONS MATRIX (ALL 20 FEATURES)

| # | Feature & Purpose | SUPER_ADMIN Actions | ECOMMERCE_ADMIN Actions | ACCOUNTS_ADMIN Actions |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Admin Login**<br>*(Route: `/login`)*<br><br>_Purpose:_ Used by authorized administrators to securely access the Paidhu Ethical Foods Admin Portal. | Master authentication credentials; reset or unlock passwords for any staff account; invalidate active JWT sessions; manage portal security timeouts. | Staff login using assigned email/password; forced password rotation upon initial sign-in (/change-password); access authorized store operations, catalog, orders, and content. | Staff login using assigned email/password; forced password rotation upon initial sign-in (/change-password); access authorized financial ledgers, orders, payments, invoices, and stock audit. |
| **2** | **Dashboard**<br>*(Route: `/`)*<br><br>_Purpose:_ Provides an overall view of the activities and information managed through the Admin Portal. | Full executive visibility: Gross Revenue (₹), Total Placed Orders, Active Catalog Items, Low-Stock Warnings (<= 5 units), Registered Customers, and interactive Recharts sales velocity graphs. | Operational telemetry: Orders Placed Today, Month-over-Month order curves, Low-Stock Badges (<= 5 units) to alert kitchen for baking, Top-selling floral items, and dropped cart telemetry. | Financial KPIs: Gross Transaction Volume (Razorpay + COD), Payment Gateway Success vs Failure Rates, Daily Cashflow Curves, and Pending Invoicing backlog counter. |
| **3** | **Products**<br>*(Route: `/products`)*<br><br>_Purpose:_ Used to manage the products displayed and sold through the Paidhu Ethical Foods website. | Unrestricted catalog control: Add, edit, duplicate, price, discount, or delete products; manage all multi-size packaging variants (50g, 100g, 250g, 500g, 1kg), SKUs, and upload media to Supabase CDN. | Add & edit products (/products/new, /products/edit/:id); update descriptions, botanical ingredients, tags; upload CDN photos; configure size variants & prices; assign badges (bestseller, new_arrival); toggle Active/Inactive. | Stock Audit View ONLY (/products labeled as Stock Management): View product catalog, SKU codes, unit selling prices, and monitor physical inventory counts. (Add/Edit/Delete blocked 403). |
| **4** | **Categories**<br>*(Route: `/category-grid-management`)*<br><br>_Purpose:_ Used to organize products into appropriate product categories. | Full taxonomy control: Create, edit, reorder, delete categories; configure floral background accent tints (Rose pink, Saffron gold, Lavender purple); manage category tiles and badges. | Manage active categories (Bloom Cookies, Petal Jams, Pure Saffron, Floral Teas, Brew Flora, Super Value Packs); edit marketing slogans; assign promotional badges (Bestseller, New Launch). | Restricted (403): Completely blocked from category management. Navigation link hidden in sidebar. |
| **5** | **Orders**<br>*(Route: `/orders`)*<br><br>_Purpose:_ Used to manage customer orders received through the website. | Master order authority: View all orders across all status tabs (ALL, PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED); manual status overrides; invoice printing; refund & cancellation processing. | Fulfillment & Shipping: View active orders; inspect customer shipping address & phone (direct WhatsApp / Call button); advance status (Paid -> Processing -> Shipped); enter courier name (Blue Dart, Delhivery) and AWB tracking number; print packing slips. (Payment details redacted). | Payments & Invoicing: View all orders to verify financial settlement; inspect itemized totals, applied coupon discounts, and delivery fees; verify Razorpay payment ID (pay_xxx) & method; generate & Print Official Paidhu GST Tax Invoices. (Shipping courier editing blocked 403). |
| **6** | **Customers**<br>*(Route: `/customers`)*<br><br>_Purpose:_ Used to manage customer information associated with website orders. | Master customer directory (/customers, /customers/:id): Full customer profiles, verified mobile numbers, emails, saved delivery address book, and lifetime purchase value (LTV). | Customer support access: Search customer directory; view contact telephone with direct WhatsApp bridge to assist with order inquiries, address corrections, and repeat orders; review purchase history. | Restricted (403): Completely blocked from personal customer directory and address books to ensure data privacy (DPDP Act compliance). Customer data is accessed strictly via order tax invoices. |
| **7** | **Inventory / Stock**<br>*(Route: `/products`)*<br><br>_Purpose:_ Used to maintain product availability and stock information. | Global stock oversight: View and update physical inventory counts across all products and individual packaging variants; configure low-stock threshold triggers (default <= 5 units); manual stock adjustments. | Real-time stock management: Monitor product stock across 50g, 100g, 250g, 500g, 1kg variants; update stock quantities upon kitchen batch completion; identify low-stock (Amber badge) and out-of-stock items. | Stock Audit & Reconciliation: Audit unit stock against gross sales records; verify automatic stock deduction upon order payment; reconcile physical warehouse inventory against financial balance sheets. |
| **8** | **Payments**<br>*(Route: `/payments`)*<br><br>_Purpose:_ Used to monitor, verify, and reconcile financial transactions from online payment gateways and cash-on-delivery orders. | Complete payment administration: Master transaction ledger; inspect Razorpay Payment IDs, Order IDs, captured amounts, gateway fees, and statuses; execute full or partial refunds directly with audit tracking. | Restricted (403): Completely blocked from /payments and /payments/:id. Menu item hidden. On orders page, financial payment rows are stripped (order.payments = []). Cannot issue refunds or mark orders paid. | Full Financial Ledger: Access all payment transactions; verify captured UPI, NetBanking, Card, and COD receipts; process customer refunds with justification remarks; reconcile Razorpay settlements with bank accounts. |
| **9** | **Delivery / Shipping**<br>*(Route: `/delivery-charges`)*<br><br>_Purpose:_ Used to manage the delivery-related information associated with customer orders. | Full shipping fee engine (/delivery-charges): Set Standard Delivery charge, Express Delivery charge, and Free Delivery threshold (e.g. Free shipping above ₹999); configure customer-facing delivery promises. | Logistics tracking: View customer delivery address and courier tracking requirements on orders; convey shipping tracking status to customers on WhatsApp. (Cannot alter shipping fees or free delivery rules). | Restricted (403): Blocked from /delivery-charges. Delivery fees are audited strictly as an itemized line item on the customer tax invoice. |
| **10** | **Offers / Discounts**<br>*(Route: `/coupons`)*<br><br>_Purpose:_ Used to manage promotional offers and discounts provided to customers. | Full discount engine (/coupons): Create coupon codes (e.g. PAIDHU10, FESTIVE200); set percentage or fixed discounts; set minimum cart values, usage caps, per-customer limits, expiry dates; curate Deals of the Day (/deals-management). | Promotional support: View active coupons and parameters to assist customers; issue pre-approved coupon codes to recover abandoned carts on WhatsApp; manage products featured in Flash Deals of the Day. | Restricted (403): Blocked from creating or altering discount codes. Audits applied discounts as promotional deductions on sales invoices. |
| **11** | **Website Content**<br>*(Route: `/banners`)*<br><br>_Purpose:_ Used to manage content displayed on the Paidhu Ethical Foods website. | Master CMS control: Desktop & mobile banners (/banners), Floral Habitat video reels (/floral-habitat-management), BYOC bundles (/byoc-management), Mom's Community (/community-management), Philosophy & About Us. | Daily CMS management: Upload 1920x427 desktop banners & mobile responsive banners; configure BYOC cart bundle tiers (₹799/3, ₹1049/4, ₹1399/5); upload Floral Habitat reels; publish blog recipes (/blogs); update Mom's Community photos. | Restricted (403): Completely blocked from all CMS and website content editing modules. All content routes hidden from sidebar. |
| **12** | **Reviews & Ratings**<br>*(Route: `/reviews`)*<br><br>_Purpose:_ Used to manage customer feedback and product reviews. | Master review moderation (/reviews): View all customer 1–5 star reviews, approve high-praise testimonials for live storefront display, reject or permanently delete spam / inappropriate entries. | Review moderation: Daily screening of new customer ratings and product feedback; approve authentic customer reviews to display social proof on product pages; report quality complaints to bakery staff. | Restricted (403): Blocked from customer reviews module. |
| **13** | **Notifications**<br>*(Route: `/`)*<br><br>_Purpose:_ Provides important alerts and updates related to portal activities. | Global notification center: Live alerts for new orders, successful payments, payment failures, low stock warnings, out-of-stock notices, consultation inquiries, and security events. | Operational alerts: Instant badge notifications for new orders needing fulfillment, low-stock warnings (<= 5 units), new WhatsApp tiffin leads, and pregnancy guidance inquiries. | Financial alerts: Notifications for new captured payments, payment gateway webhook syncs, zero-stock warnings, and pending refund requests. |
| **14** | **Reports**<br>*(Route: `/active-carts`)*<br><br>_Purpose:_ Used to review business and operational information generated through the portal. | Master Business Intelligence: Comprehensive sales revenue reports, gross margins, abandoned cart recovery rates, customer wishlist demand heatmaps (/wishlists), and lead conversion rates. | Operational & Merchandising Reports: Abandoned Cart telemetry (/active-carts) with one-click WhatsApp recovery buttons; Wishlist Insights (/wishlists); Saffron Pregnancy Leads reports; B2B Bulk Inquiries reports. | Financial Reports: Gross Sales & Revenue Reconciliation (Daily, Monthly); Gateway Settlement vs Bank Transfer Reports; Tax Reports (Output GST, CGST, SGST, IGST collected); Stock Valuation & Asset Balance Reports. |
| **15** | **Search & Filters**<br>*(Route: `/products`)*<br><br>_Purpose:_ Used to quickly locate specific information within the Admin Portal. | Global master search: Search across all modules by customer, order number, amount, date, SKU, transaction ID (pay_xxx), and fulfillment status. | Catalog & Order search: Filter products by category, price, SKU, or stock status; search orders by customer phone or name; filter by fulfillment status (Paid, Processing, Shipped); filter leads by inquiry type. | Financial search: Search payments by Razorpay ID, order number, or date; filter orders by payment status (PAID vs PENDING), invoice date, and payment gateway method; search stock by SKU. |
| **16** | **Admin Users**<br>*(Route: `/profile`)*<br><br>_Purpose:_ Used to manage users who have access to the Admin Portal. | Exclusive administrative user management: Provision new staff accounts with assigned emails, temporary passwords, and roles; toggle mustChangePassword flag; deactivate or delete staff accounts. | Restricted (403): Cannot view other admin accounts or create users. Can only view/edit their own profile and update their own password. | Restricted (403): Cannot view other admin accounts or create users. Can only view/edit their own profile and update their own password. |
| **17** | **Roles & Permissions**<br>*(Route: `/profile`)*<br><br>_Purpose:_ Used to control what different admin users can access and manage. | Full RBAC configuration: Assign administrative roles (SUPER_ADMIN, ECOMMERCE_ADMIN, ACCOUNTS_ADMIN); control module authorizations; enforce organizational boundaries. | Restricted (403): Operates strictly within assigned ECOMMERCE_ADMIN role permissions. Cannot modify permissions or roles. | Restricted (403): Operates strictly within assigned ACCOUNTS_ADMIN role permissions. Cannot modify permissions or roles. |
| **18** | **Settings**<br>*(Route: `/settings`)*<br><br>_Purpose:_ Contains the configuration options used to manage the portal and website. | Master store configuration (/settings, /tracking): Support contact info (info@paidhu.com, phone, WhatsApp); announcement bar marquee; Maintenance Mode toggle switch; tracking scripts (GA4, GTM, Meta Pixel). | Restricted (403): Cannot alter store contact settings, toggle Maintenance Mode, or inject third-party tracking scripts. | Restricted (403): Cannot alter store settings or system configurations. |
| **19** | **Activity / Audit Logs**<br>*(Route: `/login-history`)*<br><br>_Purpose:_ Used to track administrative activities performed within the portal. | Master security audit trail (/login-history): Comprehensive login audit logs with staff email, client IP address, browser User-Agent, exact timestamp, and authentication status (SUCCESS or FAILED); order audit history. | Operational audit: Can view chronological status transition history on individual order cards (Paid -> Processing -> Shipped). (Blocked from login history and IP security logs 403). | Financial audit: Can view payment timestamp logs and refund transaction records. (Blocked from login history and IP security logs 403). |
| **20** | **Admin Daily Operations**<br>*(Route: `/`)*<br><br>_Purpose:_ Defines the regular activities that the admin should perform to maintain smooth e-commerce operations. | Master Operational Oversight: Morning executive dashboard review (sales, orders, stock); Midday campaign & lead review; Evening financial settlement, staff login security audit, and system health check. | Fulfillment & Merchandising SOP: Morning (09:00 AM) review PAID orders, print pick-lists, notify kitchen of low stock (<=5), advance to Processing; Midday (01:00 PM) recover dropped carts on WhatsApp (/active-carts), reply to Saffron & bulk leads, moderate reviews; Evening (05:00 PM) enter courier AWBs, mark Shipped, check bakery stock. | Financial & Invoicing SOP: Morning (09:30 AM) verify incoming Razorpay payments against bank settlement reports; Midday (02:00 PM) generate & print Paidhu GST Tax Invoices, process approved customer refunds; Evening (05:30 PM) audit stock deductions at /products, generate daily revenue closing summary. |

---

## 2. FEATURE-BY-FEATURE OPERATIONAL BREAKDOWN (ALL 20 FEATURES)

### 1. Admin Login
- **Route / Navigation:** `/login`
- **Purpose:** Used by authorized administrators to securely access the Paidhu Ethical Foods Admin Portal.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Master authentication credentials; reset or unlock passwords for any staff account; invalidate active JWT sessions; manage portal security timeouts.
- **ECOMMERCE_ADMIN:**
  - Staff login using assigned email/password; forced password rotation upon initial sign-in (/change-password); access authorized store operations, catalog, orders, and content.
- **ACCOUNTS_ADMIN:**
  - Staff login using assigned email/password; forced password rotation upon initial sign-in (/change-password); access authorized financial ledgers, orders, payments, invoices, and stock audit.

#### Standard Operating Procedure (SOP):
1. Navigate to `/login` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 2. Dashboard
- **Route / Navigation:** `/`
- **Purpose:** Provides an overall view of the activities and information managed through the Admin Portal.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Full executive visibility: Gross Revenue (₹), Total Placed Orders, Active Catalog Items, Low-Stock Warnings (<= 5 units), Registered Customers, and interactive Recharts sales velocity graphs.
- **ECOMMERCE_ADMIN:**
  - Operational telemetry: Orders Placed Today, Month-over-Month order curves, Low-Stock Badges (<= 5 units) to alert kitchen for baking, Top-selling floral items, and dropped cart telemetry.
- **ACCOUNTS_ADMIN:**
  - Financial KPIs: Gross Transaction Volume (Razorpay + COD), Payment Gateway Success vs Failure Rates, Daily Cashflow Curves, and Pending Invoicing backlog counter.

#### Standard Operating Procedure (SOP):
1. Navigate to `/` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 3. Products
- **Route / Navigation:** `/products`
- **Purpose:** Used to manage the products displayed and sold through the Paidhu Ethical Foods website.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Unrestricted catalog control: Add, edit, duplicate, price, discount, or delete products; manage all multi-size packaging variants (50g, 100g, 250g, 500g, 1kg), SKUs, and upload media to Supabase CDN.
- **ECOMMERCE_ADMIN:**
  - Add & edit products (/products/new, /products/edit/:id); update descriptions, botanical ingredients, tags; upload CDN photos; configure size variants & prices; assign badges (bestseller, new_arrival); toggle Active/Inactive.
- **ACCOUNTS_ADMIN:**
  - Stock Audit View ONLY (/products labeled as Stock Management): View product catalog, SKU codes, unit selling prices, and monitor physical inventory counts. (Add/Edit/Delete blocked 403).

#### Standard Operating Procedure (SOP):
1. Navigate to `/products` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 4. Categories
- **Route / Navigation:** `/category-grid-management`
- **Purpose:** Used to organize products into appropriate product categories.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Full taxonomy control: Create, edit, reorder, delete categories; configure floral background accent tints (Rose pink, Saffron gold, Lavender purple); manage category tiles and badges.
- **ECOMMERCE_ADMIN:**
  - Manage active categories (Bloom Cookies, Petal Jams, Pure Saffron, Floral Teas, Brew Flora, Super Value Packs); edit marketing slogans; assign promotional badges (Bestseller, New Launch).
- **ACCOUNTS_ADMIN:**
  - Restricted (403): Completely blocked from category management. Navigation link hidden in sidebar.

#### Standard Operating Procedure (SOP):
1. Navigate to `/category-grid-management` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 5. Orders
- **Route / Navigation:** `/orders`
- **Purpose:** Used to manage customer orders received through the website.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Master order authority: View all orders across all status tabs (ALL, PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED); manual status overrides; invoice printing; refund & cancellation processing.
- **ECOMMERCE_ADMIN:**
  - Fulfillment & Shipping: View active orders; inspect customer shipping address & phone (direct WhatsApp / Call button); advance status (Paid -> Processing -> Shipped); enter courier name (Blue Dart, Delhivery) and AWB tracking number; print packing slips. (Payment details redacted).
- **ACCOUNTS_ADMIN:**
  - Payments & Invoicing: View all orders to verify financial settlement; inspect itemized totals, applied coupon discounts, and delivery fees; verify Razorpay payment ID (pay_xxx) & method; generate & Print Official Paidhu GST Tax Invoices. (Shipping courier editing blocked 403).

#### Standard Operating Procedure (SOP):
1. Navigate to `/orders` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 6. Customers
- **Route / Navigation:** `/customers`
- **Purpose:** Used to manage customer information associated with website orders.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Master customer directory (/customers, /customers/:id): Full customer profiles, verified mobile numbers, emails, saved delivery address book, and lifetime purchase value (LTV).
- **ECOMMERCE_ADMIN:**
  - Customer support access: Search customer directory; view contact telephone with direct WhatsApp bridge to assist with order inquiries, address corrections, and repeat orders; review purchase history.
- **ACCOUNTS_ADMIN:**
  - Restricted (403): Completely blocked from personal customer directory and address books to ensure data privacy (DPDP Act compliance). Customer data is accessed strictly via order tax invoices.

#### Standard Operating Procedure (SOP):
1. Navigate to `/customers` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 7. Inventory / Stock
- **Route / Navigation:** `/products`
- **Purpose:** Used to maintain product availability and stock information.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Global stock oversight: View and update physical inventory counts across all products and individual packaging variants; configure low-stock threshold triggers (default <= 5 units); manual stock adjustments.
- **ECOMMERCE_ADMIN:**
  - Real-time stock management: Monitor product stock across 50g, 100g, 250g, 500g, 1kg variants; update stock quantities upon kitchen batch completion; identify low-stock (Amber badge) and out-of-stock items.
- **ACCOUNTS_ADMIN:**
  - Stock Audit & Reconciliation: Audit unit stock against gross sales records; verify automatic stock deduction upon order payment; reconcile physical warehouse inventory against financial balance sheets.

#### Standard Operating Procedure (SOP):
1. Navigate to `/products` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 8. Payments
- **Route / Navigation:** `/payments`
- **Purpose:** Used to monitor, verify, and reconcile financial transactions from online payment gateways and cash-on-delivery orders.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Complete payment administration: Master transaction ledger; inspect Razorpay Payment IDs, Order IDs, captured amounts, gateway fees, and statuses; execute full or partial refunds directly with audit tracking.
- **ECOMMERCE_ADMIN:**
  - Restricted (403): Completely blocked from /payments and /payments/:id. Menu item hidden. On orders page, financial payment rows are stripped (order.payments = []). Cannot issue refunds or mark orders paid.
- **ACCOUNTS_ADMIN:**
  - Full Financial Ledger: Access all payment transactions; verify captured UPI, NetBanking, Card, and COD receipts; process customer refunds with justification remarks; reconcile Razorpay settlements with bank accounts.

#### Standard Operating Procedure (SOP):
1. Navigate to `/payments` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 9. Delivery / Shipping
- **Route / Navigation:** `/delivery-charges`
- **Purpose:** Used to manage the delivery-related information associated with customer orders.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Full shipping fee engine (/delivery-charges): Set Standard Delivery charge, Express Delivery charge, and Free Delivery threshold (e.g. Free shipping above ₹999); configure customer-facing delivery promises.
- **ECOMMERCE_ADMIN:**
  - Logistics tracking: View customer delivery address and courier tracking requirements on orders; convey shipping tracking status to customers on WhatsApp. (Cannot alter shipping fees or free delivery rules).
- **ACCOUNTS_ADMIN:**
  - Restricted (403): Blocked from /delivery-charges. Delivery fees are audited strictly as an itemized line item on the customer tax invoice.

#### Standard Operating Procedure (SOP):
1. Navigate to `/delivery-charges` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 10. Offers / Discounts
- **Route / Navigation:** `/coupons`
- **Purpose:** Used to manage promotional offers and discounts provided to customers.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Full discount engine (/coupons): Create coupon codes (e.g. PAIDHU10, FESTIVE200); set percentage or fixed discounts; set minimum cart values, usage caps, per-customer limits, expiry dates; curate Deals of the Day (/deals-management).
- **ECOMMERCE_ADMIN:**
  - Promotional support: View active coupons and parameters to assist customers; issue pre-approved coupon codes to recover abandoned carts on WhatsApp; manage products featured in Flash Deals of the Day.
- **ACCOUNTS_ADMIN:**
  - Restricted (403): Blocked from creating or altering discount codes. Audits applied discounts as promotional deductions on sales invoices.

#### Standard Operating Procedure (SOP):
1. Navigate to `/coupons` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 11. Website Content
- **Route / Navigation:** `/banners`
- **Purpose:** Used to manage content displayed on the Paidhu Ethical Foods website.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Master CMS control: Desktop & mobile banners (/banners), Floral Habitat video reels (/floral-habitat-management), BYOC bundles (/byoc-management), Mom's Community (/community-management), Philosophy & About Us.
- **ECOMMERCE_ADMIN:**
  - Daily CMS management: Upload 1920x427 desktop banners & mobile responsive banners; configure BYOC cart bundle tiers (₹799/3, ₹1049/4, ₹1399/5); upload Floral Habitat reels; publish blog recipes (/blogs); update Mom's Community photos.
- **ACCOUNTS_ADMIN:**
  - Restricted (403): Completely blocked from all CMS and website content editing modules. All content routes hidden from sidebar.

#### Standard Operating Procedure (SOP):
1. Navigate to `/banners` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 12. Reviews & Ratings
- **Route / Navigation:** `/reviews`
- **Purpose:** Used to manage customer feedback and product reviews.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Master review moderation (/reviews): View all customer 1–5 star reviews, approve high-praise testimonials for live storefront display, reject or permanently delete spam / inappropriate entries.
- **ECOMMERCE_ADMIN:**
  - Review moderation: Daily screening of new customer ratings and product feedback; approve authentic customer reviews to display social proof on product pages; report quality complaints to bakery staff.
- **ACCOUNTS_ADMIN:**
  - Restricted (403): Blocked from customer reviews module.

#### Standard Operating Procedure (SOP):
1. Navigate to `/reviews` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 13. Notifications
- **Route / Navigation:** `/`
- **Purpose:** Provides important alerts and updates related to portal activities.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Global notification center: Live alerts for new orders, successful payments, payment failures, low stock warnings, out-of-stock notices, consultation inquiries, and security events.
- **ECOMMERCE_ADMIN:**
  - Operational alerts: Instant badge notifications for new orders needing fulfillment, low-stock warnings (<= 5 units), new WhatsApp tiffin leads, and pregnancy guidance inquiries.
- **ACCOUNTS_ADMIN:**
  - Financial alerts: Notifications for new captured payments, payment gateway webhook syncs, zero-stock warnings, and pending refund requests.

#### Standard Operating Procedure (SOP):
1. Navigate to `/` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 14. Reports
- **Route / Navigation:** `/active-carts`
- **Purpose:** Used to review business and operational information generated through the portal.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Master Business Intelligence: Comprehensive sales revenue reports, gross margins, abandoned cart recovery rates, customer wishlist demand heatmaps (/wishlists), and lead conversion rates.
- **ECOMMERCE_ADMIN:**
  - Operational & Merchandising Reports: Abandoned Cart telemetry (/active-carts) with one-click WhatsApp recovery buttons; Wishlist Insights (/wishlists); Saffron Pregnancy Leads reports; B2B Bulk Inquiries reports.
- **ACCOUNTS_ADMIN:**
  - Financial Reports: Gross Sales & Revenue Reconciliation (Daily, Monthly); Gateway Settlement vs Bank Transfer Reports; Tax Reports (Output GST, CGST, SGST, IGST collected); Stock Valuation & Asset Balance Reports.

#### Standard Operating Procedure (SOP):
1. Navigate to `/active-carts` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 15. Search & Filters
- **Route / Navigation:** `/products`
- **Purpose:** Used to quickly locate specific information within the Admin Portal.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Global master search: Search across all modules by customer, order number, amount, date, SKU, transaction ID (pay_xxx), and fulfillment status.
- **ECOMMERCE_ADMIN:**
  - Catalog & Order search: Filter products by category, price, SKU, or stock status; search orders by customer phone or name; filter by fulfillment status (Paid, Processing, Shipped); filter leads by inquiry type.
- **ACCOUNTS_ADMIN:**
  - Financial search: Search payments by Razorpay ID, order number, or date; filter orders by payment status (PAID vs PENDING), invoice date, and payment gateway method; search stock by SKU.

#### Standard Operating Procedure (SOP):
1. Navigate to `/products` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 16. Admin Users
- **Route / Navigation:** `/profile`
- **Purpose:** Used to manage users who have access to the Admin Portal.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Exclusive administrative user management: Provision new staff accounts with assigned emails, temporary passwords, and roles; toggle mustChangePassword flag; deactivate or delete staff accounts.
- **ECOMMERCE_ADMIN:**
  - Restricted (403): Cannot view other admin accounts or create users. Can only view/edit their own profile and update their own password.
- **ACCOUNTS_ADMIN:**
  - Restricted (403): Cannot view other admin accounts or create users. Can only view/edit their own profile and update their own password.

#### Standard Operating Procedure (SOP):
1. Navigate to `/profile` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 17. Roles & Permissions
- **Route / Navigation:** `/profile`
- **Purpose:** Used to control what different admin users can access and manage.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Full RBAC configuration: Assign administrative roles (SUPER_ADMIN, ECOMMERCE_ADMIN, ACCOUNTS_ADMIN); control module authorizations; enforce organizational boundaries.
- **ECOMMERCE_ADMIN:**
  - Restricted (403): Operates strictly within assigned ECOMMERCE_ADMIN role permissions. Cannot modify permissions or roles.
- **ACCOUNTS_ADMIN:**
  - Restricted (403): Operates strictly within assigned ACCOUNTS_ADMIN role permissions. Cannot modify permissions or roles.

#### Standard Operating Procedure (SOP):
1. Navigate to `/profile` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 18. Settings
- **Route / Navigation:** `/settings`
- **Purpose:** Contains the configuration options used to manage the portal and website.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Master store configuration (/settings, /tracking): Support contact info (info@paidhu.com, phone, WhatsApp); announcement bar marquee; Maintenance Mode toggle switch; tracking scripts (GA4, GTM, Meta Pixel).
- **ECOMMERCE_ADMIN:**
  - Restricted (403): Cannot alter store contact settings, toggle Maintenance Mode, or inject third-party tracking scripts.
- **ACCOUNTS_ADMIN:**
  - Restricted (403): Cannot alter store settings or system configurations.

#### Standard Operating Procedure (SOP):
1. Navigate to `/settings` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 19. Activity / Audit Logs
- **Route / Navigation:** `/login-history`
- **Purpose:** Used to track administrative activities performed within the portal.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Master security audit trail (/login-history): Comprehensive login audit logs with staff email, client IP address, browser User-Agent, exact timestamp, and authentication status (SUCCESS or FAILED); order audit history.
- **ECOMMERCE_ADMIN:**
  - Operational audit: Can view chronological status transition history on individual order cards (Paid -> Processing -> Shipped). (Blocked from login history and IP security logs 403).
- **ACCOUNTS_ADMIN:**
  - Financial audit: Can view payment timestamp logs and refund transaction records. (Blocked from login history and IP security logs 403).

#### Standard Operating Procedure (SOP):
1. Navigate to `/login-history` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

### 20. Admin Daily Operations
- **Route / Navigation:** `/`
- **Purpose:** Defines the regular activities that the admin should perform to maintain smooth e-commerce operations.

#### Role Actions & Capabilities:
- **SUPER_ADMIN:**
  - Master Operational Oversight: Morning executive dashboard review (sales, orders, stock); Midday campaign & lead review; Evening financial settlement, staff login security audit, and system health check.
- **ECOMMERCE_ADMIN:**
  - Fulfillment & Merchandising SOP: Morning (09:00 AM) review PAID orders, print pick-lists, notify kitchen of low stock (<=5), advance to Processing; Midday (01:00 PM) recover dropped carts on WhatsApp (/active-carts), reply to Saffron & bulk leads, moderate reviews; Evening (05:00 PM) enter courier AWBs, mark Shipped, check bakery stock.
- **ACCOUNTS_ADMIN:**
  - Financial & Invoicing SOP: Morning (09:30 AM) verify incoming Razorpay payments against bank settlement reports; Midday (02:00 PM) generate & print Paidhu GST Tax Invoices, process approved customer refunds; Evening (05:30 PM) audit stock deductions at /products, generate daily revenue closing summary.

#### Standard Operating Procedure (SOP):
1. Navigate to `/` from the admin sidebar.
2. If your role does not have authorization for this module, the system will enforce Role-Based Access Control and redirect to the Access Denied screen.
3. Perform authorized role actions as outlined in the matrix above.
4. Verify modifications in real-time or via the respective confirmation toast message.

---

## 3. SUPER_ADMIN: MASTER OPERATIONAL MANUAL
*Target Audience: Business Owners, Managing Directors, CTO*

The `SUPER_ADMIN` role possesses 100% unrestricted administrative authority across the entire Paidhu e-commerce platform and database. This role is responsible for executive oversight, organizational governance, financial approvals, staff provisioning, and disaster recovery.

### Core Responsibilities & Authority:
1. **Full Catalog & Pricing Authority:** Create, update, or delete products, floral ingredients, size variants (50g–1kg), and discount structures.
2. **Storefront Merchandising:** Full control over homepage banners (1920x427), BYOC bundles, deals, and category tiles.
3. **Financial Gateway Management:** Direct access to Razorpay gateway logs, payment captures, settlement verification, and one-click customer refunds.
4. **Order Lifecycle Oversight:** Authority to override order statuses, reassign couriers, cancel orders, and reprint GST invoices.
5. **Staff Administration & RBAC:** Provision new `ECOMMERCE_ADMIN` or `ACCOUNTS_ADMIN` accounts, reset passwords, force first-time password rotation, or revoke access instantly.
6. **Store Configuration & Security:** Manage store contact info (`info@paidhu.com`), WhatsApp bridge (`+91 87547 87774`), inject tracking scripts (GA4, GTM, Meta Pixel), inspect staff IP audit trails, and toggle **Maintenance Mode** on/off.

---

## 4. ECOMMERCE_ADMIN: STORE OPERATIONS & MERCHANDISING MANUAL
*Target Audience: Store Managers, Merchandisers, Fulfillment Crew, Customer Support*

The `ECOMMERCE_ADMIN` role is focused strictly on day-to-day storefront operations, inventory replenishment, order fulfillment, content updates, and customer support. Financial gateway ledgers and system administration are restricted to ensure separation of duties.

### What E-Commerce Admin CAN Do:
- **Products & Variants:** Add new products, update descriptions, upload photos to Supabase Storage CDN, configure pack sizes, and assign promotional badges.
- **Order Fulfillment:** Review new orders, print packing slips, update status to `Processing` and `Shipped`, and input courier partner names and AWB tracking numbers.
- **Customer Support:** View customer contact numbers and use the one-click **Direct WhatsApp / Call** button to resolve address queries and delivery questions.
- **Inventory Alerts:** Monitor stock levels and alert bakery kitchen staff when stock drops below 5 units.
- **Cart Recovery:** Access dropped carts at `/active-carts` and click **Chat on WhatsApp** to send gentle reminders and recovery coupons.
- **Content & Marketing:** Upload promotional banners, configure BYOC snack bundles, upload reels to Floral Habitat, publish healthy recipe blogs, and moderate customer reviews.
- **Leads Pipeline:** Review and respond to Saffron Pregnancy Guidance inquiries, B2B corporate bulk orders, and job applications.

### What E-Commerce Admin CANNOT Do (Restricted):
- 🚫 **Payments:** Cannot view Razorpay gateway logs or transaction fees. On order details, payment logs are stripped (`order.payments = []`).
- 🚫 **Payment Status:** Cannot mark an unpaid order as Paid.
- 🚫 **Refunds:** Cannot issue payment gateway refunds.
- 🚫 **Delivery Fee Engine:** Cannot alter standard/express shipping fees or free delivery thresholds.
- 🚫 **Admin Users & RBAC:** Cannot view other staff credentials, create accounts, or change user roles.
- 🚫 **System Settings:** Cannot alter store tracking codes, SEO scripts, or toggle Maintenance Mode.
- 🚫 **Audit Logs:** Cannot view staff login histories or IP security logs.

---

## 5. ACCOUNTS_ADMIN: FINANCIAL CONTROLLER & INVENTORY AUDIT MANUAL
*Target Audience: Accountants, Financial Controllers, Inventory Auditors*

The `ACCOUNTS_ADMIN` role provides complete control over the financial lifecycle, payment reconciliation, GST invoicing, refund processing, and warehouse stock auditing, while locking out storefront design, customer private profiles, and shipping modifications.

### What Accounts Admin CAN Do:
- **Executive Financial Dashboard:** View gross sales (₹), gateway settlement totals, daily cashflow curves, and transaction success rates.
- **Payment Gateway Ledger (`/payments`):** Inspect every captured Razorpay transaction, transaction IDs (`pay_xxx`), payment methods (UPI, Cards, NetBanking, COD), and gateway fees.
- **Refund Processing:** Issue full or partial refunds directly to customer bank/UPI accounts with mandatory justification notes and audit logging.
- **Order Financials:** Verify line-item totals, delivery charges, discounts applied, and tax calculations on every order.
- **Official GST Tax Invoices:** Generate and print official printer-ready Paidhu GST Tax Invoices with GSTIN, HSN codes, and CGST/SGST/IGST breakdown.
- **Stock Management (`/products`):** Dedicated stock audit screen to monitor unit quantities, reconcile physical stock with digital deductions, and verify inventory asset value.
- **Financial & Tax Reporting:** Generate daily/monthly revenue reconciliation, gateway payout reconciliation, and sales tax reports.

### What Accounts Admin CANNOT Do (Restricted):
- 🚫 **Catalog Content:** Cannot add new products, edit botanical descriptions, upload images, or delete products.
- 🚫 **Shipping Lifecycle:** Cannot advance shipping status to `Shipped` or `Delivered`, and cannot edit courier tracking AWBs (blocked with 403).
- 🚫 **Customer Directory:** Cannot view customer address books or personal customer profiles (blocked with 403) for data privacy compliance.
- 🚫 **Website CMS:** Cannot upload banners, edit blogs, modify BYOC bundles, or manage homepage sections.
- 🚫 **Marketing & Leads:** Cannot access Saffron guidance leads, abandoned carts, or bulk order inquiries.
- 🚫 **Coupons & Discounts:** Cannot create or alter coupon codes.
- 🚫 **System Settings:** Cannot alter store configurations, tracking scripts, or toggle Maintenance Mode.
- 🚫 **Audit Logs:** Cannot view staff login histories or IP security logs.

---

## 6. TECHNICAL RBAC ENFORCEMENT ARCHITECTURE

### 6.1 Frontend Route Protection (`admin/src/App.jsx`)
Every administrative route is wrapped inside `<PermissionGuard module="...">`. If an authenticated admin attempts to access an unauthorized route, the guard intercepts the request and displays an **Access Denied** notice with a quick link back to the Dashboard.

### 6.2 Dynamic Sidebar Navigation (`admin/src/components/Sidebar.jsx`)
The sidebar dynamically filters navigation links based on `authService.getCurrentUser().role`. `SUPER_ADMIN` sees all 30 menu links, `ECOMMERCE_ADMIN` sees store and catalog links, and `ACCOUNTS_ADMIN` sees financial, invoicing, and stock management links.

### 6.3 Backend Middleware Authorization (`server/middleware/authMiddleware.js`)
All Express API routes enforce `checkPermission(moduleName)`. Every incoming request verifies the admin's JWT session and matches their database role against the whitelist. Any unauthorized API call returns HTTP 403 Forbidden.

### 6.4 Field-Level Data Redaction (`server/controllers/orderController.js`)
For `ECOMMERCE_ADMIN`, the backend controller automatically strips financial payment transaction rows (`order.payments = []`). For `ACCOUNTS_ADMIN`, attempts to modify shipping status or courier tracking numbers are rejected with HTTP 403 Forbidden.

---
*Maintained by Paidhu Ethical Foods Engineering & Operations Team.*
