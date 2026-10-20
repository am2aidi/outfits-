import React, { useState } from 'react';
import { 
  Sparkles, 
  Ruler, 
  Eye, 
  Layers, 
  Check, 
  Sliders, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { PRODUCT_MAP } from '../data/products';

export default function MannequinVisualizer({ 
  demographic, 
  worn, 
  onSlotSelect, 
  formatPrice,
  userHeight = 178,
  onHeightChange,
  userBuild = 'athletic',
  onBuildChange,
  selectedSize = 'L'
}) {
  // Mannequin Photo Model Choice: 'stealth-black' (uploaded photo 2) or 'sculpted-white' (uploaded photo 1)
  const [mannequinPhoto, setMannequinPhoto] = useState('stealth-black');
  const [showMeasurements, setShowMeasurements] = useState(true);

  // Look up equipped products
  const topProduct = worn.top ? PRODUCT_MAP[worn.top] : null;
  const bottomProduct = worn.bottom ? PRODUCT_MAP[worn.bottom] : null;
  const shoeProduct = worn.shoe ? PRODUCT_MAP[worn.shoe] : null;
  const headProduct = worn.head ? PRODUCT_MAP[worn.head] : null;
  const faceProduct = worn.face ? PRODUCT_MAP[worn.face] : null;
  const bagProduct = worn.bag ? PRODUCT_MAP[worn.bag] : null;

  // Compute morphological scaling based on height and body build
  const heightScale = userHeight / 175; // Baseline 175cm
  const widthScale = 
    userBuild === 'slim' ? 0.94 : 
    userBuild === 'athletic' ? 1.05 : 
    userBuild === 'plus' ? 1.15 : 1.0;

  // Image source based on selection
  const mannequinImgSrc = 
    mannequinPhoto === 'stealth-black' 
      ? '/mannequin-stealth-black.jpg' 
      : '/mannequin-white.jpg';

  // Derived fit measurements based on user length and build
  const chestCm = Math.round((userBuild === 'slim' ? 94 : userBuild === 'athletic' ? 104 : userBuild === 'plus' ? 116 : 98) * (heightScale * 0.98));
  const waistCm = Math.round((userBuild === 'slim' ? 76 : userBuild === 'athletic' ? 82 : userBuild === 'plus' ? 96 : 80) * (heightScale * 0.98));
  const inseamCm = Math.round(userHeight * 0.46);

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none">
      
      {/* Top Studio Controls: Switch Mannequin Type & Measurement Guides */}
      <div className="w-full flex items-center justify-between px-3 pt-2 pb-1 z-30 text-[11px] bg-black/60 backdrop-blur-md border-b border-zinc-800/80 rounded-t-2xl">
        {/* Toggle Real Mannequin Photo */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-0.5 rounded-lg">
          <button
            onClick={() => setMannequinPhoto('stealth-black')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              mannequinPhoto === 'stealth-black'
                ? 'bg-zinc-800 text-white shadow border border-zinc-600'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Stealth Black Mannequin
          </button>

          <button
            onClick={() => setMannequinPhoto('sculpted-white')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              mannequinPhoto === 'sculpted-white'
                ? 'bg-zinc-800 text-white shadow border border-zinc-600'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Athletic White Mannequin
          </button>
        </div>

        {/* Toggle Measurement Overlay */}
        <button
          onClick={() => setShowMeasurements(!showMeasurements)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
            showMeasurements
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
        >
          <Ruler className="w-3 h-3" />
          <span>{showMeasurements ? 'Hide Specs' : 'Body Specs'}</span>
        </button>
      </div>

      {/* Main Mannequin Stage with Real Photo & Real Garment Overlays */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[460px] overflow-hidden p-2">
        
        {/* Stage Pedestal Spotlight Glow */}
        <div className="absolute inset-0 bg-radial from-zinc-800/20 via-black/80 to-black pointer-events-none"></div>

        {/* Morphing Mannequin Container scaled by User Height & Width Build */}
        <div 
          className="relative w-full max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 flex items-center justify-center bg-black border border-zinc-800/60"
          style={{
            transform: `scaleY(${Math.min(1.08, Math.max(0.92, heightScale))}) scaleX(${Math.min(1.15, Math.max(0.9, widthScale))})`
          }}
        >
          {/* REAL STORE MANNEQUIN PHOTOGRAPHY (from user uploaded photos) */}
          <img
            src={mannequinImgSrc}
            alt="Real Shop Display Mannequin"
            className="w-full h-full object-cover object-center filter contrast-105 brightness-95"
          />

          {/* Vignette / Studio Lighting Shading */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none"></div>

          {/* ======================================================== */}
          {/* REAL GARMENT WEAR OVERLAYS ON THE MANNEQUIN BODY         */}
          {/* ======================================================== */}

          {/* 1. TOP / JACKET / HOODIE (ON TORSO & ARMS) */}
          {topProduct && (
            <div 
              onClick={() => onSlotSelect('top')}
              className="absolute top-[21%] left-[16%] right-[16%] h-[32%] z-20 cursor-pointer group flex items-center justify-center transition-all hover:scale-[1.02]"
              title={`Fitted: ${topProduct.name}`}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/40 shadow-2xl bg-black/50 backdrop-blur-xs">
                <img
                  src={topProduct.fitImage || topProduct.image}
                  alt={topProduct.name}
                  className="w-full h-full object-cover object-top opacity-95 group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                
                {/* Worn Item Mini Badge */}
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-white font-bold">
                  <span className="truncate max-w-[130px]">{topProduct.name}</span>
                  <span className="text-emerald-400">{selectedSize}</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. BOTTOM / PANTS / CARGOS / SKIRT (ON LEGS) */}
          {bottomProduct && (
            <div 
              onClick={() => onSlotSelect('bottom')}
              className="absolute top-[50%] left-[24%] right-[24%] h-[36%] z-20 cursor-pointer group flex items-center justify-center transition-all hover:scale-[1.02]"
              title={`Fitted: ${bottomProduct.name}`}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/40 shadow-2xl bg-black/50 backdrop-blur-xs">
                <img
                  src={bottomProduct.fitImage || bottomProduct.image}
                  alt={bottomProduct.name}
                  className="w-full h-full object-cover object-top opacity-95 group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                {/* Worn Item Mini Badge */}
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[9px] bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-white font-bold">
                  <span className="truncate max-w-[120px]">{bottomProduct.name}</span>
                  <span className="text-emerald-400">Inseam {inseamCm}cm</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. SHOES / SNEAKERS (ON FEET & PEDESTAL) */}
          {shoeProduct && (
            <div 
              onClick={() => onSlotSelect('shoe')}
              className="absolute bottom-[2%] left-[22%] right-[22%] h-[12%] z-25 cursor-pointer group flex items-center justify-center transition-all hover:scale-[1.03]"
              title={`Fitted: ${shoeProduct.name}`}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-amber-400/60 shadow-2xl bg-black/70 backdrop-blur-xs">
                <img
                  src={shoeProduct.fitImage || shoeProduct.image}
                  alt={shoeProduct.name}
                  className="w-full h-full object-cover object-center opacity-95 group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between text-[9px] text-white font-bold">
                  <span className="truncate max-w-[110px]">{shoeProduct.name}</span>
                  <span className="text-amber-400">EU 42</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. HEADWEAR (CAP / BEANIE ON HEAD) */}
          {headProduct && (
            <div 
              onClick={() => onSlotSelect('head')}
              className="absolute top-[2%] left-[34%] right-[34%] h-[10%] z-30 cursor-pointer group flex items-center justify-center transition-all hover:scale-[1.03]"
              title={`Fitted: ${headProduct.name}`}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/50 shadow-2xl bg-black/60">
                <img
                  src={headProduct.fitImage || headProduct.image}
                  alt={headProduct.name}
                  className="w-full h-full object-cover object-center opacity-95"
                />
              </div>
            </div>
          )}

          {/* 5. SUNGLASSES (ON FACE) */}
          {faceProduct && (
            <div 
              onClick={() => onSlotSelect('face')}
              className="absolute top-[10%] left-[36%] right-[36%] h-[5%] z-30 cursor-pointer group flex items-center justify-center transition-all hover:scale-[1.03]"
              title={`Fitted: ${faceProduct.name}`}
            >
              <div className="relative w-full h-full rounded overflow-hidden border border-cyan-400/60 shadow-xl bg-black/80">
                <img
                  src={faceProduct.fitImage || faceProduct.image}
                  alt={faceProduct.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          )}

          {/* 6. BAG & GEAR (CROSSBODY OVER TORSO) */}
          {bagProduct && (
            <div 
              onClick={() => onSlotSelect('bag')}
              className="absolute top-[28%] right-[8%] w-[32%] h-[15%] z-30 cursor-pointer group flex items-center justify-center transition-all hover:scale-[1.03]"
              title={`Fitted: ${bagProduct.name}`}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-violet-400/60 shadow-2xl bg-black/80">
                <img
                  src={bagProduct.fitImage || bagProduct.image}
                  alt={bagProduct.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          )}

          {/* Real-time Measurement Guide Overlays (User Custom Height & Proportions) */}
          {showMeasurements && (
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between text-[9px] font-mono font-bold text-zinc-300">
              {/* Height Indicator */}
              <div className="absolute top-4 left-3 bg-black/80 backdrop-blur-md border border-zinc-700 px-2 py-0.5 rounded text-amber-300">
                ↕ {userHeight} cm ({Math.floor(userHeight / 30.48)}' {Math.round((userHeight % 30.48) / 2.54)}")
              </div>

              {/* Chest Width Indicator */}
              <div className="absolute top-[28%] left-3 bg-black/80 backdrop-blur-md border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-300">
                Chest: {chestCm} cm
              </div>

              {/* Waist Indicator */}
              <div className="absolute top-[48%] left-3 bg-black/80 backdrop-blur-md border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-300">
                Waist: {waistCm} cm
              </div>

              {/* Inseam Leg Length Indicator */}
              <div className="absolute bottom-[16%] left-3 bg-black/80 backdrop-blur-md border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-300">
                Leg: {inseamCm} cm
              </div>
            </div>
          )}

        </div>

      </div>

      {/* BOTTOM USER CUSTOMIZATION CONTROLS: SIZE, HEIGHT & LENGTH SLIDERS */}
      <div className="w-full bg-[#111115] border-t border-zinc-800 p-3.5 rounded-b-2xl space-y-3 z-30">
        
        {/* Row 1: Height / Length Slider to match real customer body */}
        <div className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 shrink-0 font-bold">
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span>Customer Height & Length:</span>
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

        {/* Row 2: Body Build Proportions (Slim, Athletic, Regular, Plus) */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="text-zinc-400 text-[11px] font-semibold shrink-0">
            Body Proportions:
          </span>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'slim', label: 'Slim Fit' },
              { id: 'athletic', label: 'Athletic' },
              { id: 'regular', label: 'Regular' },
              { id: 'plus', label: 'Plus Fit' },
            ].map(b => (
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
            ✓ 98% Fit Match
          </div>
        </div>

      </div>

    </div>
  );
}
