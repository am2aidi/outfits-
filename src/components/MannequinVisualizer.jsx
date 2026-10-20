import React, { useState } from 'react';
import { Ruler, Sparkles, Check, User, Layers, Eye, ChevronRight, Tag } from 'lucide-react';
import { PRODUCT_MAP, BLACK_MODELS } from '../data/products';

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
  onFinishChange
}) {
  // Mannequin finish / view mode:
  // 'obsidian': Real Matte Black Mannequin on Glass Pedestal (from uploaded photo 2)
  // 'studio': Real Studio Catalog Mannequin wearing the clothes (from store-fitting-room.html m1, m2, m3)
  // 'model': Real Black Fashion Model (Kofi, Amina, Jidenna, Baby Zuri)
  // 'sculpted-white': Athletic Sculpted White Mannequin (from uploaded photo 1)
  const [localFinish, setLocalFinish] = useState('obsidian');
  const finish = parentFinish || localFinish;
  const setFinish = onFinishChange || setLocalFinish;

  const [showRulerGuides, setShowRulerGuides] = useState(true);
  const [activeSlotFocus, setActiveSlotFocus] = useState('top'); // 'top' | 'bottom' | 'shoe' | 'head' | 'face' | 'bag' | 'all'

  // Look up equipped products
  const topProduct = worn.top ? PRODUCT_MAP[worn.top] : null;
  const bottomProduct = worn.bottom ? PRODUCT_MAP[worn.bottom] : null;
  const shoeProduct = worn.shoe ? PRODUCT_MAP[worn.shoe] : null;
  const headProduct = worn.head ? PRODUCT_MAP[worn.head] : null;
  const faceProduct = worn.face ? PRODUCT_MAP[worn.face] : null;
  const bagProduct = worn.bag ? PRODUCT_MAP[worn.bag] : null;

  const currentModel = BLACK_MODELS[demographic] || BLACK_MODELS.men;

  // Real-time anatomical body measurements (in cm)
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
  const getMannequinImage = () => {
    // 1. Black Fashion Model View
    if (finish === 'model') {
      return currentModel.image;
    }

    // 2. Sculpted White Mannequin View (from user's uploaded photo 1)
    if (finish === 'sculpted-white') {
      return '/mannequin-white.jpg';
    }

    // 3. Studio Catalog Mannequin View (from store-fitting-room.html m1, m2, m3)
    if (finish === 'studio') {
      if (topProduct?.garmentStyle === 'puffer') return '/m2.jpg';
      if (topProduct?.garmentStyle === 'denim') return '/m3.jpg';
      if (topProduct?.garmentStyle === 'coat') return '/m1.jpg';
      return '/m1.jpg';
    }

    // 4. Default: Matte Obsidian Mannequin (from user's uploaded photo 2)
    // When specific pieces are worn, show the real mannequin wearing that garment:
    if (topProduct?.garmentStyle === 'puffer') return '/m2.jpg';
    if (topProduct?.garmentStyle === 'denim') return '/m3.jpg';
    if (topProduct?.garmentStyle === 'coat') return '/m1.jpg';
    
    // For Windrunner or other tops, if focused on shoes or bottoms:
    if (activeSlotFocus === 'shoe' && shoeProduct?.image) return shoeProduct.image;
    if (activeSlotFocus === 'bottom' && bottomProduct?.image) return bottomProduct.image;

    return '/mannequin-stealth-black.jpg';
  };

  const currentDisplayImage = getMannequinImage();

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none">
      
      {/* Top Header: Real Mannequin Finish Switcher & Measurements Toggle */}
      <div className="w-full flex items-center justify-between px-3 py-2 z-30 text-[11px] bg-black/85 backdrop-blur-md border-b border-zinc-800 rounded-t-2xl">
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
            onClick={() => setFinish('model')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
              finish === 'model'
                ? 'bg-white text-black shadow border border-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Black Model
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

      {/* Main Mannequin Stage: Real High-Fashion Photographic Mannequin Wearing Clothes */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[460px] overflow-hidden bg-gradient-to-b from-[#111114] via-[#09090b] to-[#040405] p-3">
        
        {/* Overhead Ambient Retail Light */}
        <div className="absolute top-0 w-80 h-80 bg-radial from-zinc-700/20 via-black/80 to-black blur-3xl pointer-events-none"></div>

        {/* Real Mannequin Photo Container */}
        <div className="relative w-full h-full max-h-[480px] max-w-[340px] rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl flex items-center justify-center group">
          
          {/* Real Mannequin Photograph */}
          <img
            src={currentDisplayImage}
            alt="Real Store Mannequin Wearing Clothes"
            className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-102"
          />

          {/* Vignette Shadow Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

          {/* ======================================================== */}
          {/* INTERACTIVE HOTSPOT PINS ON THE REAL MANNEQUIN'S BODY    */}
          {/* ======================================================== */}
          <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
            
            {/* Top Label */}
            <div className="flex items-center justify-between pointer-events-auto">
              <span className="text-[10px] bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-300 font-bold shadow-lg">
                {finish === 'obsidian' ? 'Matte Obsidian Boutique Sculpt' : finish === 'studio' ? 'Studio Catalog Mannequin' : finish === 'model' ? 'Black Fashion Model' : 'Sculpted White Studio Mannequin'}
              </span>

              <span className="text-[10px] bg-amber-400 text-black px-2.5 py-1 rounded-full font-black uppercase tracking-wider shadow-lg">
                {userHeight} cm • Size {selectedSize}
              </span>
            </div>

            {/* Middle Hotspots Floating on Garments */}
            <div className="space-y-2 pointer-events-auto my-auto pl-1">
              {/* Top / Outerwear Pin */}
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
                  <span className="max-w-[130px] truncate">{topProduct.name}</span>
                  <span className="text-zinc-400">{formatPrice(topProduct.price)}</span>
                </button>
              )}

              {/* Bottoms Pin */}
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
                  <span className="max-w-[130px] truncate">{bottomProduct.name}</span>
                  <span className="text-zinc-400">{formatPrice(bottomProduct.price)}</span>
                </button>
              )}

              {/* Shoes Pin */}
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
                  <span className="max-w-[130px] truncate">{shoeProduct.name}</span>
                  <span className="text-zinc-400">{formatPrice(shoeProduct.price)}</span>
                </button>
              )}
            </div>

            {/* Bottom Card on Mannequin: Dressed Garment Specs & Length Drape */}
            <div className="bg-black/90 backdrop-blur-md border border-zinc-800 p-3 rounded-xl pointer-events-auto space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{focusedProduct?.name || 'Complete Dressed Look'}</span>
                </span>
                <span className="text-amber-400">
                  {focusedProduct ? formatPrice(focusedProduct.price) : ''}
                </span>
              </div>

              {/* Length Drape & Height Fit Note */}
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

          {/* ======================================================== */}
          {/* MEASUREMENT RULER GUIDES OVERLAY (SHOWS REAL BODY SPECS) */}
          {/* ======================================================== */}
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

        {/* Garment Length Cut (Petite/Crop vs Standard vs Tall) */}
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
