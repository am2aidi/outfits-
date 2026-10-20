import React, { useState } from 'react';
import { Sparkles, Eye, Layers, Check, Info } from 'lucide-react';
import { PRODUCT_MAP } from '../data/products';

export default function MannequinVisualizer({ demographic, worn, onSlotSelect, formatPrice }) {
  const [studioLight, setStudioLight] = useState('spotlight'); // 'spotlight' | 'stealth' | 'bright'

  // Look up equipped products
  const topProduct = worn.top ? PRODUCT_MAP[worn.top] : null;
  const bottomProduct = worn.bottom ? PRODUCT_MAP[worn.bottom] : null;
  const shoeProduct = worn.shoe ? PRODUCT_MAP[worn.shoe] : null;
  const headProduct = worn.head ? PRODUCT_MAP[worn.head] : null;
  const faceProduct = worn.face ? PRODUCT_MAP[worn.face] : null;
  const bagProduct = worn.bag ? PRODUCT_MAP[worn.bag] : null;

  // Base mannequin color & shading
  const mannequinTone = studioLight === 'stealth' ? '#18181b' : studioLight === 'bright' ? '#52525b' : '#27272a';
  const mannequinHighlight = studioLight === 'stealth' ? '#27272a' : '#3f3f46';
  const mannequinJoint = '#111114';

  // Scale based on demographic
  const isKid = demographic === 'kids';
  const isBaby = demographic === 'baby';
  const isFemale = demographic === 'women';

  const scale = isBaby ? 0.65 : isKid ? 0.82 : 1;
  const translateY = isBaby ? 80 : isKid ? 45 : 0;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none">
      
      {/* Studio Lighting Controller */}
      <div className="w-full flex items-center justify-between px-4 pt-2 z-20 text-[11px]">
        <div className="flex items-center gap-1.5 bg-zinc-950/90 border border-zinc-800 px-2.5 py-1 rounded-full text-zinc-400">
          <Eye className="w-3.5 h-3.5 text-zinc-300" />
          <span className="font-semibold text-white uppercase text-[10px] tracking-wider">
            {demographic.toUpperCase()} STORE MANNEQUIN
          </span>
        </div>

        <div className="flex items-center gap-1 bg-zinc-950/90 border border-zinc-800 p-0.5 rounded-full">
          {[
            { id: 'spotlight', label: 'Spotlight' },
            { id: 'stealth', label: 'Stealth' },
            { id: 'bright', label: 'Studio' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setStudioLight(mode.id)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                studioLight === mode.id
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Mannequin Stage SVG */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[440px] overflow-hidden py-4">
        
        {/* Overhead Retail Spotlight Glow */}
        <div
          className={`absolute top-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none transition-opacity duration-700 ${
            studioLight === 'stealth'
              ? 'bg-amber-500/5 opacity-30'
              : studioLight === 'bright'
              ? 'bg-white/20 opacity-90'
              : 'bg-white/10 opacity-70'
          }`}
        ></div>

        <svg
          viewBox="0 0 240 500"
          className="w-full h-full max-h-[460px] filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]"
          aria-label="Interactive Shop Display Mannequin"
        >
          <defs>
            {/* Mannequin Studio Pedestal Gradient */}
            <radialGradient id="pedestalGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#18181b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
            </radialGradient>

            {/* Mannequin Matte Shading Gradient */}
            <linearGradient id="bodyShade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={mannequinHighlight} />
              <stop offset="35%" stopColor={mannequinTone} />
              <stop offset="100%" stopColor="#0c0c0e" />
            </linearGradient>

            {/* Fabric Texture Gradients */}
            <linearGradient id="jacketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="50%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>

            <linearGradient id="hoodieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c2c31" />
              <stop offset="50%" stopColor="#1f1f23" />
              <stop offset="100%" stopColor="#121215" />
            </linearGradient>

            <linearGradient id="pantsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#222226" />
              <stop offset="40%" stopColor="#141416" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>

            <linearGradient id="shoeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="60%" stopColor="#141416" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>

            {/* Imigongo African Subtle Geometric Pattern for Kigali Shell */}
            <pattern id="imigongoGrid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M0 8L8 0L16 8L8 16Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Pedestal Stand on Retail Floor */}
          <ellipse cx="120" cy="475" rx="90" ry="14" fill="url(#pedestalGrad)" />
          <ellipse cx="120" cy="474" rx="60" ry="7" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
          <circle cx="120" cy="474" r="5" fill="#18181b" stroke="#52525b" strokeWidth="1" />

          {/* MAIN MANNEQUIN AND CLOTHING GROUP */}
          <g transform={`translate(120 470) scale(${scale}) translate(-120 -470)`}>

            {/* ======================================================== */}
            {/* LAYER 1: BASE MANNEQUIN BODY (HEAD, TORSO, ARMS, LEGS)    */}
            {/* ======================================================== */}

            {/* Mannequin Legs (Unclothed Base) */}
            <g id="mannequin-legs">
              {/* Left Leg */}
              <path
                d="M96 230 L94 370 L91 445 L106 445 L108 370 L110 230 Z"
                fill="url(#bodyShade)"
                stroke="#18181b"
                strokeWidth="1"
              />
              {/* Left Knee Joint */}
              <circle cx="101" cy="350" r="7" fill={mannequinJoint} opacity="0.6" />

              {/* Right Leg */}
              <path
                d="M130 230 L132 370 L134 445 L149 445 L146 370 L144 230 Z"
                fill="url(#bodyShade)"
                stroke="#18181b"
                strokeWidth="1"
              />
              {/* Right Knee Joint */}
              <circle cx="139" cy="350" r="7" fill={mannequinJoint} opacity="0.6" />
            </g>

            {/* Mannequin Bare Feet / Pedestal Connectors */}
            {!shoeProduct && (
              <g id="mannequin-bare-feet" fill="url(#bodyShade)">
                {/* Left Foot */}
                <path d="M86 450 L108 450 L106 443 L91 443 Z" />
                {/* Right Foot */}
                <path d="M134 443 L149 443 L154 450 L132 450 Z" />
              </g>
            )}

            {/* Mannequin Torso & Hips */}
            <g id="mannequin-torso">
              {isFemale ? (
                /* Female Sculpt Silhouette */
                <path
                  d="M86 98 Q120 90 154 98 L146 150 Q138 185 148 226 Q120 234 92 226 Q102 185 94 150 Z"
                  fill="url(#bodyShade)"
                  stroke="#18181b"
                  strokeWidth="1.2"
                />
              ) : (
                /* Male / Unisex Athletic Silhouette */
                <path
                  d="M78 98 Q120 88 162 98 L154 165 Q150 200 148 230 Q120 236 92 230 Q90 200 86 165 Z"
                  fill="url(#bodyShade)"
                  stroke="#18181b"
                  strokeWidth="1.2"
                />
              )}
            </g>

            {/* Mannequin Arms & Shoulders */}
            <g id="mannequin-arms">
              {/* Left Arm & Hand */}
              <path
                d="M78 102 L56 195 L68 285 L60 286 L48 195 L68 98 Z"
                fill="url(#bodyShade)"
                stroke="#18181b"
                strokeWidth="1"
              />
              <circle cx="53" cy="195" r="5" fill={mannequinJoint} opacity="0.6" />

              {/* Right Arm & Hand */}
              <path
                d="M162 102 L184 195 L172 285 L180 286 L192 195 L172 98 Z"
                fill="url(#bodyShade)"
                stroke="#18181b"
                strokeWidth="1"
              />
              <circle cx="187" cy="195" r="5" fill={mannequinJoint} opacity="0.6" />
            </g>

            {/* Mannequin Head & Neck */}
            <g id="mannequin-head">
              {/* Neck */}
              <path d="M112 78 L128 78 L126 98 L114 98 Z" fill="url(#bodyShade)" />
              
              {/* Sculpted Minimalist Head */}
              <ellipse
                cx="120"
                cy="54"
                rx="18"
                ry="24"
                fill="url(#bodyShade)"
                stroke="#18181b"
                strokeWidth="1"
              />
              {/* Jaw & Chin Line */}
              <path
                d="M106 58 Q120 78 134 58"
                fill="none"
                stroke={mannequinHighlight}
                strokeWidth="1"
                opacity="0.4"
              />
            </g>

            {/* ======================================================== */}
            {/* LAYER 2: WORN PANTS / BOTTOMS (ON MANNEQUIN LEGS)        */}
            {/* ======================================================== */}
            {bottomProduct && (
              <g id="worn-bottoms" className="transition-all duration-300">
                {bottomProduct.garmentStyle === 'skirt' ? (
                  /* Pleated Tennis Skort */
                  <g>
                    <path
                      d="M86 218 L154 218 L170 310 L70 310 Z"
                      fill="url(#pantsGradient)"
                      stroke="#3f3f46"
                      strokeWidth="1.5"
                    />
                    {/* Pleat lines */}
                    {[85, 100, 115, 125, 140, 155].map((x, i) => (
                      <line
                        key={i}
                        x1={x}
                        y1="225"
                        x2={x - 8 + i * 2}
                        y2="308"
                        stroke="#27272a"
                        strokeWidth="1.2"
                      />
                    ))}
                    {/* Waistband */}
                    <path d="M86 218 L154 218 L152 228 L88 228 Z" fill="#27272a" />
                  </g>
                ) : bottomProduct.garmentStyle === 'leggings' ? (
                  /* High-Rise Compression Leggings */
                  <g>
                    <path
                      d="M88 214 L152 214 L154 370 L146 442 L132 442 L130 370 L120 250 L110 370 L108 442 L94 442 L86 370 Z"
                      fill="url(#pantsGradient)"
                      stroke="#3f3f46"
                      strokeWidth="1.2"
                    />
                    {/* Compression glute & quad contour seams */}
                    <path
                      d="M92 230 Q105 280 100 340 M148 230 Q135 280 140 340"
                      fill="none"
                      stroke="#3f3f46"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    {/* High Bonded Waistband */}
                    <path d="M88 206 L152 206 L152 218 L88 218 Z" fill="#222226" stroke="#3f3f46" strokeWidth="1" />
                  </g>
                ) : (
                  /* Tactical Cargo / Swift Track Trousers */
                  <g>
                    {/* Full Trousers Silhouette */}
                    <path
                      d="M84 216 L156 216 L158 375 L150 443 L130 443 L126 365 L120 245 L114 365 L110 443 L90 443 L82 375 Z"
                      fill="url(#pantsGradient)"
                      stroke="#3f3f46"
                      strokeWidth="1.5"
                    />

                    {/* Cargo Bellows Pockets on outer thighs */}
                    <rect x="74" y="270" width="14" height="28" rx="2" fill="#1c1c1f" stroke="#3f3f46" strokeWidth="1.2" />
                    <rect x="152" y="270" width="14" height="28" rx="2" fill="#1c1c1f" stroke="#3f3f46" strokeWidth="1.2" />

                    {/* Articulated Knee Pleats */}
                    <path d="M85 345 L108 345 M85 352 L108 352" stroke="#27272a" strokeWidth="1.5" />
                    <path d="M132 345 L155 345 M132 352 L155 352" stroke="#27272a" strokeWidth="1.5" />

                    {/* Cinch Ankle Bungees */}
                    <rect x="88" y="437" width="23" height="6" rx="2" fill="#27272a" />
                    <rect x="129" y="437" width="23" height="6" rx="2" fill="#27272a" />
                  </g>
                )}
              </g>
            )}

            {/* ======================================================== */}
            {/* LAYER 3: WORN TOPS / JACKETS (ON MANNEQUIN TORSO)        */}
            {/* ======================================================== */}
            {topProduct && (
              <g id="worn-top" className="transition-all duration-300">
                {topProduct.garmentStyle === 'croptop' ? (
                  /* Seamless Sculpt Crop Top */
                  <g>
                    <path
                      d="M84 96 Q120 86 156 96 L148 180 Q120 188 92 180 Z"
                      fill="url(#jacketGradient)"
                      stroke="#52525b"
                      strokeWidth="1.5"
                    />
                    {/* Racerback & Underbust Band */}
                    <path d="M92 172 Q120 178 148 172 L146 182 Q120 188 94 182 Z" fill="#27272a" />
                  </g>
                ) : topProduct.garmentStyle === 'hoodie' ? (
                  /* Heavyweight Oversized Hoodie */
                  <g>
                    {/* Torso & Dropped Shoulders */}
                    <path
                      d="M70 94 Q120 82 170 94 L162 230 Q120 236 78 230 Z"
                      fill="url(#hoodieGradient)"
                      stroke="#3f3f46"
                      strokeWidth="1.5"
                    />

                    {/* Sleeves covering arms */}
                    <path
                      d="M70 94 L42 195 L56 280 L68 280 L56 195 L78 135 Z"
                      fill="url(#hoodieGradient)"
                      stroke="#3f3f46"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M170 94 L198 195 L184 280 L172 280 L184 195 L162 135 Z"
                      fill="url(#hoodieGradient)"
                      stroke="#3f3f46"
                      strokeWidth="1.2"
                    />

                    {/* Double-Layer Hood around Neck */}
                    <path
                      d="M92 84 Q120 62 148 84 Q134 115 120 115 Q106 115 92 84 Z"
                      fill="#1f1f23"
                      stroke="#52525b"
                      strokeWidth="1.5"
                    />

                    {/* Kangaroo Pocket */}
                    <path
                      d="M96 175 L144 175 L150 220 L90 220 Z"
                      fill="#18181b"
                      stroke="#3f3f46"
                      strokeWidth="1.2"
                    />
                  </g>
                ) : topProduct.garmentStyle === 'coat' ? (
                  /* Luxury Track Trench Coat */
                  <g>
                    {/* Full Overcoat drape down past knees */}
                    <path
                      d="M72 90 Q120 78 168 90 L175 360 L65 360 Z"
                      fill="url(#jacketGradient)"
                      stroke="#3f3f46"
                      strokeWidth="1.5"
                    />

                    {/* Coat Sleeves */}
                    <path d="M72 90 L46 195 L56 295 L68 295 L56 195 L76 130 Z" fill="url(#jacketGradient)" stroke="#3f3f46" strokeWidth="1.2" />
                    <path d="M168 90 L194 195 L184 295 L172 295 L184 195 L164 130 Z" fill="url(#jacketGradient)" stroke="#3f3f46" strokeWidth="1.2" />

                    {/* Lapels and Storm Belt */}
                    <path d="M96 82 L120 150 L144 82" stroke="#52525b" strokeWidth="2" fill="none" />
                    <rect x="74" y="200" width="92" height="10" rx="2" fill="#18181b" stroke="#52525b" strokeWidth="1" />
                    <circle cx="120" cy="205" r="4" fill="#3f3f46" />
                  </g>
                ) : (
                  /* Kigali Stealth Windrunner / Track Jacket / Tee */
                  <g>
                    {/* Torso & Chevron Chest */}
                    <path
                      d="M74 94 Q120 84 166 94 L158 226 Q120 234 82 226 Z"
                      fill="url(#jacketGradient)"
                      stroke="#3f3f46"
                      strokeWidth="1.5"
                    />

                    {/* Rwandan Imigongo Geometric subtle overlay */}
                    <path
                      d="M74 94 Q120 84 166 94 L158 226 Q120 234 82 226 Z"
                      fill="url(#imigongoGrid)"
                    />

                    {/* Sleeves Covering the Mannequin Arms */}
                    <path
                      d="M74 94 L48 190 L60 280 L70 280 L60 195 L80 130 Z"
                      fill="url(#jacketGradient)"
                      stroke="#3f3f46"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M166 94 L192 190 L180 280 L170 280 L180 195 L160 130 Z"
                      fill="url(#jacketGradient)"
                      stroke="#3f3f46"
                      strokeWidth="1.2"
                    />

                    {/* Iconic Windrunner Chevron 26° V-Cut on Chest */}
                    <path
                      d="M76 128 L120 162 L164 128"
                      fill="none"
                      stroke="#52525b"
                      strokeWidth="2.5"
                    />

                    {/* Center Taped Zipper with Puller */}
                    <line x1="120" y1="88" x2="120" y2="228" stroke="#52525b" strokeWidth="2" />
                    <rect x="118" y="110" width="4" height="7" rx="1" fill="#ffffff" />

                    {/* Stand-Up Storm Collar */}
                    <path
                      d="M106 82 L134 82 L130 96 L110 96 Z"
                      fill="#18181b"
                      stroke="#52525b"
                      strokeWidth="1.2"
                    />
                  </g>
                )}
              </g>
            )}

            {/* ======================================================== */}
            {/* LAYER 4: WORN FOOTWEAR (ON MANNEQUIN FEET)               */}
            {/* ======================================================== */}
            {shoeProduct && (
              <g id="worn-shoes" className="transition-all duration-300">
                {/* Left Sneaker */}
                <g transform="translate(80 432)">
                  {/* Sneaker Upper */}
                  <path
                    d="M6 18 Q14 2 26 2 L30 18 L32 24 L2 24 Z"
                    fill="url(#shoeGradient)"
                    stroke="#52525b"
                    strokeWidth="1.2"
                  />
                  {/* Thick Sculpted Athletic Sole */}
                  <path
                    d="M0 22 L34 22 L32 29 L2 29 Z"
                    fill="#18181b"
                    stroke="#3f3f46"
                    strokeWidth="1.5"
                  />
                  {/* Carbon Flight Plate Edge Indicator */}
                  <line x1="4" y1="26" x2="30" y2="26" stroke="#fbbf24" strokeWidth="1.2" />
                  {/* Laces */}
                  <line x1="16" y1="6" x2="24" y2="6" stroke="#ffffff" strokeWidth="1" />
                  <line x1="18" y1="10" x2="26" y2="10" stroke="#ffffff" strokeWidth="1" />
                </g>

                {/* Right Sneaker */}
                <g transform="translate(126 432)">
                  {/* Sneaker Upper */}
                  <path
                    d="M2 18 L6 2 Q18 2 26 18 L30 24 L0 24 Z"
                    fill="url(#shoeGradient)"
                    stroke="#52525b"
                    strokeWidth="1.2"
                  />
                  {/* Thick Sculpted Athletic Sole */}
                  <path
                    d="M0 22 L34 22 L32 29 L2 29 Z"
                    fill="#18181b"
                    stroke="#3f3f46"
                    strokeWidth="1.5"
                  />
                  {/* Carbon Plate Edge */}
                  <line x1="4" y1="26" x2="30" y2="26" stroke="#fbbf24" strokeWidth="1.2" />
                  {/* Laces */}
                  <line x1="8" y1="6" x2="16" y2="6" stroke="#ffffff" strokeWidth="1" />
                  <line x1="6" y1="10" x2="14" y2="10" stroke="#ffffff" strokeWidth="1" />
                </g>
              </g>
            )}

            {/* ======================================================== */}
            {/* LAYER 5: WORN ACCESSORIES (CROSSBODY BAG & SLING)         */}
            {/* ======================================================== */}
            {bagProduct && (
              <g id="worn-bag" className="transition-all duration-300">
                {/* Diagonal Crossbody Webbing Strap across Torso */}
                <line
                  x1="82"
                  y1="96"
                  x2="156"
                  y2="218"
                  stroke="#1c1c1f"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <line
                  x1="82"
                  y1="96"
                  x2="156"
                  y2="218"
                  stroke="#3f3f46"
                  strokeWidth="1.5"
                />

                {/* Tactical Bag resting against right hip */}
                <g transform="translate(145 195)">
                  <rect
                    x="0"
                    y="0"
                    width="34"
                    height="42"
                    rx="4"
                    fill="#141416"
                    stroke="#52525b"
                    strokeWidth="1.5"
                  />
                  {/* Sisal Handwoven Texture Accent strip */}
                  <rect x="4" y="10" width="26" height="12" fill="#78350f" opacity="0.8" rx="1" />
                  {/* Magnetic Fidlock Buckle */}
                  <rect x="12" y="26" width="10" height="6" rx="1" fill="#27272a" stroke="#fff" strokeWidth="0.8" />
                </g>
              </g>
            )}

            {/* ======================================================== */}
            {/* LAYER 6: WORN HEADWEAR (CAP / BEANIE ON HEAD)            */}
            {/* ======================================================== */}
            {headProduct && (
              <g id="worn-headwear" className="transition-all duration-300">
                {/* Structured Cap Crown */}
                <path
                  d="M102 46 Q120 22 138 46 L140 54 L100 54 Z"
                  fill="#121215"
                  stroke="#52525b"
                  strokeWidth="1.5"
                />
                {/* Curved Visor Brim */}
                <path
                  d="M96 52 L144 52 L150 56 L94 56 Z"
                  fill="#000000"
                  stroke="#52525b"
                  strokeWidth="1.2"
                />
                {/* HURANOW White Badge on Cap */}
                <rect x="116" y="38" width="8" height="6" rx="1" fill="#ffffff" />
              </g>
            )}

            {/* ======================================================== */}
            {/* LAYER 7: WORN EYEWEAR (SUNGLASSES ON FACE)               */}
            {/* ======================================================== */}
            {faceProduct && (
              <g id="worn-eyewear" className="transition-all duration-300">
                {/* Left Lens */}
                <rect x="105" y="48" width="13" height="9" rx="2" fill="#000000" stroke="#52525b" strokeWidth="1" />
                {/* Bridge */}
                <line x1="118" y1="51" x2="122" y2="51" stroke="#3f3f46" strokeWidth="1.5" />
                {/* Right Lens */}
                <rect x="122" y="48" width="13" height="9" rx="2" fill="#000000" stroke="#52525b" strokeWidth="1" />
                {/* Polarized Glare Sheen Reflection */}
                <line x1="107" y1="50" x2="115" y2="54" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
                <line x1="124" y1="50" x2="132" y2="54" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
              </g>
            )}

          </g>
        </svg>

        {/* INTERACTIVE TAP-TO-EQUIP PINS ON MANNEQUIN */}
        {/* Head Pin */}
        <button
          onClick={() => onSlotSelect('head')}
          className={`absolute top-[14%] right-[28%] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
            headProduct
              ? 'bg-amber-400 text-black border-amber-300 ring-2 ring-amber-400/30'
              : 'bg-black/80 text-zinc-400 border-zinc-700 hover:text-white hover:border-white'
          }`}
          title="Headwear Slot"
        >
          {headProduct ? '✓' : '+'}
        </button>

        {/* Eyewear Pin */}
        <button
          onClick={() => onSlotSelect('face')}
          className={`absolute top-[18%] left-[28%] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
            faceProduct
              ? 'bg-cyan-400 text-black border-cyan-300 ring-2 ring-cyan-400/30'
              : 'bg-black/80 text-zinc-400 border-zinc-700 hover:text-white hover:border-white'
          }`}
          title="Eyewear Slot"
        >
          {faceProduct ? '✓' : '+'}
        </button>

        {/* Top / Jacket Pin */}
        <button
          onClick={() => onSlotSelect('top')}
          className={`absolute top-[34%] right-[22%] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
            topProduct
              ? 'bg-white text-black border-white ring-2 ring-white/30'
              : 'bg-black/80 text-zinc-400 border-zinc-700 hover:text-white hover:border-white'
          }`}
          title="Top / Jacket Slot"
        >
          {topProduct ? '✓' : '+'}
        </button>

        {/* Bottom / Pants Pin */}
        <button
          onClick={() => onSlotSelect('bottom')}
          className={`absolute top-[56%] left-[24%] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
            bottomProduct
              ? 'bg-emerald-400 text-black border-emerald-300 ring-2 ring-emerald-400/30'
              : 'bg-black/80 text-zinc-400 border-zinc-700 hover:text-white hover:border-white'
          }`}
          title="Bottoms Slot"
        >
          {bottomProduct ? '✓' : '+'}
        </button>

        {/* Footwear Pin */}
        <button
          onClick={() => onSlotSelect('shoe')}
          className={`absolute bottom-[10%] right-[26%] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
            shoeProduct
              ? 'bg-amber-400 text-black border-amber-300 ring-2 ring-amber-400/30'
              : 'bg-black/80 text-zinc-400 border-zinc-700 hover:text-white hover:border-white'
          }`}
          title="Shoes Slot"
        >
          {shoeProduct ? '✓' : '+'}
        </button>

      </div>

      {/* Equipped Garment Strip at Foot of Mannequin */}
      <div className="w-full px-4 pb-2 z-10">
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="text-zinc-400 text-[11px] truncate">
              {topProduct || bottomProduct || shoeProduct
                ? `${[topProduct?.name, bottomProduct?.name, shoeProduct?.name].filter(Boolean).join(' • ')}`
                : 'Tap wardrobe slots or items below to dress the mannequin.'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
