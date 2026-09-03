import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import ProductCollection from './components/home/ProductCollection';
import WhatsAppButton from './components/ui/WhatsAppButton';
import TiffinModal from './components/home/TiffinModal';
import { CartProvider } from './context/CartContext';
import { motion } from 'framer-motion';
import SEO from './components/seo/SEO';

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
    console.error("Route chunk loading error:", error);
    const chunkFailed = error?.name === 'ChunkLoadError' || 
                        error?.message?.includes('Failed to fetch dynamically imported module') ||
                        error?.message?.includes('Importing a module script failed');
    if (chunkFailed) {
      const hasReloaded = sessionStorage.getItem('chunk_reload_retry');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_reload_retry', 'true');
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center bg-white">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Updating Store App...</h2>
          <p className="text-sm text-gray-600 mb-4">Refreshing to load the latest version.</p>
          <button
            onClick={() => {
              sessionStorage.removeItem('chunk_reload_retry');
              window.location.reload();
            }}
            className="px-5 py-2.5 bg-[#662654] text-white font-bold text-sm rounded-full shadow hover:bg-[#7a2e64] transition-all cursor-pointer"
          >
            Refresh Now
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
      console.warn("Lazy import failed, attempting auto reload...", err);
      const hasReloaded = sessionStorage.getItem('chunk_reload_retry');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_reload_retry', 'true');
        window.location.reload();
        return new Promise(() => {});
      }
      sessionStorage.removeItem('chunk_reload_retry');
      throw err;
    })
  );
};

// Safe Lazy load pages to speed up initial site rendering
const ShopPage = safeLazy(() => import('./pages/ShopPage'));
const ProductDetailPage = safeLazy(() => import('./pages/ProductDetailPage'));
const CheckoutPage = safeLazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = safeLazy(() => import('./pages/OrderSuccessPage'));
const SaffronGuidancePage = safeLazy(() => import('./pages/SaffronGuidancePage'));
const BYOCPage = safeLazy(() => import('./pages/BYOCPage'));
const LegalPage = safeLazy(() => import('./pages/LegalPage'));
const CareersPage = safeLazy(() => import('./pages/CareersPage'));
const BlogsPage = safeLazy(() => import('./pages/BlogsPage'));
const BlogDetailPage = safeLazy(() => import('./pages/BlogDetailPage'));
const MaintenancePage = safeLazy(() => import('./pages/MaintenancePage'));

// Safe Lazy load below-the-fold home components
const ExploreCategory = safeLazy(() => import('./components/home/ExploreCategory'));
const BenefitsMarquee = safeLazy(() => import('./components/home/BenefitsMarquee'));
const FeaturedBento = safeLazy(() => import('./components/home/FeaturedBento'));
const PaidhuSpotlight = safeLazy(() => import('./components/home/PaidhuSpotlight'));
const StorytellingVideo = safeLazy(() => import('./components/home/StorytellingVideo'));
const RealMomsSection = safeLazy(() => import('./components/home/RealMomsSection'));
const BrandCharactersBanner = safeLazy(() => import('./components/home/BrandCharactersBanner'));


// ---------- HOME PAGE ----------
const HomePage = () => (
  <motion.main 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, ease: 'easeOut' }}
    className="flex-1"
  >
    <SEO 
      slug="home"
      url="https://www.paidhuethicalfoods.com/"
    />

    <Hero />
    <ProductCollection />
    
    <Suspense fallback={null}>
      <ExploreCategory />
      <FeaturedBento />
      <PaidhuSpotlight />
      <StorytellingVideo />
      <RealMomsSection />
      <BrandCharactersBanner />
    </Suspense>

  </motion.main>
);

function App() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const isMaintenanceRoute = location.pathname === '/maintenance' || location.pathname === '/under-maintenance';

  return (
    <CartProvider>
      <div className="w-full min-h-screen relative font-sans text-gray-800 bg-white flex flex-col">
        {/* Sticky Navigation */}
        {!isMaintenanceRoute && (
          <div className="sticky top-0 z-50 w-full shadow-lg">
            <Navbar />
          </div>
        )}

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
              <Route path="/bulk-orders" element={<ShopPage navSection="bulk-orders" />} />
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
              <Route path="/journal" element={<BlogsPage />} />

              {/* Maintenance Routes */}
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

        {!isMaintenanceRoute && <Footer />}
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
}

export default App;
