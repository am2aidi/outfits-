import React, { useState } from 'react';
import { Ruler, Sparkles, SlidersHorizontal, Check, ShieldCheck, Eye, Layers } from 'lucide-react';
import { PRODUCT_MAP } from '../data/products';
import { shadeColor } from '../utils/garmentShading';

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
  // Mannequin finish: 'obsidian' (matte black from user photo 2), 'cocoa' (Black skin tone), 'sculpted-white' (from user photo 1)
  const [localFinish, setLocalFinish] = useState('obsidian');
  const finish = parentFinish || localFinish;
  const setFinish = onFinishChange || setLocalFinish;

  const [showRulerGuides, setShowRulerGuides] = useState(true);

  // Look up equipped products
  const topProduct = worn.top ? PRODUCT_MAP[worn.top] : null;
  const bottomProduct = worn.bottom ? PRODUCT_MAP[worn.bottom] : null;
  const shoeProduct = worn.shoe ? PRODUCT_MAP[worn.shoe] : null;
  const headProduct = worn.head ? PRODUCT_MAP[worn.head] : null;
  const faceProduct = worn.face ? PRODUCT_MAP[worn.face] : null;
  const bagProduct = worn.bag ? PRODUCT_MAP[worn.bag] : null;

  // Body build dimensional multipliers
  const buildFactors = {
    slim: { chest: 0.90, waist: 0.88, hip: 0.90, arm: 0.90, shoulder: 0.93 },
    athletic: { chest: 1.08, waist: 0.96, hip: 1.02, arm: 1.08, shoulder: 1.06 },
    regular: { chest: 1.0, waist: 1.0, hip: 1.0, arm: 1.0, shoulder: 1.0 },
    plus: { chest: 1.18, waist: 1.20, hip: 1.16, arm: 1.14, shoulder: 1.08 }
  };
  const currentBuild = buildFactors[userBuild] || buildFactors.athletic;

  // Sizing looseness multiplier
  const sizeMultipliers = {
    'XS': 0.93,
    'S': 0.96,
    'M': 1.0,
    'L': 1.04,
    'XL': 1.09,
    '2XL': 1.14,
    // For kids/baby:
    '0-3M': 0.88, '3-6M': 0.92, '6-12M': 0.96, '12-18M': 1.0, '18-24M': 1.04,
    '4Y': 0.90, '6Y': 0.94, '8Y': 0.98, '10Y': 1.02, '12Y': 1.06, '14Y': 1.10
  };
  const sizeMult = sizeMultipliers[selectedSize] || 1.04;

  // Height scaling
  const heightRatio = userHeight / 175; // baseline 175 cm
  const legScale = Math.min(1.20, Math.max(0.82, heightRatio));

  // Garment Length scaling (crop vs regular vs tall)
  const lengthMult = userLength === 'crop' ? 0.88 : userLength === 'tall' ? 1.12 : 1.0;

  // Material Palette based on Mannequin Finish
  const isObsidian = finish === 'obsidian';
  const isCocoa = finish === 'cocoa';
  const isWhite = finish === 'sculpted-white';

  const mannequinBase = isObsidian ? '#141416' : isCocoa ? '#3d251e' : '#e4e4e7';
  const mannequinHighlight = isObsidian ? '#27272a' : isCocoa ? '#5c3a30' : '#ffffff';
  const mannequinShadow = isObsidian ? '#09090b' : isCocoa ? '#221410' : '#a1a1aa';
  const mannequinJoint = isObsidian ? '#050505' : isCocoa ? '#1a0f0d' : '#71717a';

  // Real-time body measurements in cm
  const chestCm = Math.round((userBuild === 'slim' ? 92 : userBuild === 'athletic' ? 104 : userBuild === 'plus' ? 118 : 98) * heightRatio);
  const waistCm = Math.round((userBuild === 'slim' ? 74 : userBuild === 'athletic' ? 82 : userBuild === 'plus' ? 98 : 80) * heightRatio);
  const inseamCm = Math.round(userHeight * 0.465);

  // Dynamic garment color calculations
  const topColor = topProduct?.garmentColor || '#18181b';
  const topLight = shadeColor(topColor, 0.28);
  const topDark = shadeColor(topColor, -0.35);

  const bottomColor = bottomProduct?.garmentColor || '#141416';
  const bottomLight = shadeColor(bottomColor, 0.25);
  const bottomDark = shadeColor(bottomColor, -0.35);

  const shoeColor = shoeProduct?.garmentColor || '#0a0a0c';
  const shoeLight = shadeColor(shoeColor, 0.35);
  const shoeDark = shadeColor(shoeColor, -0.4);

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none">
      
      {/* Top Header: Finish Toggle & Specs Toggle */}
      <div className="w-full flex items-center justify-between px-3 py-2 z-30 text-[11px] bg-black/80 backdrop-blur-md border-b border-zinc-800 rounded-t-2xl">
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setFinish('obsidian')}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              isObsidian
                ? 'bg-zinc-800 text-white shadow border border-zinc-600'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Matte Obsidian
          </button>
          <button
            onClick={() => setFinish('cocoa')}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              isCocoa
                ? 'bg-amber-950 text-amber-200 shadow border border-amber-800'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Rich Cocoa
          </button>
          <button
            onClick={() => setFinish('sculpted-white')}
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
              isWhite
                ? 'bg-zinc-200 text-black shadow border border-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sculpted White
          </button>
        </div>

        <button
          onClick={() => setShowRulerGuides(!showRulerGuides)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
            showRulerGuides
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
          }`}
        >
          <Ruler className="w-3 h-3" />
          <span>{showRulerGuides ? 'Hide Specs' : 'Show Specs'}</span>
        </button>
      </div>

      {/* Main Mannequin Stage SVG with High-Precision Anatomical Sculpting & Layered Garments */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[460px] overflow-hidden py-2 bg-gradient-to-b from-[#111114] via-[#09090b] to-[#040405]">
        
        {/* Overhead Retail Spotlight Background */}
        <div className="absolute top-0 w-80 h-80 bg-radial from-zinc-700/20 via-black/80 to-black blur-3xl pointer-events-none"></div>

        <svg
          viewBox="0 0 300 580"
          className="w-full h-full max-h-[500px] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
          aria-label="High-End Sculpted Retail Store Mannequin Wearing Garments"
        >
          <defs>
            {/* Mannequin Body Surface Shading Gradient */}
            <linearGradient id="mqShade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={mannequinHighlight} />
              <stop offset="35%" stopColor={mannequinBase} />
              <stop offset="85%" stopColor={mannequinShadow} />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>

            {/* Glass Pedestal Plate Gradient (matching uploaded photo 2 circular glass stand) */}
            <radialGradient id="glassPlate" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="70%" stopColor="rgba(120,120,130,0.15)" />
              <stop offset="95%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
            </radialGradient>

            {/* Dynamic Real Clothing Textures with calculated brand colors */}
            <linearGradient id="dynFabricTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={topLight} />
              <stop offset="50%" stopColor={topColor} />
              <stop offset="100%" stopColor={topDark} />
            </linearGradient>

            <linearGradient id="dynFabricBottom" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={bottomLight} />
              <stop offset="45%" stopColor={bottomColor} />
              <stop offset="100%" stopColor={bottomDark} />
            </linearGradient>

            <linearGradient id="dynFabricShoe" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={shoeLight} />
              <stop offset="50%" stopColor={shoeColor} />
              <stop offset="100%" stopColor={shoeDark} />
            </linearGradient>

            {/* Imigongo African Subtle Geometric Pattern */}
            <pattern id="imigongoPattern" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M0 7L7 0L14 7L7 14Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
            </pattern>

            {/* Quilted Puffer Baffle Gradient */}
            <linearGradient id="pufferBaffle" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={topLight} />
              <stop offset="30%" stopColor={topColor} />
              <stop offset="85%" stopColor={topDark} />
              <stop offset="100%" stopColor="#08080a" />
            </linearGradient>

            {/* Denim Twill Diagonal Texture */}
            <pattern id="denimTwill" width="6" height="6" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="6" y2="6" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* ======================================================== */}
          {/* BASE: CIRCULAR GLASS PEDESTAL STAND (FROM UPLOADED PHOTO)*/}
          {/* ======================================================== */}
          <g id="pedestal-stand">
            {/* Cast floor shadow */}
            <ellipse cx="150" cy="564" rx="88" ry="13" fill="#000000" opacity="0.85" />
            {/* Glass Pedestal Plate */}
            <ellipse cx="150" cy="558" rx="74" ry="11" fill="url(#glassPlate)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
            <ellipse cx="150" cy="558" rx="70" ry="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            {/* Chrome Support Rod */}
            <rect x="148" y="520" width="4" height="38" rx="1.5" fill="#a1a1aa" stroke="#3f3f46" strokeWidth="0.8" />
            <circle cx="150" cy="558" r="4.5" fill="#ffffff" />
          </g>

          {/* ======================================================== */}
          {/* SCULPTED MANNEQUIN BODY (HIGH-FASHION BOUTIQUE ANATOMY)   */}
          {/* ======================================================== */}
          <g id="sculpted-mannequin-body">
            
            {/* 1. Mannequin Legs (Calves, Knees, Thighs) */}
            <g id="legs" transform={`translate(150 540) scale(1 ${legScale}) translate(-150 -540)`}>
              {/* Left Leg Thigh to Calf */}
              <path
                d={`M${150 - 24 * currentBuild.waist} 265 
                   L${150 - 32 * currentBuild.hip} 330 
                   Q${150 - 30 * currentBuild.arm} 400 ${150 - 22} 415 
                   L${150 - 24} 490 
                   L${150 - 15} 528 
                   L${150 - 4} 528 
                   L${150 - 8} 490 
                   Q${150 - 7} 415 ${150 - 9} 400 
                   L${150 - 10} 330 
                   L${150 - 4} 270 Z`}
                fill="url(#mqShade)"
                stroke={isObsidian ? '#27272a' : isCocoa ? '#5c3a30' : '#cbd5e1'}
                strokeWidth="1"
              />
              <ellipse cx="128" cy="410" rx="6" ry="7" fill={mannequinHighlight} opacity="0.3" />

              {/* Right Leg Thigh to Calf */}
              <path
                d={`M${150 + 4} 270 
                   L${150 + 10} 330 
                   Q${150 + 7} 415 ${150 + 8} 490 
                   L${150 + 4} 528 
                   L${150 + 15} 528 
                   L${150 + 24} 490 
                   Q${150 + 22} 415 ${150 + 30 * currentBuild.arm} 400 
                   L${150 + 32 * currentBuild.hip} 330 
                   L${150 + 24 * currentBuild.waist} 265 Z`}
                fill="url(#mqShade)"
                stroke={isObsidian ? '#27272a' : isCocoa ? '#5c3a30' : '#cbd5e1'}
                strokeWidth="1"
              />
              <ellipse cx="172" cy="410" rx="6" ry="7" fill={mannequinHighlight} opacity="0.3" />

              {/* Bare Feet on Pedestal if no shoes equipped */}
              {!shoeProduct && (
                <g id="bare-feet" fill="url(#mqShade)">
                  <path d="M125 528 Q115 540 110 545 L138 545 Q136 535 135 528 Z" />
                  <path d="M165 528 Q164 535 162 545 L190 545 Q185 540 175 528 Z" />
                </g>
              )}
            </g>

            {/* 2. Mannequin Torso & Athletic Muscle Definition */}
            <g id="torso">
              {/* Pelvis & Briefs Line */}
              <path
                d={`M${150 - 30 * currentBuild.hip} 245 
                   L${150 + 30 * currentBuild.hip} 245 
                   L${150 + 24 * currentBuild.hip} 278 
                   L${150 - 24 * currentBuild.hip} 278 Z`}
                fill={mannequinJoint}
                stroke={isObsidian ? '#27272a' : isCocoa ? '#5c3a30' : '#cbd5e1'}
                strokeWidth="1"
              />

              {/* Sculpted Waist & Athletic Ribcage */}
              <path
                d={`M${150 - 24 * currentBuild.waist} 245 
                   Q${150 - 26 * currentBuild.waist} 205 ${150 - 36 * currentBuild.chest} 150 
                   L${150 - 48 * currentBuild.shoulder} 115 
                   Q150 102 ${150 + 48 * currentBuild.shoulder} 115 
                   L${150 + 36 * currentBuild.chest} 150 
                   Q${150 + 26 * currentBuild.waist} 205 ${150 + 24 * currentBuild.waist} 245 Z`}
                fill="url(#mqShade)"
                stroke={isObsidian ? '#27272a' : isCocoa ? '#5c3a30' : '#cbd5e1'}
                strokeWidth="1.2"
              />

              {/* Pectoral Contours & Sternum Line */}
              <path
                d={`M${150 - 28 * currentBuild.chest} 145 Q${150 - 15} 165 150 160 Q${150 + 15} 165 ${150 + 28 * currentBuild.chest} 145`}
                fill="none"
                stroke={mannequinHighlight}
                strokeWidth="1.2"
                opacity="0.35"
              />
              <line x1="150" y1="125" x2="150" y2="195" stroke={mannequinHighlight} strokeWidth="1" opacity="0.3" />

              {/* Abdominal Definition */}
              <line x1="142" y1="180" x2="158" y2="180" stroke={mannequinShadow} strokeWidth="1" opacity="0.4" />
              <line x1="144" y1="205" x2="156" y2="205" stroke={mannequinShadow} strokeWidth="1" opacity="0.4" />
            </g>

            {/* 3. Mannequin Articulated Arms & High-Fashion Shoulder Caps (from photo 2) */}
            <g id="arms">
              {/* Left Shoulder Cap */}
              <ellipse
                cx={150 - 48 * currentBuild.shoulder}
                cy="118"
                rx={14 * currentBuild.shoulder}
                ry="18"
                fill="url(#mqShade)"
                stroke={isObsidian ? '#3f3f46' : '#94a3b8'}
                strokeWidth="1.2"
              />
              {/* Left Arm & Forearm down to hip */}
              <path
                d={`M${150 - 56 * currentBuild.shoulder} 125 
                   L${150 - 70 * currentBuild.arm} 230 
                   L${150 - 64 * currentBuild.arm} 335 
                   L${150 - 54 * currentBuild.arm} 335 
                   L${150 - 56 * currentBuild.arm} 230 
                   L${150 - 40 * currentBuild.shoulder} 130 Z`}
                fill="url(#mqShade)"
                stroke={isObsidian ? '#27272a' : '#cbd5e1'}
                strokeWidth="1"
              />
              <circle cx={150 - 63 * currentBuild.arm} cy="230" r="5" fill={mannequinJoint} opacity="0.7" />
              {/* Left Hand */}
              <path
                d={`M${150 - 64 * currentBuild.arm} 335 Q${150 - 60} 360 ${150 - 56} 370 L${150 - 50} 366 Q${150 - 52} 355 ${150 - 54 * currentBuild.arm} 335 Z`}
                fill="url(#mqShade)"
              />

              {/* Right Shoulder Cap */}
              <ellipse
                cx={150 + 48 * currentBuild.shoulder}
                cy="118"
                rx={14 * currentBuild.shoulder}
                ry="18"
                fill="url(#mqShade)"
                stroke={isObsidian ? '#3f3f46' : '#94a3b8'}
                strokeWidth="1.2"
              />
              {/* Right Arm & Forearm */}
              <path
                d={`M${150 + 40 * currentBuild.shoulder} 130 
                   L${150 + 56 * currentBuild.arm} 230 
                   L${150 + 54 * currentBuild.arm} 335 
                   L${150 + 64 * currentBuild.arm} 335 
                   L${150 + 70 * currentBuild.arm} 230 
                   L${150 + 56 * currentBuild.shoulder} 125 Z`}
                fill="url(#mqShade)"
                stroke={isObsidian ? '#27272a' : '#cbd5e1'}
                strokeWidth="1"
              />
              <circle cx={150 + 63 * currentBuild.arm} cy="230" r="5" fill={mannequinJoint} opacity="0.7" />
              {/* Right Hand */}
              <path
                d={`M${150 + 54 * currentBuild.arm} 335 Q${150 + 52} 355 ${150 + 50} 366 L${150 + 56} 370 Q${150 + 60} 360 ${150 + 64 * currentBuild.arm} 335 Z`}
                fill="url(#mqShade)"
              />
            </g>

            {/* 4. Sculpted High-Fashion Mannequin Head & Neck (from photo 2) */}
            <g id="head-and-neck">
              <path
                d="M141 85 L159 85 L157 114 L143 114 Z"
                fill="url(#mqShade)"
                stroke={isObsidian ? '#27272a' : isCocoa ? '#5c3a30' : '#cbd5e1'}
                strokeWidth="1"
              />
              <ellipse
                cx="150"
                cy="62"
                rx="19"
                ry="27"
                fill="url(#mqShade)"
                stroke={isObsidian ? '#3f3f46' : isCocoa ? '#5c3a30' : '#cbd5e1'}
                strokeWidth="1.2"
              />
              <path
                d="M136 65 Q150 86 164 65"
                fill="none"
                stroke={mannequinHighlight}
                strokeWidth="1.2"
                opacity="0.4"
              />
            </g>
          </g>

          {/* ======================================================== */}
          {/* REAL DRAPED CLOTHING LAYERS (ACTUALLY WORN BY MANNEQUIN) */}
          {/* ======================================================== */}

          {/* 1. REAL WORN BOTTOMS (CARGOS, DENIM, LEGGINGS, SKIRTS, TRACKPANTS) */}
          {bottomProduct && (
            <g
              id="worn-bottom"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onClick={() => onSlotSelect && onSlotSelect('bottom')}
              transform={`translate(150 540) scale(1 ${legScale * (userLength === 'crop' ? 0.94 : userLength === 'tall' ? 1.05 : 1.0)}) translate(-150 -540)`}
            >
              {bottomProduct.garmentStyle === 'skirt' ? (
                /* Pleated Athletic Skort */
                <g>
                  <path
                    d={`M${150 - 28 * currentBuild.waist * sizeMult} 242 
                       L${150 + 28 * currentBuild.waist * sizeMult} 242 
                       L${150 + 48 * currentBuild.hip * sizeMult} 335 
                       L${150 - 48 * currentBuild.hip * sizeMult} 335 Z`}
                    fill="url(#dynFabricBottom)"
                    stroke={bottomLight}
                    strokeWidth="1.5"
                  />
                  {[-36, -24, -12, 0, 12, 24, 36].map((x, i) => (
                    <line
                      key={i}
                      x1={150 + x * 0.7}
                      y1="250"
                      x2={150 + x * 1.15}
                      y2="333"
                      stroke={bottomDark}
                      strokeWidth="1.2"
                    />
                  ))}
                  <rect x={150 - 28 * currentBuild.waist * sizeMult} y="240" width={56 * currentBuild.waist * sizeMult} height="8" rx="2" fill={bottomDark} />
                </g>
              ) : bottomProduct.garmentStyle === 'leggings' ? (
                /* High-Rise Sculpt Compression Leggings */
                <g>
                  <path
                    d={`M${150 - 26 * currentBuild.waist * sizeMult} 230 
                       L${150 + 26 * currentBuild.waist * sizeMult} 230 
                       L${150 + 34 * currentBuild.hip * sizeMult} 330 
                       Q${150 + 30 * currentBuild.arm} 400 ${150 + 24} 415 
                       L${150 + 22} 505 
                       L${150 + 13} 505 
                       L${150 + 6} 415 
                       L${150 + 2} 310 
                       L${150 - 2} 310 
                       L${150 - 6} 415 
                       L${150 - 13} 505 
                       L${150 - 22} 505 
                       L${150 - 24} 415 
                       Q${150 - 30 * currentBuild.arm} 400 ${150 - 34 * currentBuild.hip * sizeMult} 330 Z`}
                    fill="url(#dynFabricBottom)"
                    stroke={bottomLight}
                    strokeWidth="1.2"
                  />
                  {/* Glute & Quad Contour Stitching */}
                  <path
                    d={`M${150 - 22} 260 Q${150 - 10} 340 ${150 - 18} 410 M${150 + 22} 260 Q${150 + 10} 340 ${150 + 18} 410`}
                    fill="none"
                    stroke={bottomLight}
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <rect x={150 - 26 * currentBuild.waist * sizeMult} y="222" width={52 * currentBuild.waist * sizeMult} height="12" rx="2" fill={bottomDark} stroke={bottomLight} strokeWidth="1" />
                </g>
              ) : bottomProduct.garmentStyle === 'jeans' ? (
                /* Selvedge Raw Indigo Tapered Denim Jeans */
                <g>
                  <path
                    d={`M${150 - 28 * currentBuild.waist * sizeMult} 242 
                       L${150 + 28 * currentBuild.waist * sizeMult} 242 
                       L${150 + 36 * currentBuild.hip * sizeMult} 330 
                       Q${150 + 32 * currentBuild.arm} 400 ${150 + 26} 415 
                       L${150 + 22} 506 
                       L${150 + 12} 506 
                       L${150 + 6} 415 
                       L${150 + 2} 300 
                       L${150 - 2} 300 
                       L${150 - 6} 415 
                       L${150 - 12} 506 
                       L${150 - 22} 506 
                       L${150 - 26} 415 
                       Q${150 - 32 * currentBuild.arm} 400 ${150 - 36 * currentBuild.hip * sizeMult} 330 Z`}
                    fill="url(#dynFabricBottom)"
                    stroke="#1e3a8a"
                    strokeWidth="1.5"
                  />
                  {/* Denim Twill Overlay */}
                  <path
                    d={`M${150 - 28 * currentBuild.waist * sizeMult} 242 L${150 + 28 * currentBuild.waist * sizeMult} 242 L${150 + 22} 506 L${150 - 22} 506 Z`}
                    fill="url(#denimTwill)"
                  />
                  {/* Contrast Amber Topstitching */}
                  <line x1={150 - 27} y1="250" x2={150 + 27} y2="250" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />
                  <path d="M150 248 V295" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />
                  {/* Copper Rivets */}
                  <circle cx={150 - 26} cy="254" r="1.8" fill="#d97706" />
                  <circle cx={150 + 26} cy="254" r="1.8" fill="#d97706" />
                  {/* Whiskering Folds on Thighs */}
                  <line x1={150 - 24} y1="285" x2={150 - 8} y2="295" stroke="#60a5fa" strokeWidth="1.2" opacity="0.4" />
                  <line x1={150 + 24} y1="285" x2={150 + 8} y2="295" stroke="#60a5fa" strokeWidth="1.2" opacity="0.4" />
                  {/* Selvedge Ankle Cuffs */}
                  <rect x={150 - 23} y="498" width="12" height="8" rx="1.5" fill="#1e293b" stroke="#f59e0b" strokeWidth="0.8" />
                  <rect x={150 + 11} y="498" width="12" height="8" rx="1.5" fill="#1e293b" stroke="#f59e0b" strokeWidth="0.8" />
                </g>
              ) : bottomProduct.garmentStyle === 'trackpants' ? (
                /* Swift Track Pants with Racing Stripes */
                <g>
                  <path
                    d={`M${150 - 28 * currentBuild.waist * sizeMult} 242 
                       L${150 + 28 * currentBuild.waist * sizeMult} 242 
                       L${150 + 35 * currentBuild.hip * sizeMult} 330 
                       Q${150 + 31 * currentBuild.arm} 400 ${150 + 25} 415 
                       L${150 + 22} 506 
                       L${150 + 12} 506 
                       L${150 + 6} 415 
                       L${150 + 2} 300 
                       L${150 - 2} 300 
                       L${150 - 6} 415 
                       L${150 - 12} 506 
                       L${150 - 22} 506 
                       L${150 - 25} 415 
                       Q${150 - 31 * currentBuild.arm} 400 ${150 - 35 * currentBuild.hip * sizeMult} 330 Z`}
                    fill="url(#dynFabricBottom)"
                    stroke={bottomLight}
                    strokeWidth="1.5"
                  />
                  {/* Contrast Side Racing Stripes */}
                  <path
                    d={`M${150 - 28 * currentBuild.waist * sizeMult} 242 Q${150 - 36 * currentBuild.hip * sizeMult} 330 ${150 - 22} 506`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                  <path
                    d={`M${150 + 28 * currentBuild.waist * sizeMult} 242 Q${150 + 36 * currentBuild.hip * sizeMult} 330 ${150 + 22} 506`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                  {/* Elastic Waistband */}
                  <rect x={150 - 28 * currentBuild.waist * sizeMult} y="238" width={56 * currentBuild.waist * sizeMult} height="9" rx="2" fill={bottomDark} />
                  {/* Ankle Zips */}
                  <line x1={150 - 21} y1="480" x2={150 - 21} y2="504" stroke="#a1a1aa" strokeWidth="1.5" />
                  <line x1={150 + 21} y1="480" x2={150 + 21} y2="504" stroke="#a1a1aa" strokeWidth="1.5" />
                </g>
              ) : (
                /* Default: Tactical Cargo Trousers */
                <g>
                  <path
                    d={`M${150 - 28 * currentBuild.waist * sizeMult} 242 
                       L${150 + 28 * currentBuild.waist * sizeMult} 242 
                       L${150 + 36 * currentBuild.hip * sizeMult} 330 
                       Q${150 + 32 * currentBuild.arm} 400 ${150 + 26} 415 
                       L${150 + 23} 506 
                       L${150 + 12} 506 
                       L${150 + 6} 415 
                       L${150 + 2} 300 
                       L${150 - 2} 300 
                       L${150 - 6} 415 
                       L${150 - 12} 506 
                       L${150 - 23} 506 
                       L${150 - 26} 415 
                       Q${150 - 32 * currentBuild.arm} 400 ${150 - 36 * currentBuild.hip * sizeMult} 330 Z`}
                    fill="url(#dynFabricBottom)"
                    stroke={bottomLight}
                    strokeWidth="1.5"
                  />
                  {/* 3D Bellows Cargo Pockets on Thighs */}
                  <rect x={150 - 45 * sizeMult} y="315" width="14" height="34" rx="2" fill={bottomDark} stroke={bottomLight} strokeWidth="1.2" />
                  <rect x={150 + 31 * sizeMult} y="315" width="14" height="34" rx="2" fill={bottomDark} stroke={bottomLight} strokeWidth="1.2" />
                  <rect x={150 - 46 * sizeMult} y="313" width="16" height="7" rx="1.5" fill={bottomLight} />
                  <rect x={150 + 30 * sizeMult} y="313" width="16" height="7" rx="1.5" fill={bottomLight} />
                  {/* Knee Flex Pleats */}
                  <line x1={150 - 24} y1="410" x2={150 - 8} y2="410" stroke={bottomDark} strokeWidth="1.5" />
                  <line x1={150 - 24} y1="417" x2={150 - 8} y2="417" stroke={bottomDark} strokeWidth="1.5" />
                  <line x1={150 + 8} y1="410" x2={150 + 24} y2="410" stroke={bottomDark} strokeWidth="1.5" />
                  <line x1={150 + 8} y1="417" x2={150 + 24} y2="417" stroke={bottomDark} strokeWidth="1.5" />
                  {/* Cinch Ankle Bungee Cuffs */}
                  <rect x={150 - 24} y="500" width="13" height="7" rx="2" fill={bottomDark} stroke={bottomLight} strokeWidth="0.8" />
                  <rect x={150 + 11} y="500" width="13" height="7" rx="2" fill={bottomDark} stroke={bottomLight} strokeWidth="0.8" />
                </g>
              )}
            </g>
          )}

          {/* 2. REAL WORN FOOTWEAR (SNEAKERS, RUNNERS, BOOTS ON FEET) */}
          {shoeProduct && (
            <g
              id="worn-shoes"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onClick={() => onSlotSelect && onSlotSelect('shoe')}
              transform={`translate(150 540) scale(1 ${legScale}) translate(-150 -540)`}
            >
              {shoeProduct.garmentStyle === 'boot' ? (
                /* Serengeti Trail-Grip High Sneakerboot */
                <g>
                  {/* Left Boot */}
                  <g transform="translate(98 488)">
                    {/* Deep Rugged Commando Lugged Sole */}
                    <path d="M4 42 L52 42 L50 54 L6 54 Z" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
                    {/* Lug teeth */}
                    {[8, 16, 24, 32, 40, 48].map((lx, i) => (
                      <rect key={i} x={lx} y="52" width="4" height="4" fill="#18181b" />
                    ))}
                    {/* High-Top Upper */}
                    <path d="M14 8 L38 8 L46 36 L52 42 L6 42 L8 28 Z" fill="url(#dynFabricShoe)" stroke={shoeLight} strokeWidth="1.5" />
                    {/* Padded Ankle Collar */}
                    <rect x="14" y="6" width="24" height="8" rx="3" fill="#27272a" />
                    {/* Speed lacing hooks & laces */}
                    <line x1="22" y1="14" x2="32" y2="14" stroke="#f59e0b" strokeWidth="1.2" />
                    <line x1="24" y1="22" x2="34" y2="22" stroke="#f59e0b" strokeWidth="1.2" />
                    <line x1="26" y1="30" x2="36" y2="30" stroke="#f59e0b" strokeWidth="1.2" />
                  </g>
                  {/* Right Boot */}
                  <g transform="translate(150 488)">
                    <path d="M0 42 L48 42 L46 54 L2 54 Z" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
                    {[4, 12, 20, 28, 36, 44].map((lx, i) => (
                      <rect key={i} x={lx} y="52" width="4" height="4" fill="#18181b" />
                    ))}
                    <path d="M12 8 L36 8 L42 28 L44 42 L0 42 L6 36 Z" fill="url(#dynFabricShoe)" stroke={shoeLight} strokeWidth="1.5" />
                    <rect x="12" y="6" width="24" height="8" rx="3" fill="#27272a" />
                    <line x1="18" y1="14" x2="28" y2="14" stroke="#f59e0b" strokeWidth="1.2" />
                    <line x1="16" y1="22" x2="26" y2="22" stroke="#f59e0b" strokeWidth="1.2" />
                    <line x1="14" y1="30" x2="24" y2="30" stroke="#f59e0b" strokeWidth="1.2" />
                  </g>
                </g>
              ) : shoeProduct.garmentStyle === 'court' ? (
                /* Addis Court Lows (Leather Cupsole) */
                <g>
                  {/* Left Shoe */}
                  <g transform="translate(100 500)">
                    <path d="M12 20 Q24 6 42 6 L46 22 L48 34 L6 34 Z" fill="url(#dynFabricShoe)" stroke={shoeLight} strokeWidth="1.5" />
                    <path d="M2 30 L52 30 L48 40 L4 40 Z" fill="#d4d4d8" stroke="#71717a" strokeWidth="1.2" />
                    {/* Perforated Toe Vamp */}
                    <circle cx="38" cy="24" r="1" fill="#71717a" />
                    <circle cx="42" cy="24" r="1" fill="#71717a" />
                    <circle cx="40" cy="28" r="1" fill="#71717a" />
                    {/* Clean lacing */}
                    <line x1="24" y1="12" x2="34" y2="12" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="26" y1="18" x2="36" y2="18" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                  {/* Right Shoe */}
                  <g transform="translate(150 500)">
                    <path d="M6 22 L10 6 Q28 6 40 20 L44 34 L2 34 Z" fill="url(#dynFabricShoe)" stroke={shoeLight} strokeWidth="1.5" />
                    <path d="M0 30 L50 30 L48 40 L4 40 Z" fill="#d4d4d8" stroke="#71717a" strokeWidth="1.2" />
                    <circle cx="10" cy="24" r="1" fill="#71717a" />
                    <circle cx="14" cy="24" r="1" fill="#71717a" />
                    <circle cx="12" cy="28" r="1" fill="#71717a" />
                    <line x1="16" y1="12" x2="26" y2="12" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="14" y1="18" x2="24" y2="18" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                </g>
              ) : (
                /* Matrix Stealth Carbon Runner 01 */
                <g>
                  {/* Left Sneaker */}
                  <g transform="translate(100 500)">
                    <path d="M10 24 Q24 2 40 2 L46 22 L48 34 L6 34 Z" fill="url(#dynFabricShoe)" stroke={shoeLight} strokeWidth="1.5" />
                    {/* Aerodynamic Air Midsole with Air Window */}
                    <path d="M2 30 L52 30 L48 42 L4 42 Z" fill="#18181b" stroke={shoeLight} strokeWidth="1.5" />
                    <rect x="8" y="33" width="14" height="6" rx="2" fill="#38bdf8" opacity="0.8" />
                    {/* Carbon Plate Glow Edge */}
                    <line x1="6" y1="36" x2="46" y2="36" stroke="#f59e0b" strokeWidth="1.8" />
                    {/* Lacing Lines */}
                    <line x1="26" y1="8" x2="36" y2="8" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="28" y1="13" x2="38" y2="13" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="30" y1="18" x2="40" y2="18" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                  {/* Right Sneaker */}
                  <g transform="translate(150 500)">
                    <path d="M4 22 L10 2 Q26 2 40 24 L44 34 L2 34 Z" fill="url(#dynFabricShoe)" stroke={shoeLight} strokeWidth="1.5" />
                    <path d="M0 30 L50 30 L48 42 L4 42 Z" fill="#18181b" stroke={shoeLight} strokeWidth="1.5" />
                    <rect x="28" y="33" width="14" height="6" rx="2" fill="#38bdf8" opacity="0.8" />
                    <line x1="4" y1="36" x2="44" y2="36" stroke="#f59e0b" strokeWidth="1.8" />
                    <line x1="14" y1="8" x2="24" y2="8" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="12" y1="13" x2="22" y2="13" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="10" y1="18" x2="20" y2="18" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                </g>
              )}
            </g>
          )}

          {/* 3. REAL WORN TOPS & JACKETS (COATS, PUFFERS, BIKER LEATHER, HOODIES, TEES, WINDRUNNERS) */}
          {topProduct && (
            <g
              id="worn-top"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onClick={() => onSlotSelect && onSlotSelect('top')}
            >
              {topProduct.garmentStyle === 'croptop' ? (
                /* Seamless Sculpt Crop Top */
                <g>
                  <path
                    d={`M${150 - 32 * currentBuild.chest * sizeMult} 115 
                       L${150 + 32 * currentBuild.chest * sizeMult} 115 
                       L${150 + 26 * currentBuild.waist * sizeMult} 195 
                       L${150 - 26 * currentBuild.waist * sizeMult} 195 Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.5"
                  />
                  <rect x={150 - 26 * currentBuild.waist * sizeMult} y="185" width={52 * currentBuild.waist * sizeMult} height="10" fill={topDark} />
                </g>
              ) : topProduct.garmentStyle === 'tee' ? (
                /* Core Boxy Minimalist Tee */
                <g>
                  {/* Tee Body */}
                  <path
                    d={`M${150 - 44 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 44 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 34 * currentBuild.chest * sizeMult} ${245 * lengthMult} 
                       L${150 - 34 * currentBuild.chest * sizeMult} ${245 * lengthMult} Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.5"
                  />
                  {/* Short Sleeves */}
                  <path
                    d={`M${150 - 44 * currentBuild.shoulder * sizeMult} 114 
                       L${150 - 64 * currentBuild.arm * sizeMult} 185 
                       L${150 - 48 * currentBuild.arm * sizeMult} 195 
                       L${150 - 36 * currentBuild.chest * sizeMult} 150 Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  <path
                    d={`M${150 + 44 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 64 * currentBuild.arm * sizeMult} 185 
                       L${150 + 48 * currentBuild.arm * sizeMult} 195 
                       L${150 + 36 * currentBuild.chest * sizeMult} 150 Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  {/* Crewneck Rib Band */}
                  <path
                    d="M138 114 Q150 126 162 114 Q150 120 138 114 Z"
                    fill={topDark}
                    stroke={topLight}
                    strokeWidth="1"
                  />
                  {/* Subtle HURANOW Crest on Chest */}
                  <circle cx="138" cy="145" r="3" fill="#ffffff" />
                </g>
              ) : topProduct.garmentStyle === 'puffer' ? (
                /* Virunga Alpine Down Puffer Jacket */
                <g>
                  {/* Body with Horizontal Baffle Chambers */}
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 38 * currentBuild.chest * sizeMult} ${255 * lengthMult} 
                       L${150 - 38 * currentBuild.chest * sizeMult} ${255 * lengthMult} Z`}
                    fill="url(#pufferBaffle)"
                    stroke={topLight}
                    strokeWidth="1.5"
                  />
                  {/* Puffer Quilted Baffle Creases */}
                  {[140, 170, 200, 230].map((by, i) => (
                    <path
                      key={i}
                      d={`M${150 - 42 * currentBuild.chest * sizeMult} ${by} Q150 ${by + 6} ${150 + 42 * currentBuild.chest * sizeMult} ${by}`}
                      fill="none"
                      stroke={topDark}
                      strokeWidth="2.5"
                    />
                  ))}
                  {/* Puffer Full Sleeves with Baffles */}
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 - 74 * currentBuild.arm * sizeMult} 230 
                       L${150 - 66 * currentBuild.arm * sizeMult} 335 
                       L${150 - 52 * currentBuild.arm * sizeMult} 335 
                       L${150 - 56 * currentBuild.arm * sizeMult} 230 
                       L${150 - 38 * currentBuild.chest * sizeMult} 150 Z`}
                    fill="url(#pufferBaffle)"
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  <path
                    d={`M${150 + 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 74 * currentBuild.arm * sizeMult} 230 
                       L${150 + 66 * currentBuild.arm * sizeMult} 335 
                       L${150 + 52 * currentBuild.arm * sizeMult} 335 
                       L${150 + 56 * currentBuild.arm * sizeMult} 230 
                       L${150 + 38 * currentBuild.chest * sizeMult} 150 Z`}
                    fill="url(#pufferBaffle)"
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  {/* Thick Insulated Stand Collar */}
                  <rect x="134" y="96" width="32" height="18" rx="5" fill={topDark} stroke={topLight} strokeWidth="1.2" />
                  {/* Center Zipper */}
                  <line x1="150" y1="96" x2="150" y2={255 * lengthMult} stroke="#d4d4d8" strokeWidth="2" />
                </g>
              ) : topProduct.garmentStyle === 'coat' ? (
                /* Noir Bonded Track Trench Coat (Longline Knee Length) */
                <g>
                  {/* Coat Body falling to knees */}
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 44 * currentBuild.hip * sizeMult} ${375 * lengthMult} 
                       L${150 - 44 * currentBuild.hip * sizeMult} ${375 * lengthMult} Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.5"
                  />
                  {/* Sleeves */}
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 - 72 * currentBuild.arm * sizeMult} 230 
                       L${150 - 64 * currentBuild.arm * sizeMult} 330 
                       L${150 - 52 * currentBuild.arm * sizeMult} 330 
                       L${150 - 56 * currentBuild.arm * sizeMult} 230 
                       L${150 - 36 * currentBuild.chest * sizeMult} 150 Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  <path
                    d={`M${150 + 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 72 * currentBuild.arm * sizeMult} 230 
                       L${150 + 64 * currentBuild.arm * sizeMult} 330 
                       L${150 + 52 * currentBuild.arm * sizeMult} 330 
                       L${150 + 56 * currentBuild.arm * sizeMult} 230 
                       L${150 + 36 * currentBuild.chest * sizeMult} 150 Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  {/* Wide Storm Lapels */}
                  <path d="M128 114 L150 165 L140 120 Z" fill={topLight} />
                  <path d="M172 114 L150 165 L160 120 Z" fill={topLight} />
                  {/* Waist Belt with Metallic Buckle */}
                  <rect x={150 - 40 * currentBuild.waist * sizeMult} y="228" width={80 * currentBuild.waist * sizeMult} height="12" fill={topDark} stroke={topLight} strokeWidth="1" />
                  <rect x="144" y="226" width="12" height="16" rx="2" fill="#ffffff" stroke="#71717a" strokeWidth="1" />
                  {/* Double Row of Buttons */}
                  {[150, 180, 210].map((by, i) => (
                    <g key={i}>
                      <circle cx="138" cy={by} r="2.8" fill="#d4d4d8" />
                      <circle cx="162" cy={by} r="2.8" fill="#d4d4d8" />
                    </g>
                  ))}
                  {/* Center Split Vent */}
                  <line x1="150" y1="240" x2="150" y2={375 * lengthMult} stroke={topDark} strokeWidth="1.5" />
                </g>
              ) : topProduct.garmentStyle === 'leather' ? (
                /* Noir Handcrafted Biker Leather Jacket */
                <g>
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 34 * currentBuild.chest * sizeMult} ${245 * lengthMult} 
                       L${150 - 34 * currentBuild.chest * sizeMult} ${245 * lengthMult} Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.5"
                  />
                  {/* Sleeves */}
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder * sizeMult} 114 L${150 - 72 * currentBuild.arm * sizeMult} 230 L${150 - 64 * currentBuild.arm * sizeMult} 330 L${150 - 52 * currentBuild.arm * sizeMult} 330 L${150 - 56 * currentBuild.arm * sizeMult} 230 L${150 - 34 * currentBuild.chest * sizeMult} 145 Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  <path
                    d={`M${150 + 48 * currentBuild.shoulder * sizeMult} 114 L${150 + 72 * currentBuild.arm * sizeMult} 230 L${150 + 64 * currentBuild.arm * sizeMult} 330 L${150 + 52 * currentBuild.arm * sizeMult} 330 L${150 + 56 * currentBuild.arm * sizeMult} 230 L${150 + 34 * currentBuild.chest * sizeMult} 145 Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  {/* Asymmetrical Diagonal Heavy Silver Zipper */}
                  <line x1="140" y1="114" x2="158" y2={245 * lengthMult} stroke="#e4e4e7" strokeWidth="2.5" />
                  {/* Wide Notched Lapels with Metallic Snaps */}
                  <path d="M136 114 L120 150 L146 132 Z" fill={topLight} stroke="#71717a" strokeWidth="0.8" />
                  <path d="M164 114 L180 150 L154 132 Z" fill={topLight} stroke="#71717a" strokeWidth="0.8" />
                  <circle cx="124" cy="144" r="2.2" fill="#ffffff" />
                  <circle cx="176" cy="144" r="2.2" fill="#ffffff" />
                </g>
              ) : topProduct.garmentStyle === 'denim' ? (
                /* Pan-African Selvedge Denim Trucker Jacket */
                <g>
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 34 * currentBuild.chest * sizeMult} ${245 * lengthMult} 
                       L${150 - 34 * currentBuild.chest * sizeMult} ${245 * lengthMult} Z`}
                    fill="url(#dynFabricTop)"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder * sizeMult} 114 L${150 + 48 * currentBuild.shoulder * sizeMult} 114 L${150 + 34 * currentBuild.chest * sizeMult} ${245 * lengthMult} L${150 - 34 * currentBuild.chest * sizeMult} ${245 * lengthMult} Z`}
                    fill="url(#denimTwill)"
                  />
                  {/* Sleeves */}
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder * sizeMult} 114 L${150 - 72 * currentBuild.arm * sizeMult} 230 L${150 - 64 * currentBuild.arm * sizeMult} 330 L${150 - 52 * currentBuild.arm * sizeMult} 330 L${150 - 56 * currentBuild.arm * sizeMult} 230 L${150 - 34 * currentBuild.chest * sizeMult} 145 Z`}
                    fill="url(#dynFabricTop)"
                    stroke="#3b82f6"
                    strokeWidth="1.2"
                  />
                  <path
                    d={`M${150 + 48 * currentBuild.shoulder * sizeMult} 114 L${150 + 72 * currentBuild.arm * sizeMult} 230 L${150 + 64 * currentBuild.arm * sizeMult} 330 L${150 + 52 * currentBuild.arm * sizeMult} 330 L${150 + 56 * currentBuild.arm * sizeMult} 230 L${150 + 34 * currentBuild.chest * sizeMult} 145 Z`}
                    fill="url(#dynFabricTop)"
                    stroke="#3b82f6"
                    strokeWidth="1.2"
                  />
                  {/* Dual Chest Flap Pockets */}
                  <rect x={150 - 32} y="145" width="22" height="20" rx="2" fill={topDark} stroke="#f59e0b" strokeWidth="1" />
                  <rect x={150 + 10} y="145" width="22" height="20" rx="2" fill={topDark} stroke="#f59e0b" strokeWidth="1" />
                  <circle cx={150 - 21} cy="148" r="1.8" fill="#d97706" />
                  <circle cx={150 + 21} cy="148" r="1.8" fill="#d97706" />
                  {/* Folded Collar */}
                  <path d="M136 114 L126 130 L150 124 L174 130 L164 114 Z" fill={topLight} stroke="#f59e0b" strokeWidth="1" />
                </g>
              ) : topProduct.garmentStyle === 'hoodie' ? (
                /* Heavyweight 480GSM Oversized Hoodie */
                <g>
                  {/* Oversized Body */}
                  <path
                    d={`M${150 - 46 * currentBuild.shoulder * sizeMult} 115 
                       L${150 + 46 * currentBuild.shoulder * sizeMult} 115 
                       L${150 + 36 * currentBuild.chest * sizeMult} ${255 * lengthMult} 
                       L${150 - 36 * currentBuild.chest * sizeMult} ${255 * lengthMult} Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.5"
                  />
                  {/* Full Sleeves */}
                  <path
                    d={`M${150 - 46 * currentBuild.shoulder * sizeMult} 115 
                       L${150 - 74 * currentBuild.arm * sizeMult} 230 
                       L${150 - 66 * currentBuild.arm * sizeMult} 335 
                       L${150 - 52 * currentBuild.arm * sizeMult} 335 
                       L${150 - 56 * currentBuild.arm * sizeMult} 230 
                       L${150 - 36 * currentBuild.chest * sizeMult} 150 Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  <path
                    d={`M${150 + 46 * currentBuild.shoulder * sizeMult} 115 
                       L${150 + 74 * currentBuild.arm * sizeMult} 230 
                       L${150 + 66 * currentBuild.arm * sizeMult} 335 
                       L${150 + 52 * currentBuild.arm * sizeMult} 335 
                       L${150 + 56 * currentBuild.arm * sizeMult} 230 
                       L${150 + 36 * currentBuild.chest * sizeMult} 150 Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  {/* Double Layer Hood Around Neck */}
                  <path
                    d="M128 100 Q150 74 172 100 Q162 130 150 130 Q138 130 128 100 Z"
                    fill={topDark}
                    stroke={topLight}
                    strokeWidth="1.5"
                  />
                  {/* Hanging Hood Drawstrings with Aglets */}
                  <line x1="144" y1="126" x2="142" y2="162" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="142" cy="163" r="1.5" fill="#f59e0b" />
                  <line x1="156" y1="126" x2="158" y2="162" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="158" cy="163" r="1.5" fill="#f59e0b" />
                  {/* Kangaroo Pocket */}
                  <path
                    d={`M${150 - 24} 200 L${150 + 24} 200 L${150 + 30} 248 L${150 - 30} 248 Z`}
                    fill={topDark}
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  {/* Ribbed Hem at Waist */}
                  <rect x={150 - 36 * currentBuild.chest * sizeMult} y={247 * lengthMult} width={72 * currentBuild.chest * sizeMult} height="10" rx="2" fill={topDark} />
                </g>
              ) : (
                /* Default: Kigali Stealth Windrunner Track Shell */
                <g>
                  {/* Jacket Body */}
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 32 * currentBuild.chest * sizeMult} ${250 * lengthMult} 
                       L${150 - 32 * currentBuild.chest * sizeMult} ${250 * lengthMult} Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.5"
                  />
                  {/* Subtle Imigongo Geometric Texture */}
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 32 * currentBuild.chest * sizeMult} ${250 * lengthMult} 
                       L${150 - 32 * currentBuild.chest * sizeMult} ${250 * lengthMult} Z`}
                    fill="url(#imigongoPattern)"
                  />
                  {/* Sleeves */}
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 - 72 * currentBuild.arm * sizeMult} 230 
                       L${150 - 64 * currentBuild.arm * sizeMult} 330 
                       L${150 - 52 * currentBuild.arm * sizeMult} 330 
                       L${150 - 56 * currentBuild.arm * sizeMult} 230 
                       L${150 - 34 * currentBuild.chest * sizeMult} 145 Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  <path
                    d={`M${150 + 48 * currentBuild.shoulder * sizeMult} 114 
                       L${150 + 72 * currentBuild.arm * sizeMult} 230 
                       L${150 + 64 * currentBuild.arm * sizeMult} 330 
                       L${150 + 52 * currentBuild.arm * sizeMult} 330 
                       L${150 + 56 * currentBuild.arm * sizeMult} 230 
                       L${150 + 34 * currentBuild.chest * sizeMult} 145 Z`}
                    fill="url(#dynFabricTop)"
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                  {/* 26° Chevron V-Line on Chest (Nike Signature) */}
                  <path
                    d={`M${150 - 46 * currentBuild.shoulder * sizeMult} 140 L150 178 L${150 + 46 * currentBuild.shoulder * sizeMult} 140`}
                    fill="none"
                    stroke={topLight}
                    strokeWidth="2.5"
                  />
                  {/* Waterproof Taped Zipper & Metallic Slider */}
                  <line x1="150" y1="102" x2="150" y2={250 * lengthMult} stroke="#a1a1aa" strokeWidth="2" />
                  <rect x="148" y="130" width="4" height="8" rx="1" fill="#ffffff" />
                  {/* Stand-Up Storm Collar */}
                  <path
                    d="M136 98 L164 98 L160 114 L140 114 Z"
                    fill={topDark}
                    stroke={topLight}
                    strokeWidth="1.2"
                  />
                </g>
              )}
            </g>
          )}

          {/* 4. REAL WORN HEADWEAR (ATHLETIC CAP OR RIBBED BEANIE ON HEAD) */}
          {headProduct && (
            <g
              id="worn-head"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onClick={() => onSlotSelect && onSlotSelect('head')}
            >
              {headProduct.garmentStyle === 'beanie' ? (
                /* Ribbed Knit Merino Beanie */
                <g>
                  {/* Beanie Crown */}
                  <path
                    d="M128 62 Q125 24 150 24 Q175 24 172 62 Z"
                    fill={headProduct.garmentColor || '#18181b'}
                    stroke="#52525b"
                    strokeWidth="1.5"
                  />
                  {/* Vertical Rib lines */}
                  {[134, 140, 146, 154, 160, 166].map((rx, i) => (
                    <line key={i} x1={rx} y1="30" x2={rx} y2="60" stroke="#71717a" strokeWidth="0.8" opacity="0.6" />
                  ))}
                  {/* Foldover Cuff */}
                  <rect x="126" y="52" width="48" height="12" rx="3" fill="#27272a" stroke="#71717a" strokeWidth="1" />
                </g>
              ) : (
                /* Curved Athletic Baseball Cap */
                <g>
                  {/* Crown */}
                  <path
                    d="M130 54 Q150 26 170 54 L173 64 L127 64 Z"
                    fill={headProduct.garmentColor || '#121215'}
                    stroke="#52525b"
                    strokeWidth="1.5"
                  />
                  {/* Curved Visor Bill */}
                  <path
                    d="M123 62 L177 62 L185 67 L121 67 Z"
                    fill="#000000"
                    stroke="#52525b"
                    strokeWidth="1.2"
                  />
                  {/* Top Button & Eyelets */}
                  <circle cx="150" cy="38" r="2" fill="#ffffff" />
                  {/* Embroidered HURANOW Dot Logo */}
                  <rect x="147" y="44" width="6" height="6" rx="1.5" fill="#ffffff" />
                </g>
              )}
            </g>
          )}

          {/* 5. REAL WORN EYEWEAR / JEWELRY (POLARIZED SUNGLASSES OR GOLD CHAIN) */}
          {faceProduct && (
            <g
              id="worn-face"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onClick={() => onSlotSelect && onSlotSelect('face')}
            >
              {faceProduct.garmentStyle === 'chain' ? (
                /* 18K Gold Box Chain Necklace around Neck */
                <path
                  d="M141 106 Q150 128 159 106"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              ) : (
                /* Polarized Sunglasses */
                <g>
                  <rect x="133" y="56" width="15" height="10" rx="2" fill="#000000" stroke="#52525b" strokeWidth="1.2" />
                  <line x1="148" y1="59" x2="152" y2="59" stroke="#71717a" strokeWidth="1.5" />
                  <rect x="152" y="56" width="15" height="10" rx="2" fill="#000000" stroke="#52525b" strokeWidth="1.2" />
                  {/* Polarized Glare Sheen */}
                  <line x1="135" y1="58" x2="144" y2="62" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <line x1="154" y1="58" x2="163" y2="62" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                </g>
              )}
            </g>
          )}

          {/* 6. REAL WORN BAG & CARRY (CROSSBODY SLING OR TITANIUM WATCH) */}
          {bagProduct && (
            <g
              id="worn-bag"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onClick={() => onSlotSelect && onSlotSelect('bag')}
            >
              {bagProduct.garmentStyle === 'watch' ? (
                /* Titanium Sport Chrono on Left Wrist */
                <g transform="translate(86 325)">
                  <rect x="0" y="4" width="12" height="16" rx="2" fill="#18181b" stroke="#52525b" strokeWidth="1" />
                  <circle cx="6" cy="12" r="5.5" fill="#09090b" stroke="#e4e4e7" strokeWidth="1.2" />
                  <circle cx="6" cy="12" r="2" fill="#38bdf8" />
                </g>
              ) : (
                /* Cordura & Sisal Tactical Crossbody Sling */
                <g>
                  {/* Diagonal Tactical Webbing Strap */}
                  <line
                    x1={150 - 44 * currentBuild.shoulder * sizeMult}
                    y1="116"
                    x2="185"
                    y2="240"
                    stroke="#18181b"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <line
                    x1={150 - 44 * currentBuild.shoulder * sizeMult}
                    y1="116"
                    x2="185"
                    y2="240"
                    stroke="#52525b"
                    strokeWidth="1.2"
                  />
                  {/* Cordura & Sisal Pouch at Hip */}
                  <g transform="translate(175 220)">
                    <rect x="0" y="0" width="34" height="44" rx="4" fill="#141416" stroke="#52525b" strokeWidth="1.5" />
                    {/* Rwandan Sisal Agaseke Stripe */}
                    <rect x="4" y="10" width="26" height="12" fill="#78350f" opacity="0.9" rx="1" />
                    {/* Magnetic Buckle */}
                    <rect x="12" y="28" width="10" height="6" rx="1" fill="#ffffff" />
                  </g>
                </g>
              )}
            </g>
          )}

          {/* ======================================================== */}
          {/* INTERACTIVE MEASUREMENT RULER GUIDES (SHOWS BODY SPECS)   */}
          {/* ======================================================== */}
          {showRulerGuides && (
            <g id="ruler-guides" className="pointer-events-none text-[9px] font-mono font-bold">
              {/* Height Vertical Line on Left */}
              <line x1="28" y1="35" x2="28" y2="550" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="22" y1="35" x2="34" y2="35" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="22" y1="550" x2="34" y2="550" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="32" y="48" fill="#f59e0b" fontSize="9" fontWeight="bold">
                {userHeight} cm
              </text>

              {/* Chest Width Guideline */}
              <line x1={150 - 42 * currentBuild.chest} y1="150" x2={150 + 42 * currentBuild.chest} y2="150" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
              <text x="5" y="153" fill="#38bdf8" fontSize="8" fontWeight="bold">
                Chest {chestCm}cm
              </text>

              {/* Waist Guideline */}
              <line x1={150 - 28 * currentBuild.waist} y1="242" x2={150 + 28 * currentBuild.waist} y2="242" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2 2" />
              <text x="5" y="245" fill="#a78bfa" fontSize="8" fontWeight="bold">
                Waist {waistCm}cm
              </text>

              {/* Inseam Leg Guideline */}
              <line x1="85" y1="310" x2="85" y2="505" stroke="#34d399" strokeWidth="1" strokeDasharray="2 2" />
              <text x="5" y="415" fill="#34d399" fontSize="8" fontWeight="bold">
                Inseam {inseamCm}cm
              </text>
            </g>
          )}

        </svg>

        {/* Floating Hotspot Badges on Body */}
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-300 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-700 shadow-lg">
              {finish === 'obsidian' ? 'Matte Obsidian Boutique Sculpt' : finish === 'cocoa' ? 'Rich Cocoa African Sculpt' : 'Athletic White Studio Sculpt'}
            </span>
            <span className="text-[10px] text-amber-400 font-bold bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-500/40 shadow-lg">
              {userHeight} cm • Size {selectedSize} • {userLength.toUpperCase()}
            </span>
          </div>
        </div>

      </div>

      {/* BOTTOM USER CUSTOMIZATION CONTROLS: HEIGHT SLIDER, LENGTH & BODY BUILD BUTTONS */}
      <div className="w-full bg-[#111115] border-t border-zinc-800 p-3.5 rounded-b-2xl space-y-3 z-30">
        
        {/* Height Slider */}
        <div className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 shrink-0 font-bold">
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span>Height / Length:</span>
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

        {/* Length Preference (Crop vs Regular vs Tall) */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="text-zinc-400 text-[11px] font-semibold shrink-0">
            Garment Length:
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
            {userLength === 'crop' ? 'Hem: Above waist' : userLength === 'tall' ? 'Hem: Past hips' : 'Hem: Natural hip'}
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
