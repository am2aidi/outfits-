import React, { useState } from 'react';
import { Heart, Sparkles, ShoppingBag, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SIZE_SYSTEM } from '../data/products';

export default function ProductCard({ product }) {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    formatPrice,
    openFittingRoomWithProduct,
    setQuickViewProduct,
    fitState,
    equipFitItem,
    showToast
  } = useShop();

  const isFavorited = wishlist.includes(product.id);
  const isWorn = Boolean(product.slot && fitState?.worn?.[product.slot] === product.id);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  // Available sizes for this category & demographic
  const sizeList =
    product.category === 'clothes'
      ? SIZE_SYSTEM[product.demographic]?.clothes
      : product.category === 'shoes'
      ? SIZE_SYSTEM[product.demographic]?.shoes
      : null;

  const [selectedSize, setSelectedSize] = useState(
    sizeList ? sizeList[Math.floor(sizeList.length / 2)] : 'One Size'
  );

  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product.id, selectedSize);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  return (
    <article
      onClick={() => setQuickViewProduct(product)}
      className="group relative flex flex-col bg-[#0f0f11] rounded-2xl border border-zinc-800/80 hover:border-zinc-500 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/5] w-full bg-zinc-950 overflow-hidden">
        {/* Main Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Secondary Hover Image (Nike-style smooth crossfade) */}
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}

        {/* Tag Badge */}
        {product.tag && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md ${
                product.tagType === 'hot'
                  ? 'bg-amber-500 text-black'
                  : product.tagType === 'new'
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 text-white border border-zinc-700'
              }`}
            >
              {product.tag}
            </span>
          </div>
        )}

        {/* Live Mannequin Hanger & Wishlist Heart Controls */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {product.slot && product.slot !== 'beauty' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                equipFitItem(product.slot, product.id);
                showToast(isWorn ? `Removed ${product.name} from mannequin` : `Dressed ${product.name} on mannequin`);
              }}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                isWorn
                  ? 'bg-amber-500 text-black border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-lg'
                  : 'bg-black/70 backdrop-blur-md border-zinc-700 text-zinc-300 hover:text-white hover:border-amber-400 hover:scale-110 active:scale-95'
              }`}
              title={isWorn ? 'Worn on mannequin (tap to remove)' : 'Tap hanger to wear on mannequin'}
              aria-label={isWorn ? 'Remove from mannequin' : 'Try on mannequin'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4a2.5 2.5 0 0 1 2.5 2.5c0 1-.6 1.8-1.5 2.2L21 15a2 2 0 0 1-1 3.5H4A2 2 0 0 1 3 15l8-6.3c-.9-.4-1.5-1.2-1.5-2.2A2.5 2.5 0 0 1 12 4z"/>
              </svg>
            </button>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-zinc-700 flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all"
            aria-label="Save to Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-zinc-300'
              }`}
            />
          </button>
        </div>

        {/* Quick "Try on Mannequin" Floating Overlay Button */}
        {product.slot !== 'beauty' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openFittingRoomWithProduct(product.id);
            }}
            className={`absolute bottom-3 right-3 z-10 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-xl transition-all transform ${
              isWorn
                ? 'bg-amber-500 text-black border border-amber-400 opacity-100 translate-y-0'
                : 'bg-black/85 backdrop-blur-md border border-zinc-700 hover:border-white text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isWorn ? 'text-black' : 'text-amber-400'}`} />
            <span>{isWorn ? 'Dressed • View Studio' : 'Try on Mannequin'}</span>
          </button>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Demographic & Origin Subtitle */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5">
              <span>{product.demographic} · {product.category}</span>
              {product.origin && (
                <span className="text-[9px] bg-zinc-900 border border-zinc-700 px-1.5 py-0.2 rounded text-zinc-300 font-bold lowercase">
                  📍 {product.origin}
                </span>
              )}
            </span>
            {product.rating && (
              <span className="text-zinc-300 flex items-center gap-1 shrink-0">
                ★ {product.rating}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-bold text-white group-hover:text-zinc-300 transition-colors line-clamp-1 mb-2">
            {product.name}
          </h3>

          {/* Color Variants Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
              {product.colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColorIndex(i)}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                    selectedColorIndex === i
                      ? 'scale-125 border-white'
                      : 'border-zinc-700 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color option ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-extrabold text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-zinc-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-2 pt-2 border-t border-zinc-800/80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Size Selector */}
            {sizeList && (
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-white cursor-pointer w-20 shrink-0"
                aria-label={`Size for ${product.name}`}
              >
                {sizeList.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
            )}

            {/* Add to Bag Button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                isAdding
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
