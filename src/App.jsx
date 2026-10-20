import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Header from './components/Header';
import Hero from './components/Hero';
import FittingRoomBanner from './components/FittingRoomBanner';
import ProductGrid from './components/ProductGrid';
import FittingRoomModal from './components/FittingRoomModal';
import ProductModal from './components/ProductModal';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';
import { CheckCircle2 } from 'lucide-react';

function ShopContent() {
  const { toastMessage, isToastVisible } = useShop();

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f7] flex flex-col selection:bg-white selection:text-black">
      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold transition-all duration-300 pointer-events-none ${
          isToastVisible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95'
        }`}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[3]" />
        <span>{toastMessage}</span>
      </div>

      {/* Main Layout */}
      <Header />
      <main className="flex-1">
        <Hero />
        <FittingRoomBanner />
        <ProductGrid />
      </main>
      <Footer />

      {/* Interactive Overlays */}
      <FittingRoomModal />
      <ProductModal />
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />
      <AdminModal />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <ShopContent />
    </ShopProvider>
  );
}
