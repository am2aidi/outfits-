import React from 'react';
import { X, Sparkles, ShoppingBag, Check, Trash2, RotateCcw, Info } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { 
  PRODUCTS, 
  PRODUCT_MAP, 
  DEMOGRAPHICS, 
  FITTING_SLOTS, 
  MANNEQUINS, 
  SIZE_SYSTEM 
} from '../data/products';

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

  if (!isFittingRoomOpen) return null;

  const currentDemographic = fitState.demographic;
  const currentMannequin = MANNEQUINS[currentDemographic] || MANNEQUINS.men;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#0c0c0e] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white text-black rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-display tracking-tight flex items-center gap-2">
                HURANOW FITTING STUDIO
                <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Live Mannequin
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Fit real garments on the model, configure your sizes, and purchase the complete look.
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
          
          {/* Left Column: Real Model / Mannequin Stage */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#141418] via-[#0d0d0f] to-[#070708] p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-800 relative min-h-[460px]">
            
            {/* Demographic Switching Pills */}
            <div className="w-full flex items-center justify-center gap-1.5 mb-4 bg-zinc-950/80 border border-zinc-800 p-1 rounded-full z-10">
              {[
                { id: 'men', label: 'Men' },
                { id: 'women', label: 'Women' },
                { id: 'kids', label: 'Kids' },
                { id: 'baby', label: 'Baby' },
              ].map(demo => (
                <button
                  key={demo.id}
                  onClick={() => setFitDemographic(demo.id)}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                    currentDemographic === demo.id
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {demo.label}
                </button>
              ))}
            </div>

            {/* Stage: Interactive Mannequin with Real Product Overlay Layers */}
            <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl flex items-center justify-center">
              
              {/* Base Real Model Image */}
              <img
                src={currentMannequin.baseImage}
                alt={currentMannequin.name}
                className="w-full h-full object-cover object-top opacity-85 transition-opacity duration-300"
              />

              {/* Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>

              {/* Equipped Items Floating Tags on Mannequin */}
              <div className="absolute inset-0 p-3 pointer-events-none flex flex-col justify-between">
                
                {/* Top tags: Head & Face */}
                <div className="flex justify-between items-start">
                  {wornItems.head && (
                    <div className="bg-black/90 border border-zinc-700 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white flex items-center gap-1.5 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span className="font-semibold truncate max-w-[110px]">{PRODUCT_MAP[wornItems.head]?.name}</span>
                    </div>
                  )}

                  {wornItems.face && (
                    <div className="bg-black/90 border border-zinc-700 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white flex items-center gap-1.5 shadow-lg ml-auto">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span className="font-semibold truncate max-w-[110px]">{PRODUCT_MAP[wornItems.face]?.name}</span>
                    </div>
                  )}
                </div>

                {/* Middle tags: Top & Bag */}
                <div className="flex justify-between items-center my-auto">
                  {wornItems.top && (
                    <div className="bg-black/90 border border-white/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white flex items-center gap-1.5 shadow-xl">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <div>
                        <div className="font-bold truncate max-w-[120px]">{PRODUCT_MAP[wornItems.top]?.name}</div>
                        <div className="text-[9px] text-zinc-400">{formatPrice(PRODUCT_MAP[wornItems.top]?.price)}</div>
                      </div>
                    </div>
                  )}

                  {wornItems.bag && (
                    <div className="bg-black/90 border border-zinc-700 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white flex items-center gap-1.5 shadow-lg ml-auto">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                      <span className="font-semibold truncate max-w-[100px]">{PRODUCT_MAP[wornItems.bag]?.name}</span>
                    </div>
                  )}
                </div>

                {/* Bottom tags: Pants & Shoes */}
                <div className="flex flex-col gap-1.5">
                  {wornItems.bottom && (
                    <div className="bg-black/90 border border-zinc-700 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white flex items-center gap-1.5 shadow-lg w-fit">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="font-semibold truncate max-w-[140px]">{PRODUCT_MAP[wornItems.bottom]?.name}</span>
                    </div>
                  )}

                  {wornItems.shoe && (
                    <div className="bg-black/90 border border-amber-500/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white flex items-center gap-1.5 shadow-xl w-fit">
                      <Check className="w-3 h-3 text-amber-400" />
                      <div>
                        <span className="font-bold truncate max-w-[140px] block">{PRODUCT_MAP[wornItems.shoe]?.name}</span>
                        <span className="text-[9px] text-zinc-400">{formatPrice(PRODUCT_MAP[wornItems.shoe]?.price)}</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Model Specification Info */}
              <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-zinc-400">
                Model: <span className="text-white font-medium">{currentMannequin.name}</span> ({currentMannequin.height})
              </div>
            </div>

            {/* Reset Mannequin Button */}
            <button
              onClick={clearFit}
              className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Current Look</span>
            </button>
          </div>

          {/* Right Column: Wardrobe Tray & Configuration */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-[#0e0e11]">
            
            <div>
              {/* Category Slot Pills (Top, Bottom, Shoes, Headwear, Face, Bag) */}
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
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
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
                  <span className="text-[11px] text-zinc-500">Tap an item to equip / remove</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {availableSlotProducts.map(product => {
                    const isWorn = wornItems[currentSlot] === product.id;
                    return (
                      <button
                        key={product.id}
                        onClick={() => equipFitItem(currentSlot, product.id)}
                        className={`group relative text-left p-2 rounded-xl border transition-all flex flex-col justify-between ${
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
                  <span className="text-[11px] text-zinc-500 font-normal">Auto-applies to all fitted pieces</span>
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
                  {equippedCount} of {totalSlots} pieces equipped
                </span>
                <span className={isCompleteFit ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                  {isCompleteFit ? '★ Outfit Complete' : 'Build full synergy'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-white transition-all duration-300"
                  style={{ width: `${(equippedCount / totalSlots) * 100}%` }}
                ></div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={addEntireFitToCart}
                  disabled={equippedCount === 0}
                  className="flex-1 bg-white text-black font-extrabold py-3.5 px-6 rounded-full text-sm hover:bg-zinc-200 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none shadow-xl"
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
