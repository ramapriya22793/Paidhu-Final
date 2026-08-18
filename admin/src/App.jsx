import React, { Suspense, lazy, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/authService';

// Error boundary and safe lazy-loading helper to auto-recover when deployment chunks update
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Admin route chunk loading error:", error);
    const chunkFailed = error?.name === 'ChunkLoadError' || 
                        error?.message?.includes('Failed to fetch dynamically imported module') ||
                        error?.message?.includes('Importing a module script failed');
    if (chunkFailed) {
      const hasReloaded = sessionStorage.getItem('admin_chunk_reload_retry');
      if (!hasReloaded) {
        sessionStorage.setItem('admin_chunk_reload_retry', 'true');
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Updating Paidhu Admin...</h2>
          <p className="text-sm text-gray-600 mb-4">Refreshing to load the latest dashboard version.</p>
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_chunk_reload_retry');
              window.location.reload();
            }}
            className="px-5 py-2.5 bg-brand-plum text-white font-bold text-sm rounded-lg shadow hover:bg-brand-plum/90 transition-all cursor-pointer"
          >
            Refresh Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const safeLazy = (importFn) => {
  return lazy(() => 
    importFn().catch((err) => {
      console.warn("Admin lazy import failed, attempting auto reload...", err);
      const hasReloaded = sessionStorage.getItem('admin_chunk_reload_retry');
      if (!hasReloaded) {
        sessionStorage.setItem('admin_chunk_reload_retry', 'true');
        window.location.reload();
        return new Promise(() => {});
      }
      sessionStorage.removeItem('admin_chunk_reload_retry');
      throw err;
    })
  );
};

const Login = safeLazy(() => import('./pages/Login'));
const ForgotPassword = safeLazy(() => import('./pages/ForgotPassword'));
const ChangePassword = safeLazy(() => import('./pages/ChangePassword'));
const Profile = safeLazy(() => import('./pages/Profile'));
const Dashboard = safeLazy(() => import('./pages/Dashboard'));
const ProductList = safeLazy(() => import('./pages/ProductList'));
const AddProduct = safeLazy(() => import('./pages/AddProduct'));
const EditProduct = safeLazy(() => import('./pages/EditProduct'));
const Orders = safeLazy(() => import('./pages/Orders'));
const OrderDetails = safeLazy(() => import('./pages/OrderDetails'));
const Customers = safeLazy(() => import('./pages/Customers'));
const CustomerDetails = safeLazy(() => import('./pages/CustomerDetails'));
const Payments = safeLazy(() => import('./pages/Payments'));
const PaymentDetails = safeLazy(() => import('./pages/PaymentDetails'));
const Coupons = safeLazy(() => import('./pages/Coupons'));
const DeliveryManagement = safeLazy(() => import('./pages/DeliveryManagement'));
const Reviews = safeLazy(() => import('./pages/Reviews'));
const Blogs = safeLazy(() => import('./pages/Blogs'));
const SeoManagement = safeLazy(() => import('./pages/SeoManagement'));
const Banners = safeLazy(() => import('./pages/Banners'));
const Settings = safeLazy(() => import('./pages/Settings'));
const TrackingScripts = safeLazy(() => import('./pages/TrackingScripts'));
const PagesList = safeLazy(() => import('./pages/PagesList'));
const PageEditor = safeLazy(() => import('./pages/PageEditor'));
const DealsManagement = safeLazy(() => import('./pages/DealsManagement'));
const FamilyManagement = safeLazy(() => import('./pages/FamilyManagement'));
const FloralHabitatManagement = safeLazy(() => import('./pages/FloralHabitatManagement'));
const ByocManagement = safeLazy(() => import('./pages/ByocManagement'));
const OurCommunityManagement = safeLazy(() => import('./pages/OurCommunityManagement'));
const OurPhilosophyManagement = safeLazy(() => import('./pages/OurPhilosophyManagement'));
const BulkOrdersManagement = safeLazy(() => import('./pages/BulkOrdersManagement'));
const BulkOrderInquiries = safeLazy(() => import('./pages/BulkOrderInquiries'));
const AboutUsManagement = safeLazy(() => import('./pages/AboutUsManagement'));
const ActiveCarts = safeLazy(() => import('./pages/ActiveCarts'));
const WishlistInsights = safeLazy(() => import('./pages/WishlistInsights'));
const CategoryGridManagement = safeLazy(() => import('./pages/CategoryGridManagement'));
const TiffinLeads = safeLazy(() => import('./pages/TiffinLeads'));
const SaffronGuidanceLeads = safeLazy(() => import('./pages/SaffronGuidanceLeads'));
const CareerApplications = safeLazy(() => import('./pages/CareerApplications'));
const LoginHistory = safeLazy(() => import('./pages/LoginHistory'));



const PermissionGuard = ({ module, children }) => {
  const user = authService.getCurrentUser();
  const role = user?.role || 'SUPER_ADMIN';

  if (role === 'SUPER_ADMIN') {
    return children;
  }

  const roleModules = {
    ECOMMERCE_ADMIN: [
      'blogs', 'saffron_guidance', 'bulk_enquiry', 'banners', 
      'products', 'orders', 'active_carts', 'whatsapp_leads_byoc',
      'profile', 'customers'
    ],
    ACCOUNTS_ADMIN: [
      'orders', 'payments', 'stock_management', 'profile'
    ]
  };

  const allowedModules = roleModules[role] || [];
  if (allowedModules.includes(module)) {
    return children;
  }

  return (
    <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-red-100 max-w-lg mx-auto mt-12">
      <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-4">You do not have permission to access this module.</p>
      <a href="/" className="px-5 py-2.5 bg-brand-plum text-white font-semibold rounded-lg hover:bg-brand-plum/90 transition-all text-sm shadow">
        Back to Dashboard
      </a>
    </div>
  );
};

const App = () => {
  // Keep the Render free tier server awake while the admin panel is open
  useEffect(() => {
    const pingServer = async () => {
      try {
        await fetch((import.meta.env.VITE_API_URL || 'https://paidhu-final-anm2.vercel.app').replace('/api/products', ''));
      } catch (e) {
        // Ignore ping errors
      }
    };
    
    // Initial ping
    pingServer();
    
    // Ping every 10 minutes (600,000 ms) to prevent 15-minute inactivity sleep
    const interval = setInterval(pingServer, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Router>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-brand-plum font-bold text-xl animate-pulse">Loading Paidhu Admin...</div>
            </div>
          }>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

              {/* Protected Admin Routes */}
              <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                
                {/* Products Module */}
                <Route path="products" element={<PermissionGuard module="products"><ProductList /></PermissionGuard>} />
                <Route path="products/add" element={<PermissionGuard module="products"><AddProduct /></PermissionGuard>} />
                <Route path="products/edit/:id" element={<PermissionGuard module="products"><EditProduct /></PermissionGuard>} />
                
                {/* Orders Module */}
                <Route path="orders" element={<PermissionGuard module="orders"><Orders /></PermissionGuard>} />
                <Route path="orders/:id" element={<PermissionGuard module="orders"><OrderDetails /></PermissionGuard>} />
                
                {/* Customers Module */}
                <Route path="customers" element={<PermissionGuard module="customers"><Customers /></PermissionGuard>} />
                <Route path="customers/:id" element={<PermissionGuard module="customers"><CustomerDetails /></PermissionGuard>} />
                
                {/* Payments Module */}
                <Route path="payments" element={<PermissionGuard module="payments"><Payments /></PermissionGuard>} />
                <Route path="payments/:id" element={<PermissionGuard module="payments"><PaymentDetails /></PermissionGuard>} />
                
                {/* Blogs Module */}
                <Route path="blogs" element={<PermissionGuard module="blogs"><Blogs /></PermissionGuard>} />
                
                {/* Banners Module */}
                <Route path="banners" element={<PermissionGuard module="banners"><Banners /></PermissionGuard>} />
                
                {/* BYOC / WhatsApp Leads Module */}
                <Route path="byoc-management" element={<PermissionGuard module="whatsapp_leads_byoc"><ByocManagement /></PermissionGuard>} />
                <Route path="whatsapp-leads" element={<PermissionGuard module="whatsapp_leads_byoc"><TiffinLeads /></PermissionGuard>} />
                
                {/* Bulk Enquiry Module */}
                <Route path="bulk-order-inquiries" element={<PermissionGuard module="bulk_enquiry"><BulkOrderInquiries /></PermissionGuard>} />
                
                {/* Saffron Guidance Module */}
                <Route path="saffron-guidance-leads" element={<PermissionGuard module="saffron_guidance"><SaffronGuidanceLeads /></PermissionGuard>} />
                
                {/* Active Carts Module */}
                <Route path="active-carts" element={<PermissionGuard module="active_carts"><ActiveCarts /></PermissionGuard>} />
                
                {/* Profile (General access for all roles) */}
                <Route path="profile" element={<Profile />} />

                {/* Restricted Super Admin Only Modules */}
                <Route path="coupons" element={<PermissionGuard module="super_only"><Coupons /></PermissionGuard>} />
                <Route path="delivery-charges" element={<PermissionGuard module="super_only"><DeliveryManagement /></PermissionGuard>} />
                <Route path="reviews" element={<PermissionGuard module="super_only"><Reviews /></PermissionGuard>} />
                <Route path="seo" element={<PermissionGuard module="super_only"><SeoManagement /></PermissionGuard>} />
                <Route path="deals-management" element={<PermissionGuard module="super_only"><DealsManagement /></PermissionGuard>} />
                <Route path="category-grid-management" element={<PermissionGuard module="super_only"><CategoryGridManagement /></PermissionGuard>} />
                <Route path="family-management" element={<PermissionGuard module="super_only"><FamilyManagement /></PermissionGuard>} />
                <Route path="floral-habitat-management" element={<PermissionGuard module="super_only"><FloralHabitatManagement /></PermissionGuard>} />
                <Route path="community-management" element={<PermissionGuard module="super_only"><OurCommunityManagement /></PermissionGuard>} />
                <Route path="philosophy-management" element={<PermissionGuard module="super_only"><OurPhilosophyManagement /></PermissionGuard>} />
                <Route path="bulk-orders-management" element={<PermissionGuard module="super_only"><BulkOrdersManagement /></PermissionGuard>} />
                <Route path="about-us-management" element={<PermissionGuard module="super_only"><AboutUsManagement /></PermissionGuard>} />
                <Route path="wishlists" element={<PermissionGuard module="super_only"><WishlistInsights /></PermissionGuard>} />
                <Route path="tiffin-leads" element={<PermissionGuard module="super_only"><TiffinLeads /></PermissionGuard>} />
                <Route path="career-applications" element={<PermissionGuard module="super_only"><CareerApplications /></PermissionGuard>} />
                <Route path="login-history" element={<PermissionGuard module="super_only"><LoginHistory /></PermissionGuard>} />
                <Route path="settings" element={<PermissionGuard module="super_only"><Settings /></PermissionGuard>} />
                <Route path="tracking" element={<PermissionGuard module="super_only"><TrackingScripts /></PermissionGuard>} />
                <Route path="pages" element={<PermissionGuard module="super_only"><PagesList /></PermissionGuard>} />
                <Route path="pages/:pageId" element={<PermissionGuard module="super_only"><PageEditor /></PermissionGuard>} />
              </Route>
              
              {/* Catch-all 404 Route */}
              <Route path="*" element={
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                  <p className="text-gray-600 mb-8">The page you are looking for does not exist. Please check the URL.</p>
                  <a href="/" className="px-6 py-3 bg-brand-plum text-white rounded-lg hover:bg-brand-plum/90 transition-colors">
                    Go to Dashboard
                  </a>
                </div>
              } />
            </Routes>
          </Suspense>
        </ErrorBoundary>

      </Router>
    </>
  );
};

export default App;
