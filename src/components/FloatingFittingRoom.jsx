import React, { useState } from 'react';
import { Sparkles, X, Maximize2, RotateCcw, ShoppingBag, ChevronUp, ChevronDown, Layers, Ruler } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCT_MAP } from '../data/products';
import MannequinVisualizer from './MannequinVisualizer';

export default function FloatingFittingRoom() {
  const {
    fitState,
    setFitState,
    equipFitItem,
    clearFit,
    addEntireFitToCart,
    formatPrice,
    setIsFittingRoomOpen
  } = useShop();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [userHeight, setUserHeight] = useState(178);
  const [userLength, setUserLength] = useState('regular');
  const [userBuild, setUserBuild] = useState('athletic');
  const [finish, setFinish] = useState('obsidian');

  const wornItems = fitState.worn || {};
  const equippedIds = Object.values(wornItems).filter(Boolean);
  const equippedCount = equippedIds.length;

  const fitTotal = equippedIds.reduce((sum, id) => {
    const prod = PRODUCT_MAP[id];
    return sum + (prod ? prod.price : 0);
  }, 0);

  if (!isVisible) {
    // Small Floating Trigger Pill to reopen
    return (
      <button
        onClick={() => {
          setIsVisible(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-5 left-5 z-40 bg-zinc-950 hover:bg-zinc-900 border border-amber-500/50 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105 group"
        aria-label="Open Floating Fitting Room"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Live Fitting Room ({equippedCount} Fitted)</span>
      </button>
    );
  }

  return (
    <aside
      id="floating-fit-room"
      className={`fixed bottom-4 left-4 z-40 w-[320px] sm:w-[340px] bg-[#0e0e11]/95 backdrop-blur-xl border border-zinc-700/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col transition-all duration-300 overflow-hidden ${
        isMinimized ? 'h-[52px]' : 'max-h-[580px]'
      }`}
      aria-label="Floating Store Fitting Room"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-800 bg-[#141418]/90">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-400 text-black flex items-center justify-center font-black">
            <Sparkles className="w-3.5 h-3.5 fill-black" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-wide flex items-center gap-1.5">
              <span>Fitting Room</span>
              <span className="text-[9px] bg-zinc-800 text-amber-400 border border-zinc-700 px-1.5 py-0.2 rounded font-bold">
                {equippedCount} WORN
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Maximize to full studio */}
          <button
            onClick={() => setIsFittingRoomOpen(true)}
            className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-800 transition-colors"
            title="Expand Full Studio"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Minimize toggle */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-800 transition-colors"
            title={isMinimized ? 'Expand dock' : 'Minimize dock'}
          >
            {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Close / Hide button */}
          <button
            onClick={() => setIsVisible(false)}
            className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center border border-zinc-800 transition-colors"
            title="Close dock"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body Content (Visible when not minimized) */}
      {!isMinimized && (
        <div className="flex-1 flex flex-col p-3 overflow-y-auto max-h-[520px]">
          
          {/* Instructions from store-fitting-room.html */}
          <div className="text-[10px] text-zinc-400 mb-2 flex items-center justify-between">
            <span>Tap hanger on any product to dress it.</span>
            <span className="text-amber-400 font-bold">{userHeight}cm · {userLength}</span>
          </div>

          {/* Live Vector Mannequin Stage */}
          <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-zinc-800 mb-2.5 flex items-center justify-center">
            <MannequinVisualizer
              demographic={fitState.demographic}
              worn={fitState.worn}
              onSlotSelect={() => setIsFittingRoomOpen(true)}
              formatPrice={formatPrice}
              userHeight={userHeight}
              onHeightChange={setUserHeight}
              userLength={userLength}
              onLengthChange={setUserLength}
              userBuild={userBuild}
              onBuildChange={setUserBuild}
              selectedSize={fitState.sizes.clothes}
              finish={finish}
              onFinishChange={setFinish}
            />
          </div>

          {/* Your Picks Thumbnails (from store-fitting-room.html) */}
          <div className="mb-2.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5 font-bold uppercase tracking-wider">
              <span>Your Picks ({equippedCount})</span>
              <button
                onClick={clearFit}
                className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 lowercase"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>clear</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none min-h-[44px]">
              {equippedIds.map(id => {
                const prod = PRODUCT_MAP[id];
                if (!prod) return null;
                return (
                  <div
                    key={id}
                    className="relative shrink-0 w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 overflow-visible"
                    title={prod.name}
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => equipFitItem(prod.slot, prod.id)}
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-zinc-800 hover:bg-red-600 text-white text-[9px] flex items-center justify-center font-bold border border-zinc-600 shadow"
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              {equippedCount === 0 && (
                <div className="text-[10px] text-zinc-500 italic py-1">
                  Tap hanger on products to wear them here.
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-zinc-800 space-y-1.5">
            <button
              onClick={addEntireFitToCart}
              disabled={equippedCount === 0}
              className="w-full py-2.5 px-3 bg-white text-black font-extrabold rounded-xl text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none shadow-lg uppercase tracking-wide"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add Outfit {fitTotal > 0 && `• ${formatPrice(fitTotal)}`}</span>
            </button>

            <button
              onClick={() => setIsFittingRoomOpen(true)}
              className="w-full py-1.5 text-[11px] text-zinc-400 hover:text-white font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span>Open Studio with Models & AI Photo Mode</span>
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

        </div>
      )}
    </aside>
  );
}
