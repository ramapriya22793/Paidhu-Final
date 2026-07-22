import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import ProductCollection from './components/home/ProductCollection';
import WhatsAppButton from './components/ui/WhatsAppButton';
import TiffinModal from './components/home/TiffinModal';
import { CartProvider } from './context/CartContext';
import { motion } from 'framer-motion';
import SEO from './components/seo/SEO';

// Lazy load pages to speed up initial site rendering
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const SaffronGuidancePage = lazy(() => import('./pages/SaffronGuidancePage'));
const BYOCPage = lazy(() => import('./pages/BYOCPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));


// Lazy load below-the-fold home components
const ExploreCategory = lazy(() => import('./components/home/ExploreCategory'));
const BenefitsMarquee = lazy(() => import('./components/home/BenefitsMarquee'));
const FeaturedBento = lazy(() => import('./components/home/FeaturedBento'));
const PaidhuSpotlight = lazy(() => import('./components/home/PaidhuSpotlight'));
const StorytellingVideo = lazy(() => import('./components/home/StorytellingVideo'));
const RealMomsSection = lazy(() => import('./components/home/RealMomsSection'));
const BrandCharactersBanner = lazy(() => import('./components/home/BrandCharactersBanner'));

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
      url="https://paidhu.com/"
    />
    <Hero />
    <ProductCollection />
    
    <Suspense fallback={null}>
      <ExploreCategory />
      <BenefitsMarquee />
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

  // Removed redirect logic as it breaks deep links and SEO

  return (
    <CartProvider>
      <div className="w-full min-h-screen relative font-sans text-gray-800 bg-white flex flex-col">
        {/* Sticky Navigation */}
        <div className="sticky top-0 z-50 w-full shadow-lg">
          <Navbar />
        </div>

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
            <Route path="/shop/:navSection" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
            <Route path="/saffron-guidance" element={<SaffronGuidancePage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/legal/:type" element={<LegalPage />} />

          </Routes>
        </Suspense>

        <Footer />
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
}

export default App;
