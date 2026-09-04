# PAIDHU ETHICAL FOODS — ROLE-BASED FEATURE MATRIX
**Document Version:** 2.0 | **Prepared For:** Paidhu Ethical Foods Management  
**Portal:** [https://admin.paidhuethicalfoods.com/](https://admin.paidhuethicalfoods.com/) *(Local: `http://localhost:5174`)*

---

## 1. COMPARATIVE ROLE ACCESS MATRIX (ALL 20 FEATURES)

| # | Feature Area | SUPER_ADMIN | ECOMMERCE_ADMIN | ACCOUNTS_ADMIN |
| :-: | :--- | :---: | :---: | :---: |
| **1** | **Admin Login** | Full Access | Full Access *(Forced Pwd Change)* | Full Access *(Forced Pwd Change)* |
| **2** | **Dashboard** | Full Access (All KPIs) | Sales & Orders Analytics | Financial & Revenue KPIs |
| **3** | **Products** | Full Access (Add/Edit/Delete) | Full Access (Add/Edit/Media/Variants) | **Restricted** *(Stock View Only)* |
| **4** | **Categories** | Full Access | Full Access (Tiles, Badges, Tints) | **Restricted (403)** |
| **5** | **Orders** | Full Access (All Controls) | **Fulfillment & Shipping** *(Payments Hidden)* | **Payments & Invoicing** *(Shipping Blocked)* |
| **6** | **Customers** | Full Access | Full Access (Profiles & History) | **Restricted (403)** |
| **7** | **Inventory / Stock** | Full Access | Full Access (Stock Updates) | Full Access (Stock Management View) |
| **8** | **Payments** | Full Access (Gateway & Refunds) | **Restricted (403)** *(Redacted)* | Full Access (Razorpay & Refunds) |
| **9** | **Delivery / Shipping** | Full Access (Fee Engine) | View Delivery Info Only | **Restricted (403)** |
| **10** | **Offers / Discounts** | Full Access (Coupons & Deals) | View & Apply to Customers | **Restricted (403)** |
| **11** | **Website Content** | Full Access (All CMS Modules) | Full Access (Banners, BYOC, Blogs) | **Restricted (403)** |
| **12** | **Reviews & Ratings** | Full Access (Approve/Delete) | Full Access (Moderate & Approve) | **Restricted (403)** |
| **13** | **Notifications** | Full Access (All Alerts) | Orders, Stock & Leads Alerts | Payment & Stock Alerts |
| **14** | **Reports** | Full Access (All Reports) | Abandoned Carts, Wishlists, Leads | Sales, Revenue, Refund Reports |
| **15** | **Search & Filters** | Full Access | Products, Orders, Customers | Payments, Orders, Invoices |
| **16** | **Admin Users** | Full Access (Add/Edit/Deactivate) | **Restricted (403)** | **Restricted (403)** |
| **17** | **Roles & Permissions**| Full Access (Assign Roles) | **Restricted (403)** | **Restricted (403)** |
| **18** | **Settings** | Full Access (Maintenance, Scripts) | **Restricted (403)** | **Restricted (403)** |
| **19** | **Activity / Audit Logs**| Full Access (IP & Login Logs) | **Restricted (403)** | **Restricted (403)** |
| **20** | **Daily Operations** | Master Operational Oversight | Dispatch, Recovery & Catalog SOP | Reconciliation, Invoices & Refunds |

---

## 2. SUPER_ADMIN FEATURES BREAKDOWN
*Intended For: Business Owners, Directors, Chief Technology Officers*

### Key Capabilities Across the 20 Features:
1. **Admin Login:** Master authentication credentials with ability to reset any staff member's password.
2. **Dashboard:** Complete executive dashboard showing total revenue, profit margins, order velocity, and system health.
3. **Products:** Complete authority to add, modify, price, discount, or permanently delete catalog products and size variants.
4. **Categories:** Create and reorder categories, homepage visual category tiles, and botanical color accents.
5. **Orders:** Full order lifecycle management, manual status overrides, invoice printing, and cancellation processing.
6. **Customers:** Master customer directory, verified emails, phone numbers, and full purchase history.
7. **Inventory / Stock:** Global stock oversight, physical stock adjustments, and low-stock replenishment management.
8. **Payments:** Direct access to Razorpay gateway logs, payment verification, transaction fees, and one-click refunds.
9. **Delivery / Shipping:** Configure standard & express delivery charges, free delivery thresholds (e.g. Free above ₹999), and regional pincode rules.
10. **Offers / Discounts:** Create coupon codes (percentage and flat discounts), set minimum cart values, usage caps, and flash Deals of the Day.
11. **Website Content:** Manage all CMS sections: Banners (desktop 1920x427 and mobile), BYOC bundles (₹799/3, ₹1049/4, ₹1399/5), Floral Habitat video reels, and Mom's Community photo moments.
12. **Reviews & Ratings:** Moderate customer reviews, publish positive testimonials, and permanently delete spam.
13. **Notifications:** Master notification center for new orders, payment captures, stock warnings, and consultation leads.
14. **Reports:** Full business intelligence: sales revenue, abandoned cart recovery telemetry, wishlist heatmaps, and consultation lead reports.
15. **Search & Filters:** Search across all modules by customer, order number, amount, date, SKU, and status.
16. **Admin Users:** Create, edit, and deactivate administrative staff accounts.
17. **Roles & Permissions:** Assign roles (`SUPER_ADMIN`, `ECOMMERCE_ADMIN`, `ACCOUNTS_ADMIN`) to enforce organizational boundaries.
18. **Settings:** Manage store contact info, announcement ticker, script injection (GA4, GTM, Meta Pixel), and **Maintenance Mode switch** with WhatsApp bridge.
19. **Activity / Audit Logs:** View security audit logs with staff emails, client IP addresses, browser User-Agents, and timestamps.
20. **Daily Operations:** High-level operational oversight, financial review, and strategic marketing adjustments.

---

## 3. ECOMMERCE_ADMIN FEATURES BREAKDOWN
*Intended For: Store Managers, Catalog Merchandisers, Marketing Team, Customer Support*

### What E-Commerce Admin CAN Do:
- **Products:** Add new products, update prices, upload product photos to Supabase CDN, create size variants (50g to 1kg), and write culinary descriptions.
- **Categories:** Manage category titles, visual promotional badges (*Bestseller*, *New Launch*), and category images.
- **Orders (Fulfillment):** View new orders, print pick-lists and tax invoices, update order status to `Processing` and `Shipped`, and input courier partner names and AWB tracking numbers.
- **Customers:** Access customer contact info (phone with direct WhatsApp/Call button) to assist with order inquiries.
- **Inventory / Stock:** Monitor available stock, adjust physical units, and identify low-stock items ($le 5$ units) to alert the kitchen.
- **Abandoned Carts Recovery (`/active-carts`):** View high-intent dropped carts and click **"Chat on WhatsApp"** to send recovery messages and custom discount codes.
- **Website Content:** Upload promotional banners (1920x427 desktop & mobile), configure BYOC bundle offerings, manage Floral Habitat video reels, publish blog recipes, and update Mom's Community event moments.
- **Reviews & Ratings:** Review customer ratings and approve genuine positive reviews.
- **Leads Pipelines:** Follow up on Saffron Pregnancy Guidance inquiries (`/saffron-guidance-leads`), B2B corporate bulk orders, and job applications.
- **Daily Operations:** Execute morning order dispatches, midday cart recovery outreach, and evening stock reviews.

### What E-Commerce Admin CANNOT Do (Restricted):
- 🚫 **Payments:** Cannot view financial Razorpay gateway transaction logs. In order details, financial payment rows are stripped (`order.payments = []`).
- 🚫 **Payment Status:** Cannot update payment status (e.g. cannot mark an unpaid order as Paid).
- 🚫 **Refunds:** Cannot issue gateway refunds.
- 🚫 **Delivery Fee Engine:** Cannot change shipping rates or free delivery thresholds.
- 🚫 **Admin Users & Settings:** Cannot create admin accounts, alter tracking codes, or toggle Maintenance Mode.
- 🚫 **Audit Logs:** Cannot view staff login histories or IP security logs.

---

## 4. ACCOUNTS_ADMIN FEATURES BREAKDOWN
*Intended For: Accountants, Financial Controllers, Inventory Auditors*

### What Accounts Admin CAN Do:
- **Dashboard:** Access real-time revenue KPIs, gross transaction volumes, daily sales curves, and payment success rates.
- **Orders (Financials):** View order financials, line-item totals, applied coupon discounts, delivery fees, and verify payment methods.
- **Tax Invoices:** Generate and print official printer-ready Paidhu Tax Invoices with GST breakdown for customer accounting and tax filing.
- **Payments:** Master ledger of all transactions, Razorpay Payment IDs (`pay_xxx`), captured amounts, and payment methods (UPI, NetBanking, Card, COD).
- **Refund Management:** Process customer refunds, record refund reason notes, and monitor status (`Approved`, `Processed`, `Rejected`).
- **Stock Management (`/products`):** Dedicated stock audit view to monitor physical inventory levels, audit stock deductions, and reconcile discrepancies.
- **Reports:** Generate financial revenue reports, sales reconciliation, and gateway settlement reports.
- **Daily Operations:** Morning payment verification, invoice printing for dispatch, midday refund processing, and evening inventory reconciliation.

### What Accounts Admin CANNOT Do (Restricted):
- 🚫 **Product Catalog:** Cannot create new products, edit descriptions, or change storefront listings.
- 🚫 **Order Shipping Lifecycle:** Cannot advance delivery status to `Shipped` or `Delivered`, and cannot edit courier tracking AWBs (blocked with 403).
- 🚫 **Website Content:** Cannot upload banners, edit blogs, or manage CMS pages.
- 🚫 **Marketing & Leads:** Cannot manage Saffron pregnancy leads, abandoned carts, or corporate bulk inquiries.
- 🚫 **Offers & Discounts:** Cannot create coupon codes or flash sales.
- 🚫 **Customer Directory:** Cannot view customer address books or personal customer profiles.
- 🚫 **Admin Users & Settings:** Cannot modify system configuration, tracking codes, or maintenance settings.

---
*Maintained for Paidhu Ethical Foods Operations & Management.*
