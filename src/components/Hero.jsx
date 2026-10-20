import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Hero() {
  const { setIsFittingRoomOpen, setActiveCategory, setActiveDemographic } = useShop();

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

          {/* Right Column: Hero Visual Showcase with Interactive Fit Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-[#0d0d0f] shadow-2xl group">
              {/* Product Background Image */}
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=85"
                  alt="HURANOW Stealth Matrix Runner"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                {/* Floating "Try on Mannequin" Interactive Tag */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-zinc-700 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-[11px] font-bold text-white tracking-wide uppercase">Interactive Mannequin Ready</span>
                </div>

                {/* Card Bottom Details */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1">
                    Signature Drop · Carbon Series
                  </div>
                  <h3 className="text-2xl font-black uppercase text-white font-display mb-2">
                    HURANOW Matrix Carbon Runner 01
                  </h3>
                  <p className="text-xs text-zinc-300 line-clamp-2 mb-4">
                    Ultra-responsive propulsion plate paired with aerodynamic micro-knit upper in matte stealth finish.
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                    <div>
                      <span className="text-xs text-zinc-400 block">Price</span>
                      <span className="text-lg font-black text-white">RWF 110,000</span>
                    </div>

                    <button
                      onClick={() => setIsFittingRoomOpen(true)}
                      className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-zinc-200 transition-transform active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Try on Mannequin</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Accent Floating Badge */}
            <div className="absolute -bottom-4 -left-4 bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-xl flex items-center gap-3 backdrop-blur-md">
              <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-black">
                <Zap className="w-5 h-5 fill-black" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white uppercase">6-Piece Complete Fit</div>
                <div className="text-zinc-400 text-[11px]">Mix & Match in 1 click</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
