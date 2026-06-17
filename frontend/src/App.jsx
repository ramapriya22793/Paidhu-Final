import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import BenefitsMarquee from './components/home/BenefitsMarquee';
import ProductCollection from './components/home/ProductCollection';
import ExploreCategory from './components/home/ExploreCategory';
import FeaturedBento from './components/home/FeaturedBento';
import PaidhuSpotlight from './components/home/PaidhuSpotlight';
import StorytellingVideo from './components/home/StorytellingVideo';
import RealMomsSection from './components/home/RealMomsSection';
import BrandCharactersBanner from './components/home/BrandCharactersBanner';
import WhatsAppButton from './components/ui/WhatsAppButton';
import TiffinModal from './components/home/TiffinModal';
import { CartProvider } from './context/CartContext';
import { motion } from 'framer-motion';

// Lazy load pages to speed up initial site rendering
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));

// ---------- HOME PAGE ----------
const HomePage = () => (
  <motion.main 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, ease: 'easeOut' }}
    className="flex-1"
  >
    <Hero />
    <ProductCollection />
    <ExploreCategory />
    <BenefitsMarquee />
    <FeaturedBento />
    <PaidhuSpotlight />
    <StorytellingVideo />
    <RealMomsSection />
    <BrandCharactersBanner />
    <TiffinModal />
  </motion.main>
);

function App() {
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
            <Route path="/shop/:navSection" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
          </Routes>
        </Suspense>

        <Footer />
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
}

export default App;
