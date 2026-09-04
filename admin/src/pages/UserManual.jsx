import React, { useState } from 'react';
import { 
  FiBook, FiSearch, FiCopy, FiPrinter, FiDownload, FiCheck, 
  FiLayers, FiBox, FiShoppingCart, FiUsers, FiTag, FiFileText, 
  FiSettings, FiShield, FiActivity, FiGlobe, FiClock, FiCheckCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const SECTIONS = [
  {
    id: 1,
    title: '1. Admin Login',
    icon: <FiShield className="text-purple-600" />,
    badge: 'Security & Auth',
    purpose: 'Used by authorized administrators to securely access the Paidhu Ethical Foods Admin Portal.',
    capabilities: [
      'Login to the portal securely at /login with encrypted bcryptjs authentication and 7-day JWT session tokens.',
      'Enforce Password Rotation: First-time staff members are automatically prompted with a forced password change screen at /change-password before receiving dashboard access.',
      'Access authorized modules based on role (SUPER_ADMIN, ECOMMERCE_ADMIN, or ACCOUNTS_ADMIN).',
      'Logout from the portal safely via the logout action in the sidebar.'
    ],
    route: '/login'
  },
  {
    id: 2,
    title: '2. Dashboard',
    icon: <FiActivity className="text-blue-600" />,
    badge: 'Analytics',
    purpose: 'Provides an overall view of the activities and information managed through the Admin Portal.',
    capabilities: [
      'Revenue Overview: Total gross sales (₹) calculated in real time from captured Razorpay and COD transactions.',
      'Order information: Live count of placed orders with month-over-month trajectory curves.',
      'Product information: Total catalog count, active listings, and instant low-stock warning indicators (units <= 5).',
      'Customer information: Registered customer growth and active buyer telemetry.',
      'Sales velocity chart: Interactive daily and monthly revenue charts rendered via Recharts.',
      'Pending activities: Processing orders, shipments in transit, and new consultation leads.'
    ],
    route: '/'
  },
  {
    id: 3,
    title: '3. Products',
    icon: <FiBox className="text-emerald-600" />,
    badge: 'Catalog',
    purpose: 'Used to manage the products displayed and sold through the Paidhu Ethical Foods website.',
    capabilities: [
      'View products (/products) with search, category filtering, SKU codes, and stock levels.',
      'Add products (/products/new): Title, rich botanical description, auto-generated SEO slug, and category assignment.',
      'Update product price: Base MRP and promotional discounted offer prices.',
      'Update product images: Multi-image drag-and-drop upload to Supabase Storage products bucket with instant CDN delivery.',
      'Manage multi-size variants: Configure variants (50g, 100g, 250g, 500g, 1kg) with individual prices, stock units, and SKUs.',
      'Manage product badges: bestseller, new_arrival, deal_of_the_day, family_combo.',
      'Manage product status: Active (visible on store) vs. Inactive (hidden).'
    ],
    route: '/products'
  },
  {
    id: 4,
    title: '4. Categories',
    icon: <FiLayers className="text-amber-600" />,
    badge: 'Taxonomy',
    purpose: 'Used to organize products into appropriate product categories.',
    capabilities: [
      'View active categories (Bloom Cookies, Petal Jams, Pure Saffron, Floral Teas, Brew Flora, Super Value Packs).',
      'Add & Edit categories with subtitle slogans and custom SEO slugs.',
      'Manage category background accent color tints matching floral botanicals (rose pink, saffron gold, lavender purple).',
      'Manage promotional badges: Bestseller, New Launch, Chef\'s Special.',
      'Toggle visibility of category tiles on the homepage category grid.'
    ],
    route: '/category-grid-management'
  },
  {
    id: 5,
    title: '5. Orders',
    icon: <FiShoppingCart className="text-indigo-600" />,
    badge: 'Fulfillment',
    purpose: 'Used to manage customer orders received through the website.',
    capabilities: [
      'View orders (/orders) filtered by status tabs: ALL, PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, and CANCELLED.',
      'View order details (/orders/:id) showing itemized products, size variants, unit prices, and quantities.',
      'View customer contact details: Full name, telephone number (with direct WhatsApp/Call button), and email address.',
      'View delivery information: Exact shipping address with door/flat number, street, city, state, and 6-digit pincode.',
      'Check order amounts: Subtotal, coupon discounts deducted, delivery charges, Razorpay payment ID, and payment method.',
      'Update order status: Advance from Paid -> Processing -> Shipped -> Delivered.',
      'Assign courier tracking: Enter courier partner name (Blue Dart, Delhivery) and AWB Tracking Number.',
      'Print Tax Invoice: Click \'Print Tax Invoice\' to generate a printer-ready official Paidhu GST Tax Invoice.'
    ],
    route: '/orders'
  },
  {
    id: 6,
    title: '6. Customers',
    icon: <FiUsers className="text-cyan-600" />,
    badge: 'CRM',
    purpose: 'Used to manage customer information associated with website orders.',
    capabilities: [
      'View customers (/customers): Searchable directory displaying full name, verified mobile number, and email.',
      'View customer details (/customers/:id): Full profile showing lifetime spend (LTV), total orders, and average order value.',
      'View delivery information: Saved address book (Home, Work, etc.).',
      'View customer order history: Chronological list of all past purchases and payment records.'
    ],
    route: '/customers'
  },
  {
    id: 7,
    title: '7. Inventory / Stock',
    icon: <FiBox className="text-rose-600" />,
    badge: 'Inventory',
    purpose: 'Used to maintain product availability and stock information.',
    capabilities: [
      'View product stock in real time across all catalog items and individual size variants.',
      'Update stock quantity to reflect new bakery batches or incoming supplier shipments.',
      'Identify available products (Green badge), low-stock products (Amber badge for units <= 5), and out-of-stock items (Red badge).',
      'Stock automatically decrements upon successful payment completion on the storefront.'
    ],
    route: '/products'
  },
  {
    id: 8,
    title: '8. Payments',
    icon: <FiCheckCircle className="text-emerald-700" />,
    badge: 'Finance',
    purpose: 'Used to monitor, verify, and reconcile financial transactions from online payment gateways and cash-on-delivery orders.',
    capabilities: [
      'View payment transactions (/payments): Real-time ledger of Razorpay transactions.',
      'Check payment details: Inspect Razorpay Payment ID (pay_xxx), Order ID, captured amount, and gateway status.',
      'Check payment methods: Verify UPI (Google Pay, PhonePe, Paytm), NetBanking, Credit/Debit Card, or COD.',
      'Process refunds: Issue full or partial refunds directly through the portal with audit log tracking.'
    ],
    route: '/payments'
  },
  {
    id: 9,
    title: '9. Delivery / Shipping',
    icon: <FiGlobe className="text-blue-700" />,
    badge: 'Logistics',
    purpose: 'Used to manage the delivery-related information associated with customer orders.',
    capabilities: [
      'View delivery address and contact information on every order.',
      'Configure shipping fees (/delivery-charges): Set Standard Delivery charge, Express Delivery charge, and Free Delivery threshold (e.g. Free over ₹999).',
      'Configure customer-facing delivery promises (e.g. \'Estimated delivery in 3–5 business days\').',
      'Manage regional delivery rules and pincode surcharges.'
    ],
    route: '/delivery-charges'
  },
  {
    id: 10,
    title: '10. Offers / Discounts',
    icon: <FiTag className="text-pink-600" />,
    badge: 'Marketing',
    purpose: 'Used to manage promotional offers and discounts provided to customers.',
    capabilities: [
      'Create offers (/coupons): Configure discount codes (e.g. PAIDHU10, WELCOME500).',
      'Set discount types: Percentage discount (e.g. 10% off) or Fixed amount (e.g. Flat ₹150 off).',
      'Manage discount rules: Minimum cart requirement, maximum discount cap, usage limits per customer, and start/expiry dates.',
      'Manage Flash Deals of the Day (/deals-management): Curate promotional products on /shop/deal-of-the-day with countdown timers.'
    ],
    route: '/coupons'
  },
  {
    id: 11,
    title: '11. Website Content',
    icon: <FiFileText className="text-teal-600" />,
    badge: 'CMS',
    purpose: 'Used to manage content displayed on the Paidhu Ethical Foods website.',
    capabilities: [
      'Banners (/banners): Upload desktop banners (exact 1920 x 427 px) and mobile banners with page routing (home, shop-all).',
      'Floral Habitat Section (/floral-habitat-management): Manage video reels, storytelling copy, and starter pack products.',
      'BYOC Bundles (/byoc-management): Configure pricing tiers (3 for ₹799, 4 for ₹1049, 5 for ₹1399) and eligible products.',
      'Mom\'s Community (/community-management): Upload event photos, memories, and manage WhatsApp community group link.',
      'Our Philosophy & About Us: Manage botanical nutrition ethos, certifications, and founder story.'
    ],
    route: '/banners'
  },
  {
    id: 12,
    title: '12. Reviews & Ratings',
    icon: <FiCheckCircle className="text-yellow-600" />,
    badge: 'Moderation',
    purpose: 'Used to manage customer feedback and product reviews.',
    capabilities: [
      'View reviews (/reviews) and inspect 1–5 star ratings submitted by customers.',
      'Approve reviews to publish positive feedback onto the live product page.',
      'Reject or delete inappropriate reviews or spam to protect brand integrity.'
    ],
    route: '/reviews'
  },
  {
    id: 13,
    title: '13. Notifications',
    icon: <FiActivity className="text-orange-600" />,
    badge: 'Alerts',
    purpose: 'Provides important alerts and updates related to portal activities.',
    capabilities: [
      'Notification bell dropdown in the top header with live unread badge count.',
      'Instant alerts for new customer orders placed online.',
      'Payment confirmations and gateway failure notices.',
      'Low inventory alerts when an SKU drops below 5 units.'
    ],
    route: '/'
  },
  {
    id: 14,
    title: '14. Reports',
    icon: <FiActivity className="text-indigo-700" />,
    badge: 'Intelligence',
    purpose: 'Used to review business and operational information generated through the portal.',
    capabilities: [
      'Sales and Revenue reports visualized via interactive Recharts curves.',
      'Abandoned Cart Telemetry (/active-carts): High-intent customer cart values with one-click WhatsApp recovery buttons.',
      'Wishlist Demand Insights (/wishlists): Products most desired by customers to guide production scheduling.',
      'Lead Pipeline Reports: Saffron pregnancy leads, corporate bulk order inquiries, and career job applications.'
    ],
    route: '/active-carts'
  },
  {
    id: 15,
    title: '15. Search & Filters',
    icon: <FiSearch className="text-blue-500" />,
    badge: 'Navigation',
    purpose: 'Used to quickly locate specific information within the Admin Portal.',
    capabilities: [
      'Global Header Search: Instantly locate products, orders, and customer records from the top bar.',
      'Product Filters: Filter by category, price, SKU, or stock availability.',
      'Order Filters: Filter by fulfillment status tab (Paid, Processing, Shipped), customer phone, or date range.'
    ],
    route: '/products'
  },
  {
    id: 16,
    title: '16. Admin Users',
    icon: <FiUsers className="text-purple-700" />,
    badge: 'Access',
    purpose: 'Used to manage users who have access to the Admin Portal.',
    capabilities: [
      'View admin users list with assigned roles and credentials.',
      'Provision new staff accounts with initial credentials and forced password change flag.',
      'Activate/deactivate users to revoke portal access when team members change roles.'
    ],
    route: '/profile'
  },
  {
    id: 17,
    title: '17. Roles & Permissions',
    icon: <FiShield className="text-rose-700" />,
    badge: 'RBAC',
    purpose: 'Used to control what different admin users can access and manage.',
    capabilities: [
      'SUPER_ADMIN: Master unrestricted access across all 28 modules and system settings.',
      'ECOMMERCE_ADMIN: Operational control over catalog, orders, carts, content, banners, and leads (financial records hidden).',
      'ACCOUNTS_ADMIN: Focused access to financial records, orders, payments, invoices, and stock (CMS and marketing leads hidden).',
      'Backend checks enforce permissions via checkPermission middleware and field-level controllers.'
    ],
    route: '/profile'
  },
  {
    id: 18,
    title: '18. Settings',
    icon: <FiSettings className="text-gray-700" />,
    badge: 'Configuration',
    purpose: 'Contains the configuration options used to manage the portal and website.',
    capabilities: [
      'General store parameters: Support phone, official WhatsApp link, and support email (info@paidhu.com).',
      'Announcement Bar: Update the scrolling promotional marquee ticker across the storefront.',
      'Maintenance Mode Switch: Toggle Maintenance Mode ON to display the Under Maintenance page with the WhatsApp bridge (bypass anytime with ?preview=true).',
      'Tracking Scripts Injection (/tracking): One-click script injection for GA4, GTM, and Meta Pixel.'
    ],
    route: '/settings'
  },
  {
    id: 19,
    title: '19. Activity / Audit Logs',
    icon: <FiClock className="text-red-600" />,
    badge: 'Audit',
    purpose: 'Used to track administrative activities performed within the portal.',
    capabilities: [
      'Login Activity (/login-history): Logs every login attempt with user email, client IP address, device/browser details, timestamp, and status (SUCCESS or FAILED).',
      'Order history: Timeline of status transitions on every order card.',
      'Date and time tracking for all administrative modifications.'
    ],
    route: '/login-history'
  },
  {
    id: 20,
    title: '20. Admin Daily Operations',
    icon: <FiCheck className="text-green-600" />,
    badge: 'Standard Procedure',
    purpose: 'Defines the regular activities that the admin should perform to maintain smooth e-commerce operations.',
    capabilities: [
      'Morning Shift (09:00 AM): Review Dashboard KPIs, verify Paid orders, print tax invoices, and follow up on Saffron guidance leads.',
      'Midday Shift (01:00 PM): Recover abandoned carts via WhatsApp (/active-carts), reply to B2B bulk inquiries, and moderate reviews.',
      'Evening Shift (05:00 PM): Assign courier AWB tracking numbers, advance orders to Shipped, verify stock levels, and review login security logs.'
    ],
    route: '/'
  }
];

const UserManual = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredSections = SECTIONS.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.capabilities.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopy = () => {
    const fullText = SECTIONS.map(s => 
      `${s.title}\nPurpose: ${s.purpose}\nAdmin can:\n` + s.capabilities.map(c => `- ${c}`).join('\n')
    ).join('\n\n');
    
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success('Manual text copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const fullText = `# PAIDHU ETHICAL FOODS - ADMIN PORTAL USER MANUAL & SOP\nVersion: 1.0\n\n` + 
      SECTIONS.map(s => `## ${s.title}\n### Purpose:\n${s.purpose}\n\n### Admin can:\n` + s.capabilities.map(c => `- ${c}`).join('\n')).join('\n\n');
    
    const blob = new Blob([fullText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PAIDHU_ADMIN_SOP_MANUAL.md';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded PAIDHU_ADMIN_SOP_MANUAL.md');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-plum via-[#7c3066] to-[#511c42] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-cream text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm border border-white/10">
              <FiBook className="w-4 h-4" /> Standard Operating Procedure (SOP)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
              Paidhu Admin Portal User Manual
            </h1>
            <p className="text-xs sm:text-sm text-brand-cream/80 max-w-2xl mt-1 leading-relaxed">
              Official 20-Section Operations Guide & Standard Operating Procedure for Managing the Paidhu Ethical Foods Store.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all backdrop-blur-sm border border-white/20 cursor-pointer shadow-sm"
            >
              {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all backdrop-blur-sm border border-white/20 cursor-pointer shadow-sm"
            >
              <FiDownload />
              <span>Download .MD</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-gray-900 rounded-lg text-xs font-extrabold transition-all cursor-pointer shadow-md"
            >
              <FiPrinter />
              <span>Print SOP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search features (e.g. orders, stock, whatsapp, coupons)..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-plum focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 w-full sm:w-auto justify-end">
          <span>Showing <strong>{filteredSections.length}</strong> of <strong>{SECTIONS.length}</strong> Sections</span>
        </div>
      </div>

      {/* Quick Jump Pills */}
      <div className="flex flex-wrap gap-1.5 print:hidden">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#section-${s.id}`}
            className="px-2.5 py-1 bg-white hover:bg-brand-cream text-gray-600 hover:text-brand-plum rounded-md text-[11px] font-semibold border border-gray-200 transition-colors"
          >
            {s.id}. {s.title.split('. ')[1]}
          </a>
        ))}
      </div>

      {/* 20 Sections List */}
      <div className="space-y-6">
        {filteredSections.map((sec) => (
          <div
            key={sec.id}
            id={`section-${sec.id}`}
            className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-gray-100 hover:border-brand-plum/20 transition-all scroll-mt-24"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shrink-0">
                  {sec.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-serif">
                    {sec.title}
                  </h3>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {sec.badge}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold">
                Route: {sec.route}
              </span>
            </div>

            {/* Purpose */}
            <div className="mb-4 bg-brand-cream/30 p-3.5 rounded-xl border border-brand-cream">
              <p className="text-xs font-bold text-brand-plum uppercase tracking-wider mb-0.5">Purpose:</p>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">{sec.purpose}</p>
            </div>

            {/* Capabilities */}
            <div>
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Admin can:
              </p>
              <ul className="space-y-2">
                {sec.capabilities.map((cap, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-plum shrink-0 mt-2" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default UserManual;
