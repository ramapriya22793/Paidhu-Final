import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link, Navigate } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import ProductCollection from './components/home/ProductCollection';
import { CartProvider } from './context/CartContext';
import SEO from './components/seo/SEO';
import MaintenancePage from './pages/MaintenancePage';

import Footer from './components/layout/Footer';
import WhatsAppButton from './components/ui/WhatsAppButton';

// Direct Page & Component imports to guarantee zero chunk load failures
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import SaffronGuidancePage from './pages/SaffronGuidancePage';
import BYOCPage from './pages/BYOCPage';
import LegalPage from './pages/LegalPage';
import CareersPage from './pages/CareersPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';

// Home components
import ExploreCategory from './components/home/ExploreCategory';
import BenefitsMarquee from './components/home/BenefitsMarquee';
import FeaturedBento from './components/home/FeaturedBento';
import PaidhuSpotlight from './components/home/PaidhuSpotlight';
import CustomerVideoReels from './components/home/CustomerVideoReels';
import RealMomsSection from './components/home/RealMomsSection';
import BrandCharactersBanner from './components/home/BrandCharactersBanner';

// MAINTENANCE MODE SWITCH:
// Set to true to display the Under Maintenance page across the store with WhatsApp navigation.
// Set to false to restore the full website.
// Preview bypass: add ?preview=true to any URL to inspect the live store during maintenance.
const IS_MAINTENANCE_MODE = false;

// Error boundary with clean recovery
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center bg-white">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-600 mb-4">Please refresh the page to reload the store.</p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.clear();
                window.location.href = window.location.origin + window.location.pathname;
              }
            }}
            className="px-6 py-2.5 bg-[#662654] text-white font-bold text-sm rounded-full shadow hover:bg-[#7a2e64] transition-all cursor-pointer"
          >
            Reload Store
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------- HOME PAGE ----------
const HomePage = () => (
  <main className="flex-1">
    <SEO 
      slug="home"
      url="https://www.paidhuethicalfoods.com/"
    />

    <Hero />
    <ProductCollection />
    <ExploreCategory />
    <FeaturedBento />
    <PaidhuSpotlight />
    <CustomerVideoReels />
    <RealMomsSection />
    <BrandCharactersBanner />
  </main>
);

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const isPreviewBypass = searchParams.get('preview') === 'true' || searchParams.get('admin') === 'true';

  // Scroll to top on route change (only when the path itself changes)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Track Meta Pixel PageView on route navigation (including query param updates)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname, location.search, location.key]);

  // If site is in maintenance mode and not in preview bypass, display MaintenancePage directly
  if (IS_MAINTENANCE_MODE && !isPreviewBypass) {
    return (
      <div className="w-full min-h-screen relative font-sans text-gray-800 bg-[#fcfbfa]">
        <MaintenancePage />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="w-full min-h-screen relative font-sans text-gray-800 bg-white flex flex-col">
        {/* Sticky Navigation */}
        <div className="sticky top-0 z-50 w-full shadow-lg">
          <Navbar />
        </div>

        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] bg-white text-gray-500">
              <div className="w-10 h-10 border-4 border-[#662654] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-semibold tracking-wide uppercase text-[#662654]">Loading Paidhu Store...</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/byoc" element={<BYOCPage />} />
              <Route path="/shop/build-your-box" element={<BYOCPage />} />
              <Route path="/shop/blogs" element={<BlogsPage />} />
              <Route path="/shop/:navSection" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
              <Route path="/saffron-guidance" element={<SaffronGuidancePage />} />
              <Route path="/careers" element={<CareersPage />} />
              
              {/* Direct Route Aliases to avoid any broken links */}
              <Route path="/about" element={<ShopPage navSection="about-us" />} />
              <Route path="/about-us" element={<ShopPage navSection="about-us" />} />
              <Route path="/starting-floral-food-habitat" element={<ShopPage navSection="starting-floral-food-habitat" />} />
              <Route path="/starting-solids-guide" element={<ShopPage navSection="starting-solids-guide" />} />
              <Route path="/bulk-orders" element={<ShopPage navSection="bulk-orders" />} />
              <Route path="/build-your-box" element={<BYOCPage />} />
              <Route path="/byoc" element={<BYOCPage />} />
              <Route path="/contact" element={<LegalPage type="contact-us" />} />
              <Route path="/contact-us" element={<LegalPage type="contact-us" />} />
              <Route path="/privacy-policy" element={<LegalPage type="privacy-policy" />} />
              <Route path="/privacy" element={<LegalPage type="privacy-policy" />} />
              <Route path="/terms-conditions" element={<LegalPage type="terms-conditions" />} />
              <Route path="/terms-and-conditions" element={<LegalPage type="terms-conditions" />} />
              <Route path="/terms" element={<LegalPage type="terms-conditions" />} />
              <Route path="/shipping-policy" element={<LegalPage type="shipping-policy" />} />
              <Route path="/refund-policy" element={<LegalPage type="refund-policy" />} />
              <Route path="/cancellation-policy" element={<LegalPage type="refund-policy" />} />

              <Route path="/legal/:type" element={<LegalPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/:slug" element={<BlogDetailPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/under-maintenance" element={<MaintenancePage />} />

              {/* Catch-all 404 Page */}
              <Route path="*" element={
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#fcfbfa]">
                  <span className="text-6xl font-black text-[#662654] font-serif mb-2">404</span>
                  <h1 className="text-2xl font-black text-gray-900 mb-2">Page Not Found</h1>
                  <p className="text-sm text-gray-500 max-w-md mb-6 font-semibold">
                    The page you are looking for does not exist or may have been moved.
                  </p>
                  <div className="flex gap-3">
                    <Link to="/" className="px-6 py-2.5 bg-[#662654] text-white text-xs font-extrabold rounded-full hover:bg-[#7a2e64] shadow-md transition-all">
                      Return to Home
                    </Link>
                    <Link to="/shop" className="px-6 py-2.5 bg-gray-100 text-gray-800 text-xs font-extrabold rounded-full hover:bg-gray-200 transition-all">
                      Explore Shop
                    </Link>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </ErrorBoundary>



        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
}

export default App;
