# PAIDHU ETHICAL FOODS - SYSTEM CAPABILITY ARCHITECTURE SPECIFICATION
**Version:** 2.4 | **Status:** Production Active | **Classification:** Enterprise Technical Documentation  
**Repository:** Paidhu-Final | **Production URL:** [https://paidhu-final-anm2.vercel.app](https://paidhu-final-anm2.vercel.app)

---

## 1. EXECUTIVE SUMMARY & PLATFORM OBJECTIVES

Paidhu Ethical Foods is an omnichannel Direct-to-Consumer (D2C) and Business-to-Business (B2B) digital retail and customer consultation platform dedicated to luxury, artisanal floral food creations (Bloom Cookies, Petal Jams, Pure Saffron, Floral Teas, and Brew Flora).

The software architecture is engineered to provide:
1. **Ultra-Low Latency Browsing:** Sub-second page navigation and cart operations via Vite-bundled React Single Page Application (SPA).
2. **Operational Transparency & Control:** Comprehensive multi-role Admin Panel covering products, orders, stock, payments, promotional banners, CMS blocks, and lead acquisition pipelines.
3. **Omnichannel Conversions:** Direct automated bridges connecting digital storefront user flows with WhatsApp chat channels for instant order capture.
4. **Zero-Trust Security & Data Integrity:** Strict Role-Based Access Control (RBAC), bcrypt credential hashing, HMAC-SHA256 payment signature verification, and Prisma parameterized queries.

---

## 2. MULTI-TIER SYSTEM TOPOLOGY

`mermaid
graph TD
    ClientBrowser["Client Browser (Storefront / Admin SPA)"]
    CDN["Vercel Edge Network & CDN"]
    
    subgraph Frontend_Layer ["Frontend Tier"]
        Storefront["Paidhu Storefront SPA (Vite + React 19 + Tailwind 4)"]
        AdminPortal["Paidhu Admin Operations Portal (React 19 + RBAC)"]
    end

    subgraph Backend_Layer ["API & Application Tier"]
        ExpressServer["Node.js + Express API Gateway (Serverless)"]
        AuthMiddleware["JWT Verification & Role Guard Middleware"]
        UploadService["Multer + Supabase S3 Object Upload Engine"]
        PaymentVerifier["Razorpay HMAC Signature Verifier"]
    end

    subgraph Persistence_Layer ["Persistence & Cloud Storage"]
        PrismaORM["Prisma Client v6 (Query Builder & Migration Engine)"]
        PostgresDB[("Supabase PostgreSQL Database")]
        SupabaseStorage[("Supabase S3 Object Storage ('products' bucket)")]
    end

    subgraph External_Services ["External Integrations"]
        RazorpayGateway["Razorpay Payment Gateway API"]
        WhatsAppAPI["WhatsApp Business Links & Chat Webhooks"]
        MetaPixel["Meta Pixel Conversion API"]
        GA4["Google Analytics 4 & GTM"]
    end

    ClientBrowser --> CDN
    CDN --> Storefront
    CDN --> AdminPortal
    Storefront --> ExpressServer
    AdminPortal --> ExpressServer
    ExpressServer --> AuthMiddleware
    ExpressServer --> UploadService
    ExpressServer --> PaymentVerifier
    UploadService --> SupabaseStorage
    PaymentVerifier --> RazorpayGateway
    AuthMiddleware --> PrismaORM
    PrismaORM --> PostgresDB
    Storefront --> WhatsAppAPI
    Storefront --> MetaPixel
    Storefront --> GA4
`

### Component Breakdown
- **Storefront Client (/frontend):** Built on React 19, React Router v7, Framer Motion, and Tailwind CSS v4. Manages client-side state with CartContext, localStorage session caching, responsive navigation, and lazy-loaded routes with ErrorBoundary auto-recovery.
- **Admin Management Portal (/admin):** Separate application with enterprise UI components, Recharts telemetry, toast notification system, and modular PermissionGuard access isolation.
- **Backend API Service (/server):** Node.js and Express RESTful API. Contains route handlers, controllers, data validators, invoice PDF generators, and Prisma database connections.
- **Database (Supabase PostgreSQL):** Relational database storing catalog items, order state transitions, customer records, audit trails, and tracking scripts.
- **Object Storage (Supabase Storage):** S3-compatible cloud storage bucket named products providing instant global CDN delivery for product photos, promotional banners, community gallery moments, and habitat videos.

---

## 3. DOMAIN CAPABILITY MATRIX

| Domain | Capability Description | Key API Endpoints | Data Entities Involved |
| :--- | :--- | :--- | :--- |
| **Catalog & Stock** | SKU management, size variants, unit weights, pricing, real-time stock deductions | GET /api/products, POST /api/products, PUT /api/products/:id | Product, Category, Review |
| **BYOC Bundles** | Multi-tier bundle calculations (₹799/3, ₹1049/4, ₹1399/5) with dynamic item discounts | GET /api/products/byoc | Product, SiteSettings |
| **Order Processing** | State machine order progression (PENDING -> PAID -> PROCESSING -> SHIPPED -> DELIVERED -> CANCELLED) | POST /api/checkout/initiate, GET /api/orders, PUT /api/orders/:id/status | Order, OrderItem, DeliveryCharge |
| **Financials & Gateway**| Razorpay order generation, HMAC-SHA256 signature verification, refund ledger, tax invoicing | POST /api/checkout/verify, GET /api/payments, POST /api/payments/refund | Payment, Refund, Order |
| **Promotions & Banners**| Rule-based coupon engine (percentage/flat, min cart value, expiry), desktop (1920x427) responsive banner routing | GET /api/coupons, POST /api/coupons/validate, GET /api/banners | Coupon, Banner |
| **Content CMS** | Dynamic page content management (Floral Habitat, Family Combos, Our Philosophy, About Us, Mom's Community) | GET /api/settings, PUT /api/settings, GET /api/blogs | SiteSettings, Blog, Page |
| **Lead Pipelines** | WhatsApp direct checkout leads, Saffron Guidance pregnancy consultation leads, B2B corporate bulk orders, Job applications | POST /api/saffron-guidance, POST /api/bulk-orders/inquire, POST /api/careers/apply | SaffronGuidance, TiffinRegistration, CareerApplication |
| **Customer Intelligence**| Abandoned cart recovery tracking, wishlist popularity heatmaps, customer purchase histories, login security audit log | GET /api/admin/active-carts, GET /api/admin/wishlists, GET /api/admin/login-history | Cart, Wishlist, LoginHistory, User |
| **System Governance** | Dynamic tracking scripts (GA4, GTM, Meta Pixel), Under Maintenance Mode toggle with WhatsApp bridge | GET /api/tracking, POST /api/tracking, PUT /api/settings/maintenance | TrackingScript, SiteSettings |

---

## 4. ROLE-BASED ACCESS CONTROL (RBAC) ARCHITECTURE

The Admin Portal enforces a strict 3-tier Role-Based Access Control architecture:

`
[ Incoming Request ]
        |
        v
[ JWT Verification (Bearer Token) ]
        |
        +---> Invalid / Expired: 401 Unauthorized
        |
        v
[ User Role Identification ]
        |
        +---> Role: SUPER_ADMIN --------> Complete Access (All 28 Modules & System Controls)
        |
        +---> Role: ECOMMERCE_ADMIN ----> Operational Commerce (Catalog, Orders, Banners, CMS, Inquiries)
        |
        +---> Role: ACCOUNTS_ADMIN -----> Financial Operations (Orders, Payments, Stock Levels, Invoices)
        |
        v
[ PermissionGuard Component (Admin Frontend) & authRole Middleware (Server) ]
`

### Module Permissions Matrix
| Module | Super Admin | Ecommerce Admin | Accounts Admin |
| :--- | :---: | :---: | :---: |
| **Dashboard & Core Metrics** | ALLOWED | ALLOWED | ALLOWED |
| **Product Catalog (Add/Edit/Delete)** | ALLOWED | ALLOWED | RESTRICTED |
| **Stock Management (Quantity Only)** | ALLOWED | ALLOWED | ALLOWED |
| **Orders & Fulfillment** | ALLOWED | ALLOWED | ALLOWED |
| **Payment Records & Refunds** | ALLOWED | RESTRICTED | ALLOWED |
| **Active Carts (Recovery)** | ALLOWED | ALLOWED | RESTRICTED |
| **Customer Directory** | ALLOWED | ALLOWED | RESTRICTED |
| **Banners & Marketing Sliders** | ALLOWED | ALLOWED | RESTRICTED |
| **Coupons & Discount Rules** | ALLOWED | RESTRICTED | RESTRICTED |
| **Delivery Charges & Pincodes** | ALLOWED | RESTRICTED | RESTRICTED |
| **SEO & Meta Tag Management** | ALLOWED | RESTRICTED | RESTRICTED |
| **Tracking Scripts (Pixel/GA4)** | ALLOWED | RESTRICTED | RESTRICTED |
| **Login Audit Logs** | ALLOWED | RESTRICTED | RESTRICTED |
| **Capability Architecture Spec** | ALLOWED | ALLOWED | ALLOWED |

---

## 5. CORE TRANSACTION & DATA FLOW SEQUENCES

### 5.1 End-to-End Checkout & Payment Sequence
`
Client (Storefront)                 Express API Server                  Razorpay Gateway                PostgreSQL DB
        |                                   |                                   |                             |
        |--- 1. POST /api/checkout/calc --->|                                   |                             |
        |    (cart, pincode, coupon)        |--- 2. Query product prices & fees ----------------------------->|
        |<-- 3. Return validated totals ----|<-- 4. Return valid prices & tax --------------------------------|
        |                                   |                                   |                             |
        |--- 5. POST /api/checkout/initiate>|                                   |                             |
        |                                   |--- 6. razorpay.orders.create ---->|                             |
        |                                   |<-- 7. Returns rzp_order_id -------|                             |
        |                                   |--- 8. Write Order (PENDING) ----------------------------------->|
        |<-- 9. Return rzp_order_id --------|                                   |                             |
        |                                   |                                   |                             |
        |--- 10. Open Razorpay Checkout Window -------------------------------->|                             |
        |    (Customer pays via UPI/Card)   |                                   |                             |
        |<-- 11. Payment Success with signature --------------------------------|                             |
        |                                   |                                   |                             |
        |--- 12. POST /api/checkout/verify ->|                                  |                             |
        |    (order_id, payment_id, sig)    |--- 13. Verify HMAC-SHA256 signature locally                     |
        |                                   |--- 14. Update Order (PAID) & decrement stock ------------------>|
        |<-- 15. Return Order Confirmed ----|                                   |                             |
        |                                   |                                   |                             |
        |--- 16. Navigate /order-success/{orderNumber}                          |                             |
`

### 5.2 Cloud Storage & CDN Pipeline
`
Admin / Client User               Express Server                    Supabase S3 Bucket           Vercel CDN Edge
        |                                |                                   |                          |
        |--- 1. Upload Image/Video ----->|                                   |                          |
        |    (multipart/form-data)       |--- 2. Buffer inspection & Sharp --|                          |
        |                                |--- 3. supabase.storage.upload --->|                          |
        |                                |<-- 4. 200 OK with Key ------------|                          |
        |<-- 5. Return Public CDN URL ---|                                   |                          |
        |                                |                                   |                          |
        |--- 6. Public Visitor requests image --------------------------------------------------------->|
        |                                                                    |<-- 7. Cache hit/miss ----|
        |<-- 8. Delivered globally with sub-50ms latency -----------------------------------------------|
`

---

## 6. DATABASE SCHEMA & ENTITY RELATIONSHIPS

The PostgreSQL relational architecture managed by Prisma contains the following core domain models:
- **User**: System administrators and registered customers (id, 
ame, email, phone, password, ole, createdAt).
- **Product**: Floral food SKUs (id, 	itle, slug, description, price, comparePrice, images, stock, isBestseller, ariants).
- **Order**: Purchase orders (id, orderNumber, userId, customerName, email, phone, shippingAddress, subtotal, 	otalAmount, status, paymentStatus).
- **OrderItem**: Line items per order (id, orderId, productId, ariant, quantity, price).
- **Payment**: Financial records (id, orderId, gateway, azorpayOrderId, azorpayPaymentId, azorpaySignature, mount, status).
- **Banner**: Visual promotions (id, 	itle, subtitle, imageUrl, mobileImageUrl, pageSlug, categorySlug, uttonText, linkUrl, isActive).
- **Coupon**: Promotion rules (id, code, discountType, discountValue, minOrderAmount, maxDiscount, expiryDate, isActive).
- **DeliveryCharge**: Regional shipping rules (id, 	ype, charge, reeAbove, estimatedDays, egions, isActive).
- **TrackingScript**: External telemetry tags (id, 
ame, provider, placement, code, isActive).
- **SaffronGuidance**: Trimester consultation leads (id, yourName, spouseName, phone, purpose, pregnancyMonth, doctorPermission, status).
- **LoginHistory**: Audit trail (id, userId, ipAddress, userAgent, status, loginTime).

---

## 7. DEPLOYMENT & HIGH-AVAILABILITY INFRASTRUCTURE

- **Hosting & Compute:** Vercel Global Edge Network running serverless Node.js functions.
- **Continuous Integration & Deployment (CI/CD):** Git push-to-deploy triggered on GitHub repository main branch.
- **Build Optimization:** Rolldown & Vite compiler with code-splitting chunks, Gzip compression, and dynamic import wrappers.
- **Domain & SSL:** TLS 1.3 automated encryption with HTTP/2 and HTTP/3 support across paidhuethicalfoods.com and staging aliases.
- **Fail-Safe Operation:** Client-side ErrorBoundary modules that detect stale chunk deployments and automatically refresh the client session seamlessly.
