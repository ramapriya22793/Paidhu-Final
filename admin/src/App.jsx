import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Payments from './pages/Payments';
import PaymentDetails from './pages/PaymentDetails';
import Coupons from './pages/Coupons';
import DeliveryManagement from './pages/DeliveryManagement';
import Reviews from './pages/Reviews';
import Blogs from './pages/Blogs';
import SeoManagement from './pages/SeoManagement';
import Banners from './pages/Banners';
import Settings from './pages/Settings';
import TrackingScripts from './pages/TrackingScripts';
import PagesList from './pages/PagesList';
import PageEditor from './pages/PageEditor';
import DealsManagement from './pages/DealsManagement';
import FamilyManagement from './pages/FamilyManagement';
import FloralHabitatManagement from './pages/FloralHabitatManagement';
import ByocManagement from './pages/ByocManagement';
import OurCommunityManagement from './pages/OurCommunityManagement';
import OurPhilosophyManagement from './pages/OurPhilosophyManagement';
import BulkOrdersManagement from './pages/BulkOrdersManagement';
import BulkOrderInquiries from './pages/BulkOrderInquiries';
import AboutUsManagement from './pages/AboutUsManagement';
import ActiveCarts from './pages/ActiveCarts';
import WishlistInsights from './pages/WishlistInsights';
import CategoryGridManagement from './pages/CategoryGridManagement';
import TiffinLeads from './pages/TiffinLeads';
import SaffronGuidanceLeads from './pages/SaffronGuidanceLeads';
import LoginHistory from './pages/LoginHistory';

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Router>
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
    </Router>
    </>
  );
};

export default App;
