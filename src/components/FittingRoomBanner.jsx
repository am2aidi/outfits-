import React from 'react';
import { Sparkles, ArrowRight, UserCheck, CheckCircle2, Layers } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { MANNEQUINS, PRODUCT_MAP } from '../data/products';

export default function FittingRoomBanner() {
  const { setIsFittingRoomOpen, fitState, setFitDemographic, formatPrice } = useShop();

  const currentMannequin = MANNEQUINS[fitState.demographic] || MANNEQUINS.men;
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
                Experience seamless outfit building. Select between <strong className="text-white">Men’s</strong>, <strong className="text-white">Women’s</strong>, <strong className="text-white">Kids’</strong>, or <strong className="text-white">Baby</strong> models, 
                dress them with jackets, pants, sneakers, eyewear, and bags, and buy the full matched look in one click.
              </p>

              {/* 3 Step Process */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-black/60 border border-zinc-800/80 p-3.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-white text-black text-xs font-black flex items-center justify-center mb-2">1</div>
                  <h4 className="text-xs font-bold text-white uppercase">Choose Model</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Switch gender & age in real-time.</p>
                </div>

                <div className="bg-black/60 border border-zinc-800/80 p-3.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-white text-black text-xs font-black flex items-center justify-center mb-2">2</div>
                  <h4 className="text-xs font-bold text-white uppercase">Layer The Fit</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Equip shoes, tops, and gear.</p>
                </div>

                <div className="bg-black/60 border border-zinc-800/80 p-3.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-white text-black text-xs font-black flex items-center justify-center mb-2">3</div>
                  <h4 className="text-xs font-bold text-white uppercase">1-Click Purchase</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Add all pieces with your sizing.</p>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsFittingRoomOpen(true)}
                  className="bg-white text-black font-extrabold px-6 py-3.5 rounded-full text-xs sm:text-sm hover:bg-zinc-200 active:scale-95 transition-all flex items-center gap-2 shadow-xl group"
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
                onClick={() => setIsFittingRoomOpen(true)}
                className="w-full max-w-[340px] bg-black border border-zinc-800 hover:border-zinc-500 rounded-2xl p-4 shadow-2xl cursor-pointer group transition-all"
              >
                {/* Header inside card */}
                <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 mb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white uppercase">{currentMannequin.name}</span>
                  </div>
                  <span className="text-[10px] bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded text-zinc-300">
                    {equippedIds.length} Equipped
                  </span>
                </div>

                {/* Model preview image with badges */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-950 mb-3">
                  <img
                    src={currentMannequin.baseImage}
                    alt="Mannequin preview"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                  <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md border border-zinc-700 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                      <span>Equipped Outfit Preview</span>
                      <span className="text-amber-400 text-[11px]">Click to customize</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-zinc-500" />
                      <span>Tops, pants, shoes, and gear configured</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs font-bold text-white group-hover:underline flex items-center justify-center gap-1 py-1">
                  <span>Enter Fitting Room to change clothes & models</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
