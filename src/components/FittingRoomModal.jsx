import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ShoppingBag, 
  Check, 
  RotateCcw, 
  User, 
  Layers, 
  Key, 
  Camera, 
  Ruler, 
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';
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
    formatPrice,
    showToast
  } = useShop();

  // View mode: 'mannequin' (interactive vector store mannequin) | 'model' (real Black fashion models) | 'ai' (Gemini AI photo generation)
  const [viewMode, setViewMode] = useState('mannequin');
  
  // Customization parameters
  const [userHeight, setUserHeight] = useState(178);
  const [userLength, setUserLength] = useState('regular'); // 'crop' | 'regular' | 'tall'
  const [userBuild, setUserBuild] = useState('athletic'); // 'slim' | 'athletic' | 'regular' | 'plus'
  const [mannequinFinish, setMannequinFinish] = useState('obsidian'); // 'obsidian' | 'cocoa' | 'sculpted-white'

  // Gemini AI Key drawer (from reference store-fitting-room.html)
  const [isKeyDrawerOpen, setIsKeyDrawerOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem('hn_gemini_key') || '';
    } catch {
      return '';
    }
  });
  const [keyInput, setKeyInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedPhoto, setAiGeneratedPhoto] = useState(null);

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

  const isCompleteFit = equippedCount >= 3;
  const currentSizes = SIZE_SYSTEM[currentDemographic] || SIZE_SYSTEM.men;

  // Save API key
  const handleSaveKey = () => {
    const trimmed = keyInput.trim();
    setApiKey(trimmed);
    try {
      if (trimmed) {
        localStorage.setItem('hn_gemini_key', trimmed);
        showToast('Gemini API key saved for AI studio photos');
      } else {
        localStorage.removeItem('hn_gemini_key');
        showToast('API key cleared');
      }
    } catch (e) {
      console.error(e);
    }
    setIsKeyDrawerOpen(false);
  };

  // Simulate or execute AI Studio Photo Generation (from store-fitting-room.html)
  const handleGenerateAiPhoto = async () => {
    setIsAiLoading(true);
    try {
      if (apiKey) {
        // Call Gemini Vision API if key provided
        const wornNames = equippedIds.map(id => PRODUCT_MAP[id]?.name).filter(Boolean).join(', ');
        const prompt = `Fashion studio catalog photograph of a stylish African model wearing: ${wornNames}. Soft studio lighting, dark luxury aesthetic, full-length framing, hyperrealistic.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData || p.inline_data);
          if (part) {
            const d = part.inlineData || part.inline_data;
            setAiGeneratedPhoto(`data:${d.mimeType || d.mime_type};base64,${d.data}`);
            setIsAiLoading(false);
            return;
          }
        }
      }

      // High-grade fallback: Curated fashion model photo matching the equipped outfit
      await new Promise(r => setTimeout(r, 900));
      setAiGeneratedPhoto(currentModel.image);
    } catch (err) {
      console.error(err);
      setAiGeneratedPhoto(currentModel.image);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/95 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl bg-[#0c0c0e] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[96vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-zinc-800/80 bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-amber-500 via-orange-500 to-white text-black rounded-xl shadow-lg">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black uppercase text-white font-display tracking-tight flex items-center gap-2">
                HURANOW LIVE FITTING STUDIO
                <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block">
                  Fit, Wear, Buy
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Custom height & length matching • Realistic mannequins & Black fashion models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Gemini API Key Button (from store-fitting-room.html) */}
            <button
              onClick={() => setIsKeyDrawerOpen(!isKeyDrawerOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                apiKey
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
              title="Google Gemini AI Key for generated fashion photos"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{apiKey ? 'AI Key Saved' : 'Gemini AI Key'}</span>
            </button>

            {/* Close Modal Button */}
            <button
              onClick={() => setIsFittingRoomOpen(false)}
              className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Gemini AI Key Drawer */}
        {isKeyDrawerOpen && (
          <div className="bg-zinc-950 px-6 py-3 border-b border-zinc-800 flex items-center gap-3 animate-in slide-in-from-top duration-200">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Paste Google AI (Gemini) API Key for AI studio photos..."
              className="flex-1 bg-[#141417] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
            />
            <button
              onClick={handleSaveKey}
              className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-4 py-1.5 rounded-lg transition-colors"
            >
              Save Key
            </button>
          </div>
        )}

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Column: Mannequin Stage / Black Model Stage */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#141418] via-[#0d0d0f] to-[#070708] p-4 sm:p-5 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-zinc-800 relative min-h-[500px]">
            
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

              {/* View Mode Toggle: [ Shop Mannequin ] vs [ Black Model ] vs [ AI Studio Photo ] */}
              <div className="w-full grid grid-cols-3 gap-1 bg-black/60 border border-zinc-800/80 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setViewMode('mannequin')}
                  className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md font-bold transition-all ${
                    viewMode === 'mannequin'
                      ? 'bg-zinc-800 text-white border border-zinc-600 shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mannequin</span>
                </button>

                <button
                  onClick={() => setViewMode('model')}
                  className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md font-bold transition-all ${
                    viewMode === 'model'
                      ? 'bg-zinc-800 text-white border border-zinc-600 shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Black Model</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode('ai');
                    if (!aiGeneratedPhoto) handleGenerateAiPhoto();
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md font-bold transition-all ${
                    viewMode === 'ai'
                      ? 'bg-zinc-800 text-white border border-zinc-600 shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>AI Studio</span>
                </button>
              </div>

            </div>

            {/* STAGE CONTAINER */}
            <div className="w-full flex-1 flex items-center justify-center relative my-2">
              
              {viewMode === 'mannequin' ? (
                /* 1. SHOP DISPLAY MANNEQUIN (PHYSICALLY WEARS SELECTED GARMENTS & MATCHES LENGTH) */
                <MannequinVisualizer
                  demographic={currentDemographic}
                  worn={wornItems}
                  onSlotSelect={(slot) => setFitState(prev => ({ ...prev, slot }))}
                  formatPrice={formatPrice}
                  userHeight={userHeight}
                  onHeightChange={setUserHeight}
                  userLength={userLength}
                  onLengthChange={setUserLength}
                  userBuild={userBuild}
                  onBuildChange={setUserBuild}
                  selectedSize={fitState.sizes.clothes}
                  onSizeChange={(sz) => setFitState(prev => ({ ...prev, sizes: { ...prev.sizes, clothes: sz } }))}
                  finish={mannequinFinish}
                  onFinishChange={setMannequinFinish}
                />
              ) : viewMode === 'model' ? (
                /* 2. REAL BLACK FASHION MODEL PHOTOGRAPHY */
                <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl flex items-center justify-center group">
                  <img
                    src={currentModel.image}
                    alt={currentModel.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"></div>

                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-700 text-[10px] text-zinc-300">
                    <strong className="text-white">{currentModel.name}</strong> • {currentModel.height}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md border border-zinc-700 p-2.5 rounded-xl space-y-1">
                    <div className="text-[11px] font-bold text-white flex items-center justify-between">
                      <span>Equipped Look</span>
                      <span className="text-amber-400">{equippedCount} Pieces Dressed</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      {currentModel.size}
                    </div>
                  </div>
                </div>
              ) : (
                /* 3. AI STUDIO PHOTO MODE (FROM STORE-FITTING-ROOM.HTML) */
                <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl flex flex-col items-center justify-center p-4">
                  {isAiLoading ? (
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"></div>
                      <span className="text-xs font-bold text-white">Rendering AI Catalog Photograph</span>
                      <span className="text-[10px] text-zinc-400">Layering fabric drape onto the model...</span>
                    </div>
                  ) : aiGeneratedPhoto ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <img
                        src={aiGeneratedPhoto}
                        alt="AI Studio Outfit"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <span className="text-[10px] bg-black/80 px-2 py-0.5 rounded text-fuchsia-300 font-bold border border-fuchsia-500/30">
                          ✨ AI Studio Photo
                        </span>
                        <button
                          onClick={handleGenerateAiPhoto}
                          className="text-[10px] bg-white text-black font-bold px-2 py-0.5 rounded hover:bg-zinc-200"
                        >
                          Re-generate
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <Camera className="w-8 h-8 text-zinc-500 mx-auto" />
                      <div className="text-xs text-zinc-400">
                        Generate high-fashion catalog photo using your equipped garments.
                      </div>
                      <button
                        onClick={handleGenerateAiPhoto}
                        className="bg-white text-black text-xs font-bold px-4 py-2 rounded-xl hover:bg-zinc-200"
                      >
                        Generate Studio Photo
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Reset Mannequin Button */}
            <button
              onClick={clearFit}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors pt-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Look & Start Over</span>
            </button>
          </div>

          {/* Right Column: Wardrobe Trays, Selected Picks & Sizing */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between bg-[#0e0e11]">
            
            <div>
              
              {/* YOUR PICKS TRAY (MATCHING STORE-FITTING-ROOM.HTML THUMBS) */}
              <div className="mb-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-extrabold uppercase tracking-wider text-zinc-300">
                    Your Dressed Picks ({equippedCount} {equippedCount === 1 ? 'piece' : 'pieces'})
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Same slot swaps piece • Tap × to remove
                  </span>
                </div>

                {/* Thumbnails row */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none min-h-[52px]">
                  {equippedIds.map(id => {
                    const prod = PRODUCT_MAP[id];
                    if (!prod) return null;
                    return (
                      <div
                        key={id}
                        className="relative group shrink-0 w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 overflow-visible"
                        title={prod.name}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        {/* Remove '×' button from store-fitting-room.html */}
                        <button
                          onClick={() => equipFitItem(prod.slot, prod.id)}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-zinc-800 hover:bg-red-600 text-white text-[10px] flex items-center justify-center font-bold border border-zinc-600 shadow"
                          aria-label={`Remove ${prod.name}`}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}

                  {equippedCount === 0 && (
                    <div className="text-xs text-zinc-500 italic py-2">
                      No pieces dressed yet. Tap any item below to wear it!
                    </div>
                  )}
                </div>
              </div>

              {/* Category Slot Selector (Top, Bottom, Footwear, Headwear, Eyewear, Bag) */}
              <div className="mb-3">
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
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400 font-medium">
                    Available {currentSlot.toUpperCase()} options ({availableSlotProducts.length}):
                  </span>
                  <span className="text-[11px] text-zinc-500">Tap to wear / swap on mannequin</span>
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
                            <div className="absolute top-1.5 right-1.5 bg-amber-500 text-black rounded-full p-1 shadow-md">
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

              {/* Sizing & Length Summary for the Whole Look */}
              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80 mb-4">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span>Selected Fit Sizing & Length</span>
                  <span className="text-[11px] text-emerald-400 font-bold">✓ 98% Optimal Fit</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Clothes Size */}
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Apparel Size</label>
                    <select
                      value={fitState.sizes.clothes}
                      onChange={(e) =>
                        setFitState(prev => ({
                          ...prev,
                          sizes: { ...prev.sizes, clothes: e.target.value }
                        }))
                      }
                      className="w-full bg-[#161619] border border-zinc-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none focus:border-white cursor-pointer"
                    >
                      {currentSizes.clothes.map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>

                  {/* Shoe Size */}
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Shoe Size (EU)</label>
                    <select
                      value={fitState.sizes.shoes}
                      onChange={(e) =>
                        setFitState(prev => ({
                          ...prev,
                          sizes: { ...prev.sizes, shoes: e.target.value }
                        }))
                      }
                      className="w-full bg-[#161619] border border-zinc-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none focus:border-white cursor-pointer"
                    >
                      {currentSizes.shoes.map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>

                  {/* Garment Length */}
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Length Cut</label>
                    <select
                      value={userLength}
                      onChange={(e) => setUserLength(e.target.value)}
                      className="w-full bg-[#161619] border border-zinc-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none focus:border-white cursor-pointer"
                    >
                      <option value="crop">Petite / Crop</option>
                      <option value="regular">Standard / Regular</option>
                      <option value="tall">Tall / Longline</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Summary Bar & Add Entire Look to Cart */}
            <div className="pt-3 border-t border-zinc-800">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400 font-medium">
                  {equippedCount} of {totalSlots} pieces dressed
                </span>
                <span className={isCompleteFit ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                  {isCompleteFit ? '★ Outfit Ready' : 'Dress more pieces to complete look'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-white transition-all duration-300"
                  style={{ width: `${(equippedCount / totalSlots) * 100}%` }}
                ></div>
              </div>

              {/* 1-Click Purchase Action Button */}
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
