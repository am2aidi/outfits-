import React from 'react';
import { Globe, ArrowUpRight, Shield, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Footer() {
  const { setActiveCategory, setActiveDemographic, setIsFittingRoomOpen, setIsAdminOpen } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050507] border-t border-zinc-900 text-zinc-400 text-xs">
      
      {/* Newsletter VIP Signup */}
      <div className="border-b border-zinc-900 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-display tracking-tight mb-1">
              BE FIRST IN LINE FOR MIDNIGHT DROPS
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Subscribe to get secret drop codes, new footwear notifications, and VIP fitting studio updates.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to HURANOW VIP Drops!'); }} className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="bg-[#121215] border border-zinc-800 text-white placeholder-zinc-500 rounded-full px-5 py-3 text-xs outline-none focus:border-white transition-colors min-w-[240px]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-white text-black font-extrabold hover:bg-zinc-200 transition-colors uppercase tracking-wider text-[11px] shrink-0"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Main Links Grid (Nike Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Featured Links */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-display font-black text-white text-sm tracking-wider uppercase mb-4">
              HURANOW
            </h4>
            <ul className="space-y-2.5 font-bold text-white text-xs">
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1 text-amber-400 font-extrabold"
                >
                  <span>ADMIN DASHBOARD</span>
                  <ArrowUpRight className="w-3 h-3 text-amber-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsFittingRoomOpen(true)}
                  className="hover:text-zinc-300 transition-colors flex items-center gap-1"
                >
                  <span>LIVE FITTING ROOM</span>
                  <ArrowUpRight className="w-3 h-3 text-amber-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('shoes');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-zinc-300 transition-colors"
                >
                  FOOTWEAR LAB
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveDemographic('baby');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-zinc-300 transition-colors"
                >
                  BABY & TODDLER
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('beauty');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-zinc-300 transition-colors"
                >
                  BEAUTY & FRAGRANCE
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Assistance */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-4 text-[11px]">
              Assistance & Care
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#catalog" className="hover:text-white transition-colors">Order Status</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Shipping & Delivery</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Returns & Refunds</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Size Guide & Fit</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Payment Options</a></li>
            </ul>
          </div>

          {/* Column 3: About HURANOW */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-4 text-[11px]">
              About HURANOW
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#catalog" className="hover:text-white transition-colors">Our Design Philosophy</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Sustainability & Ethics</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Athletes & Creators</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Press & News</a></li>
            </ul>
          </div>

          {/* Column 4: Demographics */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-4 text-[11px]">
              All Demographics
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button onClick={() => setActiveDemographic('men')} className="hover:text-white">
                  Men's Collection
                </button>
              </li>
              <li>
                <button onClick={() => setActiveDemographic('women')} className="hover:text-white">
                  Women's Activewear
                </button>
              </li>
              <li>
                <button onClick={() => setActiveDemographic('kids')} className="hover:text-white">
                  Junior & Kids (5-14Y)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveDemographic('baby')} className="hover:text-white">
                  Baby & Infant (0-4Y)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Social & Back to Top */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-4 text-[11px]">
              Connect
            </h4>
            <div className="flex gap-3 mb-6">
              {['Instagram', 'Twitter / X', 'YouTube', 'TikTok'].map((platform, i) => (
                <span
                  key={i}
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 cursor-pointer text-[10px] font-bold"
                  title={platform}
                >
                  {platform[0]}
                </span>
              ))}
            </div>

            <button
              onClick={scrollToTop}
              className="text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Back to Top</span>
              <span>↑</span>
            </button>
          </div>

        </div>

        {/* Bottom Legal Bar (Nike Style) */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div className="flex items-center gap-3">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-white font-medium">Rwanda & International</span>
            <span>•</span>
            <span>© 2026 HURANOW, Inc. All Rights Reserved</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#catalog" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#catalog" className="hover:text-white transition-colors">Terms of Sale</a>
            <a href="#catalog" className="hover:text-white transition-colors">Nike Style Guidelines</a>
            <a href="#catalog" className="hover:text-white transition-colors">Cookie Preferences</a>
          </div>
        </div>

      </div>

    </footer>
  );
}
