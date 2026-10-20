import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Zap, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import MannequinVisualizer from './MannequinVisualizer';

export default function Hero() {
  const { 
    setIsFittingRoomOpen, 
    setActiveCategory, 
    setActiveDemographic,
    fitState,
    formatPrice,
    addEntireFitToCart
  } = useShop();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-black border-b border-[#1f1f23]">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-zinc-700 via-zinc-900 to-black blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Bold Nike Impact Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-full text-xs font-semibold text-zinc-300 w-fit mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="uppercase tracking-widest text-[11px] text-white font-bold">Pan-African Stealth • 2026</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">All Demographics</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.88] mb-6 font-display">
              BUILD THE FIT. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                BUY IT ALL.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#a1a1aa] max-w-xl font-normal leading-relaxed mb-8">
              Dress a real shop display mannequin or preview on <strong className="text-white">Black fashion models</strong> with outfits, footwear, and pure African luxury skincare for <strong className="text-white">Men</strong>, <strong className="text-white">Women</strong>, <strong className="text-white">Kids</strong>, and <strong className="text-white">Babies</strong>. Add the whole look to your bag in a single tap.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <button
                onClick={() => setIsFittingRoomOpen(true)}
                className="flex items-center gap-2.5 bg-white text-black font-extrabold px-7 py-4 rounded-full text-sm hover:bg-zinc-200 active:scale-95 transition-all shadow-xl group"
              >
                <Sparkles className="w-4 h-4 text-black group-hover:rotate-45 transition-transform" />
                <span>OPEN FITTING ROOM</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToCatalog}
                className="px-6 py-4 rounded-full border border-zinc-700 text-white font-bold text-sm hover:border-white hover:bg-zinc-900 active:scale-95 transition-all"
              >
                Shop Full Catalog
              </button>

              <button
                onClick={() => {
                  setActiveCategory('shoes');
                  scrollToCatalog();
                }}
                className="px-5 py-4 rounded-full bg-zinc-900 text-zinc-300 font-bold text-sm hover:text-white hover:bg-zinc-800 transition-all"
              >
                Footwear
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-white shrink-0" />
                <span>Fast Nationwide Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span>100% Authentic Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-white shrink-0" />
                <span>Effortless Size Exchanges</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase with LIVE INTERACTIVE MANNEQUIN STUDIO */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-700/80 bg-[#0d0d0f] shadow-2xl flex flex-col justify-between group">
              
              {/* Top Banner on Mannequin Card */}
              <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Live Mannequin Studio
                  </span>
                </div>
                <span className="text-[10px] bg-zinc-900 border border-zinc-700 text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase">
                  Dressed & Fitted
                </span>
              </div>

              {/* Live Mannequin Display Stage */}
              <div className="relative w-full aspect-[4/5] bg-gradient-to-b from-zinc-900 via-black to-[#050507] flex items-center justify-center overflow-hidden">
                <MannequinVisualizer
                  demographic="men"
                  worn={fitState?.worn || {}}
                  onSlotSelect={() => setIsFittingRoomOpen(true)}
                  formatPrice={formatPrice}
                  userHeight={178}
                  userLength="regular"
                  userBuild="athletic"
                  selectedSize={fitState?.sizes?.clothes || 'L'}
                />
              </div>

              {/* Interactive Quick Action Footer */}
              <div className="p-4 bg-zinc-950/95 border-t border-zinc-800 space-y-2.5 z-20">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-bold">Complete Matched Look</span>
                    <span className="font-bold text-white text-sm">6 Real Layered Pieces</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                    ✓ 98% Optimal Fit
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFittingRoomOpen(true)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95 uppercase tracking-wide"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span>Open Fitting Studio</span>
                  </button>

                  <button
                    onClick={addEntireFitToCart}
                    className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    title="Add all dressed pieces to bag"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Add All</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Accent Floating Badge */}
            <div className="absolute -bottom-4 -left-4 bg-zinc-900/90 border border-zinc-700 rounded-xl p-3 shadow-2xl flex items-center gap-3 backdrop-blur-md z-30">
              <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-black">
                <Zap className="w-5 h-5 fill-black" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white uppercase">Real-Time Drape</div>
                <div className="text-zinc-400 text-[11px]">Adapts to height & length</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
