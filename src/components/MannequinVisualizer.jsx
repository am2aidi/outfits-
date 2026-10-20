import React, { useState } from 'react';
import { Ruler, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { PRODUCT_MAP } from '../data/products';

export default function MannequinVisualizer({
  demographic = 'men',
  worn = {},
  onSlotSelect,
  formatPrice,
  userHeight = 178,
  onHeightChange,
  userBuild = 'athletic',
  onBuildChange,
  selectedSize = 'L'
}) {
  // Mannequin finish: 'obsidian' (matte black like uploaded photo 2) or 'sculpted-white' (like uploaded photo 1)
  const [finish, setFinish] = useState('obsidian');
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
    slim: { chest: 0.92, waist: 0.90, hip: 0.92, arm: 0.92, shoulder: 0.95 },
    athletic: { chest: 1.08, waist: 0.96, hip: 1.02, arm: 1.08, shoulder: 1.06 },
    regular: { chest: 1.0, waist: 1.0, hip: 1.0, arm: 1.0, shoulder: 1.0 },
    plus: { chest: 1.18, waist: 1.20, hip: 1.16, arm: 1.14, shoulder: 1.08 }
  };

  const currentBuild = buildFactors[userBuild] || buildFactors.athletic;

  // Height scaling
  const heightRatio = userHeight / 175; // baseline 175 cm
  const legScale = Math.min(1.15, Math.max(0.85, heightRatio));

  // Material Palette based on Finish
  const isObsidian = finish === 'obsidian';
  const mannequinBase = isObsidian ? '#141416' : '#e4e4e7';
  const mannequinHighlight = isObsidian ? '#27272a' : '#ffffff';
  const mannequinShadow = isObsidian ? '#09090b' : '#a1a1aa';
  const mannequinJoint = isObsidian ? '#050505' : '#71717a';

  // Real-time anatomical body measurements (in cm)
  const chestCm = Math.round((userBuild === 'slim' ? 92 : userBuild === 'athletic' ? 104 : userBuild === 'plus' ? 118 : 98) * heightRatio);
  const waistCm = Math.round((userBuild === 'slim' ? 74 : userBuild === 'athletic' ? 82 : userBuild === 'plus' ? 98 : 80) * heightRatio);
  const inseamCm = Math.round(userHeight * 0.465);

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none">
      
      {/* Top Header: Finish Toggle & Specs Toggle */}
      <div className="w-full flex items-center justify-between px-3 py-2 z-30 text-[11px] bg-black/70 backdrop-blur-md border-b border-zinc-800 rounded-t-2xl">
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setFinish('obsidian')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              isObsidian
                ? 'bg-zinc-800 text-white shadow border border-zinc-600'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Matte Obsidian Mannequin
          </button>
          <button
            onClick={() => setFinish('sculpted-white')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              !isObsidian
                ? 'bg-zinc-800 text-white shadow border border-zinc-600'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sculpted White Mannequin
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
          <span>{showRulerGuides ? 'Hide Measurements' : 'Show Measurements'}</span>
        </button>
      </div>

      {/* Main Mannequin Stage SVG with High-Precision Anatomical Sculpting & Layered Garments */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[460px] overflow-hidden py-3">
        
        {/* Overhead Retail Spotlight Background */}
        <div className="absolute top-0 w-80 h-80 bg-radial from-zinc-700/15 via-black/80 to-black blur-2xl pointer-events-none"></div>

        <svg
          viewBox="0 0 300 580"
          className="w-full h-full max-h-[500px] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
          aria-label="High-End Sculpted Retail Store Mannequin"
        >
          <defs>
            {/* Mannequin Body Surface Shading Gradient */}
            <linearGradient id="mqShade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={mannequinHighlight} />
              <stop offset="35%" stopColor={mannequinBase} />
              <stop offset="85%" stopColor={mannequinShadow} />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>

            {/* Glass Pedestal Plate Gradient (matching user's uploaded photo 2 circular glass stand) */}
            <radialGradient id="glassPlate" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="70%" stopColor="rgba(120,120,130,0.15)" />
              <stop offset="95%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
            </radialGradient>

            {/* Real Clothing Fabric Textures */}
            <linearGradient id="fabricJacket" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c2c32" />
              <stop offset="45%" stopColor="#1a1a1e" />
              <stop offset="85%" stopColor="#0f0f12" />
              <stop offset="100%" stopColor="#070709" />
            </linearGradient>

            <linearGradient id="fabricHoodie" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#323238" />
              <stop offset="50%" stopColor="#222226" />
              <stop offset="100%" stopColor="#121215" />
            </linearGradient>

            <linearGradient id="fabricPants" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#25252a" />
              <stop offset="40%" stopColor="#17171a" />
              <stop offset="85%" stopColor="#0d0d10" />
              <stop offset="100%" stopColor="#050506" />
            </linearGradient>

            <linearGradient id="fabricSneaker" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a2a30" />
              <stop offset="50%" stopColor="#151518" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>

            {/* Imigongo African Subtle Geometric Pattern */}
            <pattern id="imigongoGrid" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M0 7L7 0L14 7L7 14Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* ======================================================== */}
          {/* BASE: CIRCULAR GLASS PEDESTAL STAND (FROM UPLOADED PHOTO)*/}
          {/* ======================================================== */}
          <g id="pedestal-stand">
            {/* Cast floor shadow */}
            <ellipse cx="150" cy="564" rx="88" ry="13" fill="#000000" opacity="0.8" />
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
                stroke={isObsidian ? '#27272a' : '#cbd5e1'}
                strokeWidth="1"
              />
              {/* Left Kneecap Contour */}
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
                stroke={isObsidian ? '#27272a' : '#cbd5e1'}
                strokeWidth="1"
              />
              {/* Right Kneecap Contour */}
              <ellipse cx="172" cy="410" rx="6" ry="7" fill={mannequinHighlight} opacity="0.3" />

              {/* Bare Feet on Pedestal if no shoes */}
              {!shoeProduct && (
                <g id="bare-feet" fill="url(#mqShade)">
                  <path d="M125 528 Q115 540 110 545 L138 545 Q136 535 135 528 Z" />
                  <path d="M165 528 Q164 535 162 545 L190 545 Q185 540 175 528 Z" />
                </g>
              )}
            </g>

            {/* 2. Mannequin Torso & Athletic Chest */}
            <g id="torso">
              {/* Pelvis & Briefs Line (like in black mannequin photo) */}
              <path
                d={`M${150 - 30 * currentBuild.hip} 245 
                   L${150 + 30 * currentBuild.hip} 245 
                   L${150 + 24 * currentBuild.hip} 278 
                   L${150 - 24 * currentBuild.hip} 278 Z`}
                fill={mannequinJoint}
                stroke={isObsidian ? '#27272a' : '#cbd5e1'}
                strokeWidth="1"
              />

              {/* Sculpted Waist & Ribcage */}
              <path
                d={`M${150 - 24 * currentBuild.waist} 245 
                   Q${150 - 26 * currentBuild.waist} 205 ${150 - 36 * currentBuild.chest} 150 
                   L${150 - 48 * currentBuild.shoulder} 115 
                   Q150 102 ${150 + 48 * currentBuild.shoulder} 115 
                   L${150 + 36 * currentBuild.chest} 150 
                   Q${150 + 26 * currentBuild.waist} 205 ${150 + 24 * currentBuild.waist} 245 Z`}
                fill="url(#mqShade)"
                stroke={isObsidian ? '#27272a' : '#cbd5e1'}
                strokeWidth="1.2"
              />

              {/* Pectoral & Sternum Muscle Contours (matching user photo 1) */}
              <path
                d={`M${150 - 28 * currentBuild.chest} 145 Q${150 - 15} 165 150 160 Q${150 + 15} 165 ${150 + 28 * currentBuild.chest} 145`}
                fill="none"
                stroke={mannequinHighlight}
                strokeWidth="1.2"
                opacity="0.35"
              />
              <line x1="150" y1="125" x2="150" y2="195" stroke={mannequinHighlight} strokeWidth="1" opacity="0.3" />

              {/* Abdominal Definition (Six-pack shadow lines) */}
              <line x1="142" y1="180" x2="158" y2="180" stroke={mannequinShadow} strokeWidth="1" opacity="0.4" />
              <line x1="144" y1="205" x2="156" y2="205" stroke={mannequinShadow} strokeWidth="1" opacity="0.4" />
            </g>

            {/* 3. Mannequin Articulated Arms & High-Fashion Shoulder Caps (matching photo 2) */}
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
              {/* Left Elbow Joint */}
              <circle cx={150 - 63 * currentBuild.arm} cy="230" r="5" fill={mannequinJoint} opacity="0.7" />
              {/* Left Hand with Relaxed Fingers */}
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
              {/* Right Elbow Joint */}
              <circle cx={150 + 63 * currentBuild.arm} cy="230" r="5" fill={mannequinJoint} opacity="0.7" />
              {/* Right Hand */}
              <path
                d={`M${150 + 54 * currentBuild.arm} 335 Q${150 + 52} 355 ${150 + 50} 366 L${150 + 56} 370 Q${150 + 60} 360 ${150 + 64 * currentBuild.arm} 335 Z`}
                fill="url(#mqShade)"
              />
            </g>

            {/* 4. Sculpted High-Fashion Mannequin Head & Neck (matching photo 2) */}
            <g id="head-and-neck">
              {/* Neck */}
              <path
                d="M141 85 L159 85 L157 114 L143 114 Z"
                fill="url(#mqShade)"
                stroke={isObsidian ? '#27272a' : '#cbd5e1'}
                strokeWidth="1"
              />
              {/* Minimalist Egg-Sculpted Boutique Head */}
              <ellipse
                cx="150"
                cy="62"
                rx="19"
                ry="27"
                fill="url(#mqShade)"
                stroke={isObsidian ? '#3f3f46' : '#cbd5e1'}
                strokeWidth="1.2"
              />
              {/* Sleek Jawline & Temple Reflection */}
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

          {/* 1. REAL WORN BOTTOMS / PANTS / CARGOS */}
          {bottomProduct && (
            <g
              id="worn-pants"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onClick={() => onSlotSelect('bottom')}
              transform={`translate(150 540) scale(1 ${legScale}) translate(-150 -540)`}
            >
              {bottomProduct.garmentStyle === 'skirt' ? (
                /* Pleated Athletic Skort */
                <g>
                  <path
                    d={`M${150 - 28 * currentBuild.waist} 242 
                       L${150 + 28 * currentBuild.waist} 242 
                       L${150 + 48 * currentBuild.hip} 335 
                       L${150 - 48 * currentBuild.hip} 335 Z`}
                    fill="url(#fabricPants)"
                    stroke="#52525b"
                    strokeWidth="1.5"
                  />
                  {/* Pleat lines */}
                  {[-36, -24, -12, 0, 12, 24, 36].map((x, i) => (
                    <line
                      key={i}
                      x1={150 + x * 0.7}
                      y1="250"
                      x2={150 + x * 1.15}
                      y2="333"
                      stroke="#27272a"
                      strokeWidth="1.2"
                    />
                  ))}
                  <rect x={150 - 28 * currentBuild.waist} y="240" width={56 * currentBuild.waist} height="8" rx="2" fill="#27272a" />
                </g>
              ) : bottomProduct.garmentStyle === 'leggings' ? (
                /* High-Rise Sculpt Compression Leggings */
                <g>
                  <path
                    d={`M${150 - 26 * currentBuild.waist} 230 
                       L${150 + 26 * currentBuild.waist} 230 
                       L${150 + 34 * currentBuild.hip} 330 
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
                       Q${150 - 30 * currentBuild.arm} 400 ${150 - 34 * currentBuild.hip} 330 Z`}
                    fill="url(#fabricPants)"
                    stroke="#52525b"
                    strokeWidth="1.2"
                  />
                  {/* Glute & Quad Contour Stitching */}
                  <path
                    d={`M${150 - 22} 260 Q${150 - 10} 340 ${150 - 18} 410 M${150 + 22} 260 Q${150 + 10} 340 ${150 + 18} 410`}
                    fill="none"
                    stroke="#52525b"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  {/* High Waistband */}
                  <rect x={150 - 26 * currentBuild.waist} y="222" width={52 * currentBuild.waist} height="12" rx="2" fill="#1f1f23" stroke="#52525b" strokeWidth="1" />
                </g>
              ) : (
                /* Tactical Cargo Trousers */
                <g>
                  {/* Trousers Legs */}
                  <path
                    d={`M${150 - 28 * currentBuild.waist} 242 
                       L${150 + 28 * currentBuild.waist} 242 
                       L${150 + 36 * currentBuild.hip} 330 
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
                       Q${150 - 32 * currentBuild.arm} 400 ${150 - 36 * currentBuild.hip} 330 Z`}
                    fill="url(#fabricPants)"
                    stroke="#52525b"
                    strokeWidth="1.5"
                  />

                  {/* 3D Bellows Cargo Pockets on Thighs */}
                  <rect x={150 - 45} y="315" width="14" height="34" rx="2" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
                  <rect x={150 + 31} y="315" width="14" height="34" rx="2" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
                  <rect x={150 - 46} y="313" width="16" height="7" rx="1.5" fill="#27272a" />
                  <rect x={150 + 30} y="313" width="16" height="7" rx="1.5" fill="#27272a" />

                  {/* Knee Articulation Flex Pleats */}
                  <line x1={150 - 24} y1="410" x2={150 - 8} y2="410" stroke="#3f3f46" strokeWidth="1.5" />
                  <line x1={150 - 24} y1="417" x2={150 - 8} y2="417" stroke="#3f3f46" strokeWidth="1.5" />
                  <line x1={150 + 8} y1="410" x2={150 + 24} y2="410" stroke="#3f3f46" strokeWidth="1.5" />
                  <line x1={150 + 8} y1="417" x2={150 + 24} y2="417" stroke="#3f3f46" strokeWidth="1.5" />

                  {/* Cinch Ankle Cuffs */}
                  <rect x={150 - 24} y="500" width="13" height="7" rx="2" fill="#27272a" />
                  <rect x={150 + 11} y="500" width="13" height="7" rx="2" fill="#27272a" />
                </g>
              )}
            </g>
          )}

          {/* 2. REAL WORN TOP / JACKET / HOODIE (WRAPPING TORSO & ARMS) */}
          {topProduct && (
            <g
              id="worn-jacket"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onClick={() => onSlotSelect('top')}
            >
              {topProduct.garmentStyle === 'croptop' ? (
                /* Seamless Sculpt Crop Top */
                <g>
                  <path
                    d={`M${150 - 32 * currentBuild.chest} 115 
                       L${150 + 32 * currentBuild.chest} 115 
                       L${150 + 26 * currentBuild.waist} 195 
                       L${150 - 26 * currentBuild.waist} 195 Z`}
                    fill="url(#fabricJacket)"
                    stroke="#52525b"
                    strokeWidth="1.5"
                  />
                  <rect x={150 - 26 * currentBuild.waist} y="185" width={52 * currentBuild.waist} height="10" fill="#27272a" />
                </g>
              ) : topProduct.garmentStyle === 'hoodie' ? (
                /* Heavyweight 480GSM Oversized Hoodie */
                <g>
                  {/* Oversized Body */}
                  <path
                    d={`M${150 - 46 * currentBuild.shoulder} 115 
                       L${150 + 46 * currentBuild.shoulder} 115 
                       L${150 + 36 * currentBuild.chest} 255 
                       L${150 - 36 * currentBuild.chest} 255 Z`}
                    fill="url(#fabricHoodie)"
                    stroke="#52525b"
                    strokeWidth="1.5"
                  />
                  {/* Full Sleeves Covering Arms */}
                  <path
                    d={`M${150 - 46 * currentBuild.shoulder} 115 
                       L${150 - 74 * currentBuild.arm} 230 
                       L${150 - 66 * currentBuild.arm} 335 
                       L${150 - 52 * currentBuild.arm} 335 
                       L${150 - 56 * currentBuild.arm} 230 
                       L${150 - 36 * currentBuild.chest} 150 Z`}
                    fill="url(#fabricHoodie)"
                    stroke="#52525b"
                    strokeWidth="1.2"
                  />
                  <path
                    d={`M${150 + 46 * currentBuild.shoulder} 115 
                       L${150 + 74 * currentBuild.arm} 230 
                       L${150 + 66 * currentBuild.arm} 335 
                       L${150 + 52 * currentBuild.arm} 335 
                       L${150 + 56 * currentBuild.arm} 230 
                       L${150 + 36 * currentBuild.chest} 150 Z`}
                    fill="url(#fabricHoodie)"
                    stroke="#52525b"
                    strokeWidth="1.2"
                  />

                  {/* Double Layer Hood Around Neck */}
                  <path
                    d="M128 100 Q150 78 172 100 Q160 128 150 128 Q140 128 128 100 Z"
                    fill="#1e1e24"
                    stroke="#52525b"
                    strokeWidth="1.5"
                  />

                  {/* Kangaroo Pocket */}
                  <path
                    d={`M${150 - 22} 200 L${150 + 22} 200 L${150 + 28} 248 L${150 - 28} 248 Z`}
                    fill="#18181b"
                    stroke="#3f3f46"
                    strokeWidth="1.2"
                  />
                  {/* Ribbed Hem at Waist */}
                  <rect x={150 - 36 * currentBuild.chest} y="247" width={72 * currentBuild.chest} height="10" rx="2" fill="#222226" />
                </g>
              ) : (
                /* Kigali Stealth Windrunner Track Jacket */
                <g>
                  {/* Jacket Body */}
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder} 114 
                       L${150 + 48 * currentBuild.shoulder} 114 
                       L${150 + 32 * currentBuild.chest} 250 
                       L${150 - 32 * currentBuild.chest} 250 Z`}
                    fill="url(#fabricJacket)"
                    stroke="#52525b"
                    strokeWidth="1.5"
                  />

                  {/* Subtle Imigongo Geometric Texture */}
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder} 114 
                       L${150 + 48 * currentBuild.shoulder} 114 
                       L${150 + 32 * currentBuild.chest} 250 
                       L${150 - 32 * currentBuild.chest} 250 Z`}
                    fill="url(#imigongoGrid)"
                  />

                  {/* Sleeves Covering the Arms */}
                  <path
                    d={`M${150 - 48 * currentBuild.shoulder} 114 
                       L${150 - 72 * currentBuild.arm} 230 
                       L${150 - 64 * currentBuild.arm} 330 
                       L${150 - 52 * currentBuild.arm} 330 
                       L${150 - 56 * currentBuild.arm} 230 
                       L${150 - 34 * currentBuild.chest} 145 Z`}
                    fill="url(#fabricJacket)"
                    stroke="#52525b"
                    strokeWidth="1.2"
                  />
                  <path
                    d={`M${150 + 48 * currentBuild.shoulder} 114 
                       L${150 + 72 * currentBuild.arm} 230 
                       L${150 + 64 * currentBuild.arm} 330 
                       L${150 + 52 * currentBuild.arm} 330 
                       L${150 + 56 * currentBuild.arm} 230 
                       L${150 + 34 * currentBuild.chest} 145 Z`}
                    fill="url(#fabricJacket)"
                    stroke="#52525b"
                    strokeWidth="1.2"
                  />

                  {/* 26° Chevron V-Line on Chest (Nike Windrunner Signature) */}
                  <path
                    d={`M${150 - 46 * currentBuild.shoulder} 140 L150 178 L${150 + 46 * currentBuild.shoulder} 140`}
                    fill="none"
                    stroke="#52525b"
                    strokeWidth="2.5"
                  />

                  {/* Center Waterproof Taped Zipper & Metallic Slider */}
                  <line x1="150" y1="102" x2="150" y2="250" stroke="#71717a" strokeWidth="2" />
                  <rect x="148" y="130" width="4" height="8" rx="1" fill="#ffffff" />

                  {/* Stand-Up Storm Collar */}
                  <path
                    d="M136 98 L164 98 L160 114 L140 114 Z"
                    fill="#18181b"
                    stroke="#52525b"
                    strokeWidth="1.2"
                  />
                </g>
              )}
            </g>
          )}

          {/* 3. REAL WORN FOOTWEAR (SNEAKERS / RUNNERS ON FEET) */}
          {shoeProduct && (
            <g
              id="worn-shoes"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onClick={() => onSlotSelect('shoe')}
              transform={`translate(150 540) scale(1 ${legScale}) translate(-150 -540)`}
            >
              {/* Left Sneaker */}
              <g transform="translate(100 500)">
                {/* Upper Silhouette */}
                <path
                  d="M10 24 Q24 2 40 2 L46 22 L48 34 L6 34 Z"
                  fill="url(#fabricSneaker)"
                  stroke="#52525b"
                  strokeWidth="1.5"
                />
                {/* Sculpted Midsole & Aerodynamic Air Unit */}
                <path
                  d="M2 30 L52 30 L48 42 L4 42 Z"
                  fill="#18181b"
                  stroke="#52525b"
                  strokeWidth="1.5"
                />
                {/* Carbon Plate Glow Edge */}
                <line x1="6" y1="36" x2="46" y2="36" stroke="#f59e0b" strokeWidth="1.5" />
                {/* Lacing Lines */}
                <line x1="26" y1="8" x2="36" y2="8" stroke="#ffffff" strokeWidth="1.2" />
                <line x1="28" y1="13" x2="38" y2="13" stroke="#ffffff" strokeWidth="1.2" />
                <line x1="30" y1="18" x2="40" y2="18" stroke="#ffffff" strokeWidth="1.2" />
              </g>

              {/* Right Sneaker */}
              <g transform="translate(150 500)">
                {/* Upper Silhouette */}
                <path
                  d="M4 22 L10 2 Q26 2 40 24 L44 34 L2 34 Z"
                  fill="url(#fabricSneaker)"
                  stroke="#52525b"
                  strokeWidth="1.5"
                />
                {/* Midsole */}
                <path
                  d="M0 30 L50 30 L48 42 L4 42 Z"
                  fill="#18181b"
                  stroke="#52525b"
                  strokeWidth="1.5"
                />
                <line x1="4" y1="36" x2="44" y2="36" stroke="#f59e0b" strokeWidth="1.5" />
                {/* Laces */}
                <line x1="14" y1="8" x2="24" y2="8" stroke="#ffffff" strokeWidth="1.2" />
                <line x1="12" y1="13" x2="22" y2="13" stroke="#ffffff" strokeWidth="1.2" />
                <line x1="10" y1="18" x2="20" y2="18" stroke="#ffffff" strokeWidth="1.2" />
              </g>
            </g>
          )}

          {/* 4. REAL WORN HEADWEAR (ATHLETIC CAP ON HEAD) */}
          {headProduct && (
            <g
              id="worn-cap"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onClick={() => onSlotSelect('head')}
            >
              {/* Crown */}
              <path
                d="M130 54 Q150 26 170 54 L173 64 L127 64 Z"
                fill="#121215"
                stroke="#52525b"
                strokeWidth="1.5"
              />
              {/* Curved Athletic Visor Bill */}
              <path
                d="M123 62 L177 62 L185 67 L121 67 Z"
                fill="#000000"
                stroke="#52525b"
                strokeWidth="1.2"
              />
              {/* White Embroidered HURANOW Dot Logo */}
              <rect x="147" y="44" width="6" height="6" rx="1.5" fill="#ffffff" />
            </g>
          )}

          {/* 5. REAL WORN EYEWEAR (POLARIZED SUNGLASSES ON FACE) */}
          {faceProduct && (
            <g
              id="worn-glasses"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onClick={() => onSlotSelect('face')}
            >
              {/* Left Lens */}
              <rect x="133" y="56" width="15" height="10" rx="2" fill="#000000" stroke="#52525b" strokeWidth="1.2" />
              {/* Bridge */}
              <line x1="148" y1="59" x2="152" y2="59" stroke="#71717a" strokeWidth="1.5" />
              {/* Right Lens */}
              <rect x="152" y="56" width="15" height="10" rx="2" fill="#000000" stroke="#52525b" strokeWidth="1.2" />
              {/* Polarized Glare Sheen Lines */}
              <line x1="135" y1="58" x2="144" y2="62" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
              <line x1="154" y1="58" x2="163" y2="62" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
            </g>
          )}

          {/* 6. REAL WORN CROSSBODY SLING (DIAGONAL STRAP & BAG) */}
          {bagProduct && (
            <g
              id="worn-bag"
              className="cursor-pointer transition-all duration-300 hover:brightness-110"
              onClick={() => onSlotSelect('bag')}
            >
              {/* Diagonal Tactical Webbing Strap Across Chest */}
              <line
                x1={150 - 44 * currentBuild.shoulder}
                y1="116"
                x2="185"
                y2="240"
                stroke="#18181b"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <line
                x1={150 - 44 * currentBuild.shoulder}
                y1="116"
                x2="185"
                y2="240"
                stroke="#52525b"
                strokeWidth="1.2"
              />

              {/* Cordura & Sisal Pouch Resting at Hip */}
              <g transform="translate(175 220)">
                <rect x="0" y="0" width="34" height="44" rx="4" fill="#141416" stroke="#52525b" strokeWidth="1.5" />
                {/* Rwandan Sisal Agaseke stripe */}
                <rect x="4" y="10" width="26" height="12" fill="#78350f" opacity="0.85" rx="1" />
                {/* Magnetic Buckle */}
                <rect x="12" y="28" width="10" height="6" rx="1" fill="#ffffff" />
              </g>
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

        {/* Floating Quick Action Hotspots on Body Slots */}
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-400 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-zinc-800">
              {finish === 'obsidian' ? 'Matte Obsidian Boutique Sculpt' : 'Athletic White Anatomical Sculpt'}
            </span>
            <span className="text-[10px] text-amber-400 font-bold bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-amber-500/40">
              {userHeight} cm • Size {selectedSize}
            </span>
          </div>
        </div>

      </div>

      {/* BOTTOM USER CUSTOMIZATION CONTROLS: HEIGHT SLIDER & BODY BUILD BUTTONS */}
      <div className="w-full bg-[#111115] border-t border-zinc-800 p-3.5 rounded-b-2xl space-y-3 z-30">
        
        {/* Height Slider */}
        <div className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 shrink-0 font-bold">
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span>Customer Height / Length:</span>
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

        {/* Body Build Proportions */}
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
