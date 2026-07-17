import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProductList = lazy(() => import('./pages/ProductList'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const EditProduct = lazy(() => import('./pages/EditProduct'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Customers = lazy(() => import('./pages/Customers'));
const CustomerDetails = lazy(() => import('./pages/CustomerDetails'));
const Payments = lazy(() => import('./pages/Payments'));
const PaymentDetails = lazy(() => import('./pages/PaymentDetails'));
const Coupons = lazy(() => import('./pages/Coupons'));
const DeliveryManagement = lazy(() => import('./pages/DeliveryManagement'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Blogs = lazy(() => import('./pages/Blogs'));
const SeoManagement = lazy(() => import('./pages/SeoManagement'));
const Banners = lazy(() => import('./pages/Banners'));
const Settings = lazy(() => import('./pages/Settings'));
const TrackingScripts = lazy(() => import('./pages/TrackingScripts'));
const PagesList = lazy(() => import('./pages/PagesList'));
const PageEditor = lazy(() => import('./pages/PageEditor'));
const DealsManagement = lazy(() => import('./pages/DealsManagement'));
const FamilyManagement = lazy(() => import('./pages/FamilyManagement'));
const FloralHabitatManagement = lazy(() => import('./pages/FloralHabitatManagement'));
const ByocManagement = lazy(() => import('./pages/ByocManagement'));
const OurCommunityManagement = lazy(() => import('./pages/OurCommunityManagement'));
const OurPhilosophyManagement = lazy(() => import('./pages/OurPhilosophyManagement'));
const BulkOrdersManagement = lazy(() => import('./pages/BulkOrdersManagement'));
const BulkOrderInquiries = lazy(() => import('./pages/BulkOrderInquiries'));
const AboutUsManagement = lazy(() => import('./pages/AboutUsManagement'));
const ActiveCarts = lazy(() => import('./pages/ActiveCarts'));
const WishlistInsights = lazy(() => import('./pages/WishlistInsights'));
const CategoryGridManagement = lazy(() => import('./pages/CategoryGridManagement'));
const TiffinLeads = lazy(() => import('./pages/TiffinLeads'));
const SaffronGuidanceLeads = lazy(() => import('./pages/SaffronGuidanceLeads'));
const LoginHistory = lazy(() => import('./pages/LoginHistory'));

const App = () => {
  // Keep the Render free tier server awake while the admin panel is open
  useEffect(() => {
    const pingServer = async () => {
      try {
        await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api/products', ''));
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
      </Router>
    </>
  );
};

export default App;
