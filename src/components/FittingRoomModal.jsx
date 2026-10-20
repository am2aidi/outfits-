import React, { useState } from 'react';
import { X, Sparkles, ShoppingBag, Check, RotateCcw, User, Layers, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { 
  PRODUCTS, 
  PRODUCT_MAP, 
  FITTING_SLOTS, 
  BLACK_MODELS, 
  SIZE_SYSTEM 
} from '../data/products';
import MannequinVisualizer from './MannequinVisualizer';

export default function FittingRoomModal() {
  const {
    isFittingRoomOpen,
    setIsFittingRoomOpen,
    fitState,
    setFitState,
    setFitDemographic,
    equipFitItem,
    clearFit,
    addEntireFitToCart,
    formatPrice
  } = useShop();

  // View mode: 'mannequin' (store display mannequin that wears clothes) or 'model' (real Black fashion model)
  const [viewMode, setViewMode] = useState('mannequin');

  if (!isFittingRoomOpen) return null;

  const currentDemographic = fitState.demographic;
  const currentModel = BLACK_MODELS[currentDemographic] || BLACK_MODELS.men;
  const currentSlot = fitState.slot;
  const wornItems = fitState.worn;

  // Filter products for the chosen slot and demographic
  const availableSlotProducts = PRODUCTS.filter(p => {
    const matchesDemographic = p.demographic === currentDemographic || p.demographic === 'unisex';
    const matchesSlot = p.slot === currentSlot;
    return matchesDemographic && matchesSlot;
  });

  // Calculate equipped pieces and total cost
  const equippedIds = Object.values(wornItems).filter(Boolean);
  const equippedCount = equippedIds.length;
  const totalSlots = FITTING_SLOTS.length;
  const fitTotal = equippedIds.reduce((sum, id) => {
    const prod = PRODUCT_MAP[id];
    return sum + (prod ? prod.price : 0);
  }, 0);

  const isCompleteFit = equippedCount >= 4;
  const currentSizes = SIZE_SYSTEM[currentDemographic] || SIZE_SYSTEM.men;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#0c0c0e] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white text-black rounded-xl">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-display tracking-tight flex items-center gap-2">
                HURANOW FITTING STUDIO
                <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Fit, Wear, Buy
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Dress the shop mannequin or preview on Black fashion models, then purchase the complete look.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFittingRoomOpen(false)}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Column: Mannequin Stage / Black Model Stage */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#141418] via-[#0d0d0f] to-[#070708] p-5 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-zinc-800 relative min-h-[480px]">
            
            {/* Top Controls: Demographics & View Mode Switcher */}
            <div className="w-full flex flex-col gap-2 z-10">
              
              {/* Demographics Switching Pills */}
              <div className="w-full flex items-center justify-center gap-1 bg-zinc-950/90 border border-zinc-800 p-1 rounded-full">
                {[
                  { id: 'men', label: 'Men' },
                  { id: 'women', label: 'Women' },
                  { id: 'kids', label: 'Kids' },
                  { id: 'baby', label: 'Baby' },
                ].map(demo => (
                  <button
                    key={demo.id}
                    onClick={() => setFitDemographic(demo.id)}
                    className={`flex-1 py-1 text-xs font-bold rounded-full transition-all ${
                      currentDemographic === demo.id
                        ? 'bg-white text-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {demo.label}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle: [ Mannequin that wears clothes ] vs [ Black Fashion Model ] */}
              <div className="w-full flex items-center justify-center gap-1 bg-black/60 border border-zinc-800/80 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setViewMode('mannequin')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md font-bold transition-all ${
                    viewMode === 'mannequin'
                      ? 'bg-zinc-800 text-white border border-zinc-600 shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Shop Mannequin</span>
                </button>

                <button
                  onClick={() => setViewMode('model')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md font-bold transition-all ${
                    viewMode === 'model'
                      ? 'bg-zinc-800 text-white border border-zinc-600 shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Black Fashion Model</span>
                </button>
              </div>

            </div>

            {/* STAGE CONTAINER */}
            <div className="w-full flex-1 flex items-center justify-center relative my-2">
              
              {viewMode === 'mannequin' ? (
                /* 1. SHOP DISPLAY MANNEQUIN (PHYSICALLY WEARS SELECTED GARMENTS) */
                <MannequinVisualizer
                  demographic={currentDemographic}
                  worn={wornItems}
                  onSlotSelect={(slot) => setFitState(prev => ({ ...prev, slot }))}
                  formatPrice={formatPrice}
                />
              ) : (
                /* 2. REAL BLACK FASHION MODEL PHOTOGRAPHY */
                <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl flex items-center justify-center group">
                  <img
                    src={currentModel.image}
                    alt={currentModel.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"></div>

                  {/* Model Bio Pill */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-700 text-[10px] text-zinc-300">
                    <strong className="text-white">{currentModel.name}</strong> • {currentModel.height}
                  </div>

                  {/* Garment overlay badges on Model */}
                  <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md border border-zinc-700 p-2.5 rounded-xl space-y-1">
                    <div className="text-[11px] font-bold text-white flex items-center justify-between">
                      <span>Equipped Look</span>
                      <span className="text-amber-400">{equippedCount} Pieces Fitted</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      {currentModel.size}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Reset Mannequin Button */}
            <button
              onClick={clearFit}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors pt-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Look & Reset</span>
            </button>
          </div>

          {/* Right Column: Wardrobe Tray & Sizing */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-[#0e0e11]">
            
            <div>
              {/* Category Slot Pills (Top, Bottom, Footwear, Headwear, Eyewear, Bag) */}
              <div className="mb-4">
                <span className="text-xs uppercase font-extrabold tracking-wider text-zinc-400 block mb-2">
                  Select Wardrobe Slot
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {FITTING_SLOTS.map(slot => {
                    const isEquipped = Boolean(wornItems[slot.id]);
                    const isSelected = currentSlot === slot.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setFitState(prev => ({ ...prev, slot: slot.id }))}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-lg'
                            : isEquipped
                            ? 'bg-zinc-800 text-white border-zinc-600'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        <span>{slot.label}</span>
                        {isEquipped && (
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-black' : 'bg-amber-400'}`}></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Items Tray for Active Slot */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400 font-medium">
                    Available {currentSlot.toUpperCase()} options ({availableSlotProducts.length}):
                  </span>
                  <span className="text-[11px] text-zinc-500">Tap to dress / remove from mannequin</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {availableSlotProducts.map(product => {
                    const isWorn = wornItems[currentSlot] === product.id;
                    return (
                      <button
                        key={product.id}
                        onClick={() => equipFitItem(currentSlot, product.id)}
                        className={`group relative text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                          isWorn
                            ? 'bg-zinc-800 border-white ring-2 ring-white/20'
                            : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        {/* Thumbnail image */}
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-zinc-950 mb-2 relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {isWorn && (
                            <div className="absolute top-1.5 right-1.5 bg-white text-black rounded-full p-1 shadow-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                          {product.origin && (
                            <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] text-zinc-300 font-bold uppercase">
                              {product.origin}
                            </div>
                          )}
                        </div>

                        {/* Title & Price */}
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{product.name}</h4>
                          <span className="text-xs font-semibold text-zinc-300">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {availableSlotProducts.length === 0 && (
                    <div className="col-span-full py-8 text-center text-xs text-zinc-500 bg-zinc-950 rounded-xl border border-dashed border-zinc-800">
                      No products found for this slot in {currentDemographic} demographic.
                    </div>
                  )}
                </div>
              </div>

              {/* Sizing Controls for the Whole Look */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 mb-5">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span>Selected Fit Sizing</span>
                  <span className="text-[11px] text-zinc-500 font-normal">Applies to all fitted pieces</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Clothes Size */}
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Apparel / Clothes Size</label>
                    <select
                      value={fitState.sizes.clothes}
                      onChange={(e) =>
                        setFitState(prev => ({
                          ...prev,
                          sizes: { ...prev.sizes, clothes: e.target.value }
                        }))
                      }
                      className="w-full bg-[#161619] border border-zinc-700 text-white rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-white cursor-pointer"
                    >
                      {currentSizes.clothes.map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>

                  {/* Shoe Size */}
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Footwear / Shoe Size (EU)</label>
                    <select
                      value={fitState.sizes.shoes}
                      onChange={(e) =>
                        setFitState(prev => ({
                          ...prev,
                          sizes: { ...prev.sizes, shoes: e.target.value }
                        }))
                      }
                      className="w-full bg-[#161619] border border-zinc-700 text-white rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-white cursor-pointer"
                    >
                      {currentSizes.shoes.map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Summary Bar & Add Entire Look to Cart */}
            <div className="pt-4 border-t border-zinc-800">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400 font-medium">
                  {equippedCount} of {totalSlots} pieces dressed
                </span>
                <span className={isCompleteFit ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                  {isCompleteFit ? '★ Look Complete' : 'Dress the mannequin'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-white transition-all duration-300"
                  style={{ width: `${(equippedCount / totalSlots) * 100}%` }}
                ></div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={addEntireFitToCart}
                  disabled={equippedCount === 0}
                  className="flex-1 bg-white text-black font-extrabold py-3.5 px-6 rounded-full text-xs sm:text-sm hover:bg-zinc-200 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none shadow-xl uppercase tracking-wider"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    ADD ENTIRE OUTFIT TO BAG {fitTotal > 0 && `• ${formatPrice(fitTotal)}`}
                  </span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
