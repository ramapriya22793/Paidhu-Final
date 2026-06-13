import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import BenefitsMarquee from './components/home/BenefitsMarquee';
import ProductCollection from './components/home/ProductCollection';
import ExploreCategory from './components/home/ExploreCategory';
import FeaturedBento from './components/home/FeaturedBento';
import PaidhuSpotlight from './components/home/PaidhuSpotlight';
import BrandCharactersBanner from './components/home/BrandCharactersBanner';
import StorytellingVideo from './components/home/StorytellingVideo';
import RealMomsSection from './components/home/RealMomsSection';
import WhatsAppButton from './components/ui/WhatsAppButton';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import { CartProvider } from './context/CartContext';


import { motion } from 'framer-motion';

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

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:navSection" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
        </Routes>

        <Footer />
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
}

export default App;
