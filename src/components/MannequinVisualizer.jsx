import React, { useState } from 'react';
import { Ruler, Sparkles, Check, User, Layers, Eye, ChevronRight, Tag } from 'lucide-react';
import { PRODUCT_MAP, BLACK_MODELS } from '../data/products';
import { useShop } from '../context/ShopContext';

export default function MannequinVisualizer({
  demographic = 'men',
  worn = {},
  onSlotSelect,
  formatPrice,
  userHeight = 178,
  onHeightChange,
  userLength = 'regular',
  onLengthChange,
  userBuild = 'athletic',
  onBuildChange,
  selectedSize = 'L',
  onSizeChange,
  finish: parentFinish,
  onFinishChange,
  variant = 'full', // 'full' (with sliders in modal) | 'showcase' (sleek in Hero & Banner)
  onQuickOutfitSelect
}) {
  const { productMap } = useShop();
  const [localFinish, setLocalFinish] = useState('obsidian');
  const finish = parentFinish || localFinish;
  const setFinish = onFinishChange || setLocalFinish;

  const [showRulerGuides, setShowRulerGuides] = useState(false);
  const [activeSlotFocus, setActiveSlotFocus] = useState('top');

  // Look up equipped products using dynamic productMap
  const lookup = productMap || PRODUCT_MAP;
  const topProduct = worn.top ? lookup[worn.top] : null;
  const bottomProduct = worn.bottom ? lookup[worn.bottom] : null;
  const shoeProduct = worn.shoe ? lookup[worn.shoe] : null;
  const headProduct = worn.head ? lookup[worn.head] : null;
  const faceProduct = worn.face ? lookup[worn.face] : null;
  const bagProduct = worn.bag ? lookup[worn.bag] : null;

  const currentModel = BLACK_MODELS[demographic] || BLACK_MODELS.men;

  // Real-time body measurements (in cm)
  const heightRatio = userHeight / 175;
  const chestCm = Math.round((userBuild === 'slim' ? 92 : userBuild === 'athletic' ? 104 : userBuild === 'plus' ? 118 : 98) * heightRatio);
  const waistCm = Math.round((userBuild === 'slim' ? 74 : userBuild === 'athletic' ? 82 : userBuild === 'plus' ? 98 : 80) * heightRatio);
  const inseamCm = Math.round(userHeight * 0.465);

  // Active focused product
  const focusedProduct = 
    activeSlotFocus === 'bottom' ? bottomProduct || topProduct :
    activeSlotFocus === 'shoe' ? shoeProduct || topProduct :
    activeSlotFocus === 'head' ? headProduct || topProduct :
    activeSlotFocus === 'face' ? faceProduct || topProduct :
    activeSlotFocus === 'bag' ? bagProduct || topProduct :
    topProduct || bottomProduct || shoeProduct;

  // Determine which real mannequin / model image to show based on finish and equipped garment
  // THE MANNEQUIN IS ALWAYS WEARING CLOTHES!
  const getMannequinImage = () => {
    // 1. Black Fashion Model View
    if (finish === 'model') {
      return currentModel.image;
    }

    // 2. Sculpted White Studio Mannequin
    if (finish === 'sculpted-white') {
      return '/mannequin-white.jpg';
    }

    // 3. Studio Catalog Mannequin (from store-fitting-room.html m1, m2, m3)
    if (finish === 'studio') {
      if (topProduct?.mannequinImage) return topProduct.mannequinImage;
      if (topProduct?.garmentStyle === 'puffer' || topProduct?.id === 'hn-top-04') return '/m2.jpg';
      if (topProduct?.garmentStyle === 'denim' || topProduct?.id === 'hn-top-05') return '/m3.jpg';
      if (topProduct?.garmentStyle === 'coat' || topProduct?.id === 'hn-wtop-02') return '/m1.jpg';
      return '/m1.jpg';
    }

    // 4. Custom Mannequin / Fit image (from Admin Dashboard upload or URL):
    if (topProduct?.mannequinImage) {
      return topProduct.mannequinImage;
    }

    // 4. Default: Matte Black Boutique Mannequin wearing the HURANOW garments on glass pedestal
    if (topProduct?.garmentStyle === 'hoodie' || topProduct?.id === 'hn-top-02') {
      return '/mannequin-hoodie.jpg';
    }
    if (topProduct?.garmentStyle === 'leather' || topProduct?.id === 'hn-top-06') {
      return '/mannequin-leather.jpg';
    }
    if (topProduct?.garmentStyle === 'tee' || topProduct?.id === 'hn-top-03' || topProduct?.garmentStyle === 'croptop') {
      return '/mannequin-tee.jpg';
    }
    if (topProduct?.garmentStyle === 'puffer' || topProduct?.id === 'hn-top-04') {
      return '/m2.jpg';
    }
    if (topProduct?.garmentStyle === 'denim' || topProduct?.id === 'hn-top-05') {
      return '/m3.jpg';
    }
    if (topProduct?.garmentStyle === 'coat' || topProduct?.id === 'hn-wtop-02') {
      return '/m1.jpg';
    }

    // Default to the flagship Kigali Stealth Windrunner outfit (mannequin wearing jacket, tactical cargos & sneakers)
    return '/mannequin-windrunner.jpg';
  };

  const currentDisplayImage = getMannequinImage();

  // Curated quick outfits for instant switching
  const quickOutfits = [
    { id: 'hn-top-01', label: 'Windrunner', color: 'bg-zinc-800' },
    { id: 'hn-top-02', label: 'Stealth Hoodie', color: 'bg-zinc-800' },
    { id: 'hn-top-06', label: 'Biker Leather', color: 'bg-zinc-800' },
    { id: 'hn-top-05', label: 'Raw Denim', color: 'bg-zinc-800' },
    { id: 'hn-top-04', label: 'Down Puffer', color: 'bg-zinc-800' },
    { id: 'hn-top-03', label: 'Boxy Tee', color: 'bg-zinc-800' }
  ];

  // ========================================================
  // SHOWCASE VARIANT (Clean, sleek, decluttered for Hero & Banner)
  // ========================================================
  if (variant === 'showcase') {
    return (
      <div className="relative w-full h-full flex flex-col justify-between select-none">
        {/* Quick Outfit Switcher Bar */}
        <div className="w-full flex items-center justify-between px-3 py-2 z-20 bg-black/90 backdrop-blur-md border-b border-zinc-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-[10px] uppercase font-bold text-zinc-400 mr-1 hidden sm:inline">Look:</span>
            {quickOutfits.map((outfit) => {
              const isSelected = worn.top === outfit.id;
              return (
                <button
                  key={outfit.id}
                  onClick={() => onQuickOutfitSelect && onQuickOutfitSelect(outfit.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-white text-black shadow-lg scale-102'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {outfit.label}
                </button>
              );
            })}
          </div>

          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold whitespace-nowrap ml-2">
            Real Fit
          </span>
        </div>

        {/* Real Photographic Mannequin Display Stage */}
        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#111114] via-[#09090b] to-[#040405] p-2 min-h-[360px]">
          <div className="relative w-full h-full max-h-[460px] rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl flex items-center justify-center group">
            <img
              src={currentDisplayImage}
              alt="Real Boutique Mannequin Wearing HURANOW Clothes"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-103"
            />

            {/* Subtle Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 pointer-events-none"></div>

            {/* Clean Hotspot Badges Over Garments */}
            <div className="absolute inset-0 p-3.5 flex flex-col justify-between pointer-events-none">
              <div className="flex items-center justify-between pointer-events-auto">
                <span className="text-[10px] bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-800 text-zinc-300 font-bold">
                  {topProduct?.name || 'Kigali Stealth Windrunner'}
                </span>
                <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded-full font-black uppercase">
                  {formatPrice ? formatPrice(topProduct?.price || 68000) : 'RWF 68,000'}
                </span>
              </div>

              {/* Minimal Bottom Pill */}
              <div className="bg-black/90 backdrop-blur-md border border-zinc-800/90 px-3 py-2 rounded-xl pointer-events-auto flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] text-zinc-300 font-bold">
                    Dressed on Matte Boutique Mannequin
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  Size {selectedSize} • 178 cm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // FULL VARIANT (Used inside FittingRoomModal with full customization)
  // ========================================================
  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none">
      
      {/* Top Header: Finish Switcher & Ruler Specs Toggle */}
      <div className="w-full flex items-center justify-between px-3 py-2.5 z-30 text-[11px] bg-black/85 backdrop-blur-md border-b border-zinc-800 rounded-t-2xl">
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFinish('obsidian')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
              finish === 'obsidian'
                ? 'bg-zinc-800 text-white shadow border border-zinc-600'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Matte Black Mannequin
          </button>
          
          <button
            onClick={() => setFinish('studio')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
              finish === 'studio'
                ? 'bg-amber-500 text-black shadow border border-amber-400'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Studio Mannequin
          </button>

          <button
            onClick={() => setFinish('sculpted-white')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
              finish === 'sculpted-white'
                ? 'bg-zinc-200 text-black shadow border border-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            White Mannequin
          </button>
        </div>

        <button
          onClick={() => setShowRulerGuides(!showRulerGuides)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors shrink-0 ml-1.5 ${
            showRulerGuides
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
        >
          <Ruler className="w-3 h-3" />
          <span className="hidden sm:inline">{showRulerGuides ? 'Hide Specs' : 'Show Specs'}</span>
        </button>
      </div>

      {/* Main Mannequin Stage: Real Photographic Mannequin Wearing Clothes */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[440px] overflow-hidden bg-gradient-to-b from-[#111114] via-[#09090b] to-[#040405] p-3">
        
        {/* Overhead Retail Glow */}
        <div className="absolute top-0 w-80 h-80 bg-radial from-zinc-700/20 via-black/80 to-black blur-3xl pointer-events-none"></div>

        {/* Real Mannequin Photo Frame */}
        <div className="relative w-full h-full max-h-[480px] max-w-[340px] rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl flex items-center justify-center group">
          
          {/* Real Mannequin Photograph Wearing Clothes */}
          <img
            src={currentDisplayImage}
            alt="Real Store Mannequin Wearing Clothes"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
          />

          {/* Vignette Shadow Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

          {/* Hotspots Floating On Garments */}
          <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
            
            {/* Top Label */}
            <div className="flex items-center justify-between pointer-events-auto">
              <span className="text-[10px] bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-300 font-bold shadow-lg">
                {finish === 'obsidian' ? 'Matte Boutique Mannequin' : finish === 'studio' ? 'Studio Catalog Mannequin' : finish === 'model' ? 'Black Fashion Model' : 'Sculpted Studio Mannequin'}
              </span>

              <span className="text-[10px] bg-amber-400 text-black px-2.5 py-1 rounded-full font-black uppercase tracking-wider shadow-lg">
                {userHeight} cm • Size {selectedSize}
              </span>
            </div>

            {/* Garment Hotspots */}
            <div className="space-y-1.5 pointer-events-auto my-auto pl-1">
              {topProduct && (
                <button
                  onClick={() => {
                    setActiveSlotFocus('top');
                    if (onSlotSelect) onSlotSelect('top');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-xl transition-all ${
                    activeSlotFocus === 'top'
                      ? 'bg-white text-black border-white scale-105'
                      : 'bg-black/80 text-zinc-300 border-zinc-700 hover:border-white hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="max-w-[120px] truncate">{topProduct.name}</span>
                  <span className="text-zinc-400">{formatPrice(topProduct.price)}</span>
                </button>
              )}

              {bottomProduct && (
                <button
                  onClick={() => {
                    setActiveSlotFocus('bottom');
                    if (onSlotSelect) onSlotSelect('bottom');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-xl transition-all ${
                    activeSlotFocus === 'bottom'
                      ? 'bg-white text-black border-white scale-105'
                      : 'bg-black/80 text-zinc-300 border-zinc-700 hover:border-white hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span className="max-w-[120px] truncate">{bottomProduct.name}</span>
                  <span className="text-zinc-400">{formatPrice(bottomProduct.price)}</span>
                </button>
              )}

              {shoeProduct && (
                <button
                  onClick={() => {
                    setActiveSlotFocus('shoe');
                    if (onSlotSelect) onSlotSelect('shoe');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-xl transition-all ${
                    activeSlotFocus === 'shoe'
                      ? 'bg-white text-black border-white scale-105'
                      : 'bg-black/80 text-zinc-300 border-zinc-700 hover:border-white hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="max-w-[120px] truncate">{shoeProduct.name}</span>
                  <span className="text-zinc-400">{formatPrice(shoeProduct.price)}</span>
                </button>
              )}
            </div>

            {/* Dressed Garment Specs Card */}
            <div className="bg-black/90 backdrop-blur-md border border-zinc-800 p-2.5 rounded-xl pointer-events-auto space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="truncate max-w-[180px]">{focusedProduct?.name || 'Complete Dressed Look'}</span>
                </span>
                <span className="text-amber-400">
                  {focusedProduct ? formatPrice(focusedProduct.price) : ''}
                </span>
              </div>

              <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1 border-t border-zinc-800/80">
                <span>
                  Length Cut: <strong className="text-white uppercase">{userLength}</strong>
                </span>
                <span className="text-emerald-400 font-bold">
                  {userLength === 'crop' ? 'Sits above waist' : userLength === 'tall' ? 'Extended past hips' : 'Hits at natural hip'}
                </span>
              </div>
            </div>

          </div>

          {/* Measurement Specs Overlay */}
          {showRulerGuides && (
            <div className="absolute top-12 left-3 bottom-20 pointer-events-none flex flex-col justify-between font-mono text-[9px] font-bold z-20">
              <div className="bg-black/75 px-1.5 py-0.5 rounded text-amber-400 border border-amber-500/30">
                Height: {userHeight}cm
              </div>
              <div className="bg-black/75 px-1.5 py-0.5 rounded text-sky-400 border border-sky-500/30">
                Chest: {chestCm}cm
              </div>
              <div className="bg-black/75 px-1.5 py-0.5 rounded text-purple-400 border border-purple-500/30">
                Waist: {waistCm}cm
              </div>
              <div className="bg-black/75 px-1.5 py-0.5 rounded text-emerald-400 border border-emerald-500/30">
                Inseam: {inseamCm}cm
              </div>
            </div>
          )}

        </div>

      </div>

      {/* BOTTOM USER CUSTOMIZATION CONTROLS: HEIGHT SLIDER, LENGTH & BUILD */}
      <div className="w-full bg-[#111115] border-t border-zinc-800 p-3.5 rounded-b-2xl space-y-3 z-30">
        
        {/* Height Slider */}
        <div className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 shrink-0 font-bold">
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span>Height:</span>
          </div>

          <div className="flex-1 flex items-center gap-2">
            <input
              type="range"
              min="150"
              max="198"
              value={userHeight}
              onChange={(e) => onHeightChange && onHeightChange(Number(e.target.value))}
              className="w-full accent-amber-400 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
            />
            <span className="font-mono font-bold text-white text-xs bg-zinc-950 border border-zinc-700 px-2 py-0.5 rounded w-16 text-center">
              {userHeight} cm
            </span>
          </div>
        </div>

        {/* Garment Length Cut */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="text-zinc-400 text-[11px] font-semibold shrink-0">
            Length Cut:
          </span>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'crop', label: 'Petite / Crop' },
              { id: 'regular', label: 'Standard / Regular' },
              { id: 'tall', label: 'Tall / Longline' },
            ].map((len) => (
              <button
                key={len.id}
                onClick={() => onLengthChange && onLengthChange(len.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                  userLength === len.id
                    ? 'bg-amber-400 text-black border-amber-400 shadow'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                {len.label}
              </button>
            ))}
          </div>

          <div className="text-[10px] text-zinc-400 font-mono hidden sm:block">
            {userLength === 'crop' ? 'Above waist' : userLength === 'tall' ? 'Past hips' : 'Natural hip'}
          </div>
        </div>

        {/* Body Build Proportions */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="text-zinc-400 text-[11px] font-semibold shrink-0">
            Body Build:
          </span>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'slim', label: 'Slim' },
              { id: 'athletic', label: 'Athletic' },
              { id: 'regular', label: 'Regular' },
              { id: 'plus', label: 'Curve / Plus' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => onBuildChange && onBuildChange(b.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                  userBuild === b.id
                    ? 'bg-white text-black border-white shadow'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
            ✓ 98% Match
          </div>
        </div>

      </div>

    </div>
  );
}
