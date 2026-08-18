import React, { Suspense, lazy, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

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

              {/* Protected Admin Routes */}
              <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderDetails />} />
                <Route path="customers" element={<Customers />} />
                <Route path="customers/:id" element={<CustomerDetails />} />
                <Route path="payments" element={<Payments />} />
                <Route path="payments/:id" element={<PaymentDetails />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="delivery-charges" element={<DeliveryManagement />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="blogs" element={<Blogs />} />
                <Route path="seo" element={<SeoManagement />} />
                <Route path="banners" element={<Banners />} />
                <Route path="deals-management" element={<DealsManagement />} />
                <Route path="category-grid-management" element={<CategoryGridManagement />} />
                <Route path="family-management" element={<FamilyManagement />} />
                <Route path="floral-habitat-management" element={<FloralHabitatManagement />} />
                <Route path="byoc-management" element={<ByocManagement />} />
                <Route path="community-management" element={<OurCommunityManagement />} />
                <Route path="philosophy-management" element={<OurPhilosophyManagement />} />
                <Route path="bulk-orders-management" element={<BulkOrdersManagement />} />
                <Route path="bulk-order-inquiries" element={<BulkOrderInquiries />} />
                <Route path="about-us-management" element={<AboutUsManagement />} />
                <Route path="active-carts" element={<ActiveCarts />} />
                <Route path="wishlists" element={<WishlistInsights />} />
                <Route path="tiffin-leads" element={<TiffinLeads />} />
                <Route path="whatsapp-leads" element={<TiffinLeads />} />
                <Route path="saffron-guidance-leads" element={<SaffronGuidanceLeads />} />
                <Route path="career-applications" element={<CareerApplications />} />
                <Route path="login-history" element={<LoginHistory />} />

                <Route path="settings" element={<Settings />} />
                <Route path="tracking" element={<TrackingScripts />} />
                <Route path="pages" element={<PagesList />} />
                <Route path="pages/:pageId" element={<PageEditor />} />
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
