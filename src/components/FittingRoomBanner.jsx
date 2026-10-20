import React, { useState } from 'react';
import { Sparkles, ArrowRight, UserCheck, Layers, Eye } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BLACK_MODELS, PRODUCT_MAP } from '../data/products';
import MannequinVisualizer from './MannequinVisualizer';

export default function FittingRoomBanner() {
  const { setIsFittingRoomOpen, fitState, setFitDemographic, formatPrice, equipFitItem } = useShop();

  const [previewTab, setPreviewTab] = useState('mannequin'); // 'mannequin' | 'model'

  const currentModel = BLACK_MODELS[fitState.demographic] || BLACK_MODELS.men;
  const equippedIds = Object.values(fitState.worn).filter(Boolean);

  return (
    <section className="bg-gradient-to-b from-black to-[#09090b] py-14 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="relative rounded-3xl bg-gradient-to-r from-zinc-950 via-[#111114] to-zinc-950 border border-zinc-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
          
          {/* Subtle Ambient Lights */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-xs font-bold text-amber-400 w-fit mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SIGNATURE INNOVATION</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-display tracking-tight leading-none mb-4">
                THE HURANOW LIVE FITTING STUDIO
              </h2>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                Experience seamless outfit building. See how clothes look on <strong className="text-white">Black fashion models</strong> or dress our <strong className="text-white">boutique display mannequin</strong> in jackets, cargo pants, runners, and eyewear, then purchase the matched look in one click.
              </p>

              {/* 3 Step Process */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-black/60 border border-zinc-800/80 p-3.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-white text-black text-xs font-black flex items-center justify-center mb-2">1</div>
                  <h4 className="text-xs font-bold text-white uppercase">Choose Demographic</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Men, Women, Kids & Baby.</p>
                </div>

                <div className="bg-black/60 border border-zinc-800/80 p-3.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-white text-black text-xs font-black flex items-center justify-center mb-2">2</div>
                  <h4 className="text-xs font-bold text-white uppercase">Dress Mannequin</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Clothes layer on the body.</p>
                </div>

                <div className="bg-black/60 border border-zinc-800/80 p-3.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-white text-black text-xs font-black flex items-center justify-center mb-2">3</div>
                  <h4 className="text-xs font-bold text-white uppercase">1-Click Purchase</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Add all pieces with your size.</p>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsFittingRoomOpen(true)}
                  className="bg-white text-black font-extrabold px-7 py-3.5 rounded-full text-xs sm:text-sm hover:bg-zinc-200 active:scale-95 transition-all flex items-center gap-2 shadow-xl group"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>LAUNCH FITTING STUDIO</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Interactive Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                className="w-full max-w-[360px] bg-black border border-zinc-800 rounded-3xl p-4 shadow-2xl flex flex-col justify-between"
              >
                {/* Switcher header between Mannequin & Black Model */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-[11px]">
                    <button
                      onClick={() => setPreviewTab('mannequin')}
                      className={`px-2.5 py-1 rounded font-bold transition-all ${
                        previewTab === 'mannequin' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      Shop Mannequin
                    </button>
                    <button
                      onClick={() => setPreviewTab('model')}
                      className={`px-2.5 py-1 rounded font-bold transition-all ${
                        previewTab === 'model' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      Black Model
                    </button>
                  </div>

                  <span className="text-[10px] bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded text-amber-400 font-bold uppercase">
                    {equippedIds.length} Fitted
                  </span>
                </div>

                {/* Display Area */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-950 mb-3 border border-zinc-800/80 flex items-center justify-center">
                  {previewTab === 'mannequin' ? (
                    <MannequinVisualizer
                      variant="showcase"
                      demographic={fitState.demographic}
                      worn={fitState.worn}
                      onSlotSelect={() => setIsFittingRoomOpen(true)}
                      formatPrice={formatPrice}
                      userHeight={178}
                      userBuild="athletic"
                      selectedSize={fitState.sizes.clothes}
                      onQuickOutfitSelect={(topId) => equipFitItem('top', topId)}
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={currentModel.image}
                        alt={currentModel.name}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md border border-zinc-700 p-2 rounded-xl text-[10px] text-zinc-300">
                        <strong className="text-white block">{currentModel.name}</strong>
                        {currentModel.bio}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsFittingRoomOpen(true)}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Full Fitting Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
