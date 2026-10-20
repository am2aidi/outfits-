import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Sparkles, 
  Menu, 
  X, 
  ChevronDown, 
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DEMOGRAPHICS, CATEGORIES } from '../data/products';
import HuranowLogo from './HuranowLogo';

export default function Header() {
  const {
    user,
    logout,
    totalItemCount,
    wishlist,
    openCart,
    setIsCartOpen,
    setIsAuthOpen,
    setAuthMode,
    setIsFittingRoomOpen,
    currency,
    setCurrency,
    activeDemographic,
    setActiveDemographic,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    showToast
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const popularSearches = ['Stealth Windrunner', 'Carbon Runner', 'Organic Romper', 'Noir Parfum', 'Cargo Trousers'];

  return (
    <>
      {/* Top Utility Bar (Nike Style) */}
      <div className="bg-[#050505] border-b border-[#1c1c1f] text-[11px] text-[#8e8e93] py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-white tracking-widest text-[10px]">HURANOW PERFORMANCE LAB</span>
            <span className="hidden md:inline text-[#3a3a3c]">|</span>
            <span className="hidden md:inline text-[#a1a1a6]">Fit, wear, buy. Try outfits on our live mannequin.</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency Switcher */}
            <div className="flex items-center gap-1.5 bg-[#121214] border border-[#27272a] rounded px-2 py-0.5 text-white">
              <Globe className="w-3 h-3 text-[#a1a1a6]" />
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  showToast(`Currency changed to ${e.target.value}`);
                }}
                className="bg-transparent text-[11px] font-medium outline-none cursor-pointer"
              >
                <option value="RWF" className="bg-[#121214]">RWF (Rwanda)</option>
                <option value="USD" className="bg-[#121214]">USD ($)</option>
                <option value="EUR" className="bg-[#121214]">EUR (€)</option>
              </select>
            </div>

            <span className="text-[#3a3a3c]">|</span>

            {/* User status */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 text-white hover:text-gray-300 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Hi, {user}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-[#141416] border border-[#27272a] rounded-lg shadow-2xl py-2 z-50 text-xs">
                    <div className="px-3 py-1.5 border-b border-[#27272a] text-[#a1a1a6]">
                      Signed in as <b className="text-white block truncate">{user}</b>
                    </div>
                    <button
                      onClick={() => {
                        setIsFittingRoomOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#222226] text-white flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> My Fitting Studio
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#222226] text-red-400"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                  className="hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <span className="text-[#3a3a3c]">/</span>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthOpen(true);
                  }}
                  className="text-white hover:underline font-semibold"
                >
                  Join Us
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Luxury Navbar (Nike Style) */}
      <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md border-b border-[#1c1c1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveDemographic('all');
                setActiveCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group text-left"
            >
              <HuranowLogo className="w-8 h-8 group-hover:scale-105 transition-transform" showText={true} />
            </button>
          </div>

          {/* Desktop Nav Links (Demographic & Core Categories) */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold tracking-wide">
            {DEMOGRAPHICS.map((demo) => (
              <button
                key={demo.id}
                onClick={() => {
                  setActiveDemographic(demo.id);
                  const el = document.getElementById('catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`py-1 transition-colors relative ${
                  activeDemographic === demo.id ? 'text-white' : 'text-[#8e8e93] hover:text-white'
                }`}
              >
                {demo.label}
                {activeDemographic === demo.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"></span>
                )}
              </button>
            ))}

            <span className="h-4 w-[1px] bg-[#27272a]"></span>

            {/* Virtual Fitting Room Highlight Button */}
            <button
              onClick={() => setIsFittingRoomOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700 text-white text-xs font-bold hover:border-white transition-all shadow-md group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Fitting Room</span>
              <span className="bg-white text-black text-[9px] px-1.5 py-0.2 rounded font-black tracking-tight uppercase">
                Fit & Buy
              </span>
            </button>
          </nav>

          {/* Right Action Icons: Search, Wishlist, Cart, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <div className="relative">
              <div className="hidden md:flex items-center bg-[#161618] border border-[#27272a] rounded-full px-3 py-1.5 w-48 lg:w-56 focus-within:w-64 focus-within:border-white transition-all">
                <Search className="w-3.5 h-3.5 text-[#8e8e93] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search outfits, shoes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-[#71717a] outline-none w-full"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-[#71717a] hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Mobile Search Icon */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 text-white hover:bg-[#18181b] rounded-full"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                showToast(`Saved Favorites: ${wishlist.length} item(s)`);
              }}
              className="relative p-2 text-white hover:bg-[#18181b] rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart / Bag Button (Auth Gated) */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-white text-black px-3.5 py-1.5 rounded-full font-bold text-xs hover:bg-zinc-200 transition-transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-black text-white text-[11px] px-1.5 py-0.5 rounded-full font-extrabold min-w-[20px] text-center">
                {totalItemCount}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-[#18181b] rounded-full"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-3 border-t border-[#27272a] pt-2 bg-[#0c0c0e]">
            <div className="flex items-center bg-[#18181b] rounded-full px-3 py-2 border border-[#3f3f46]">
              <Search className="w-4 h-4 text-[#8e8e93] mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search shoes, hoodies, baby rompers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-[#71717a] outline-none w-full"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-[#71717a] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto mt-2 py-1 text-[11px] text-[#a1a1a6]">
              <span className="font-semibold text-white">Popular:</span>
              {popularSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(term)}
                  className="whitespace-nowrap px-2 py-0.5 bg-[#1c1c1f] rounded-full hover:bg-white hover:text-black transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#09090b] border-t border-[#1f1f23] px-6 py-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
            {/* Quick Try on Mannequin Banner */}
            <button
              onClick={() => {
                setIsFittingRoomOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 text-white font-bold text-sm"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Open Virtual Fitting Room</span>
              </div>
              <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded font-black">TRY ON</span>
            </button>

            <div className="text-xs uppercase tracking-wider text-[#71717a] font-bold">Shop by Demographic</div>
            <div className="grid grid-cols-2 gap-2">
              {DEMOGRAPHICS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => {
                    setActiveDemographic(demo.id);
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById('catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeDemographic === demo.id
                      ? 'bg-white text-black'
                      : 'bg-[#141416] text-[#e4e4e7] hover:bg-[#202024]'
                  }`}
                >
                  {demo.label}
                </button>
              ))}
            </div>

            <div className="text-xs uppercase tracking-wider text-[#71717a] font-bold mt-2">Shop Categories</div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById('catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-white text-black'
                      : 'bg-[#141416] text-[#e4e4e7] hover:bg-[#202024]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Nike-Style Scrolling Free Shipping / Promotion Ribbon */}
      <div className="bg-[#121214] border-b border-[#222226] py-2 px-4 text-center overflow-hidden">
        <div className="flex items-center justify-center gap-3 text-xs tracking-tight">
          <span className="font-bold text-white uppercase">Exclusive Drop</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-300">
            Free shipping on orders above <span className="text-white font-semibold">RWF 100,000</span> ($80)
          </span>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="text-zinc-400 hidden sm:inline">Use code <strong className="text-white bg-zinc-800 px-1.5 py-0.5 rounded text-[11px]">HURANOW10</strong> for 10% off</span>
        </div>
      </div>
    </>
  );
}
