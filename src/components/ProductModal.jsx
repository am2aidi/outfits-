import React, { useState } from 'react';
import { X, Sparkles, Heart, ShoppingBag, Check, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SIZE_SYSTEM } from '../data/products';

export default function ProductModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    openFittingRoomWithProduct,
    formatPrice
  } = useShop();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorited = wishlist.includes(product.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const images = [product.image, product.hoverImage].filter(Boolean);

  const sizeList =
    product.category === 'clothes'
      ? SIZE_SYSTEM[product.demographic]?.clothes
      : product.category === 'shoes'
      ? SIZE_SYSTEM[product.demographic]?.shoes
      : null;

  const [selectedSize, setSelectedSize] = useState(
    sizeList ? sizeList[Math.floor(sizeList.length / 2)] : 'One Size'
  );

  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    setIsAdded(true);
    addToCart(product.id, selectedSize);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl bg-[#0c0c0e] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center hover:scale-105 transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Gallery */}
          <div className="p-6 bg-zinc-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
            {/* Main Image */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black mb-4">
              <img
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {product.tag && (
                <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                  {product.tag}
                </div>
              )}
            </div>

            {/* Thumbnail switcher if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-white' : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-2">
                <span className="flex items-center gap-2">
                  <span>{product.demographic} · {product.category}</span>
                  {product.origin && (
                    <span className="text-[10px] bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded text-zinc-300 font-bold lowercase">
                      📍 {product.origin}
                    </span>
                  )}
                </span>
                <span className="text-amber-400 flex items-center gap-1 font-bold">
                  ★ {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-display leading-tight mb-3">
                {product.name}
              </h2>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-black text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-zinc-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-bold">
                    SAVE {formatPrice(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Technical Details */}
              {product.details && (
                <div className="mb-6 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Key Performance Features
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sizes Selection */}
              {sizeList && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span className="font-bold text-white uppercase">Select Size</span>
                    <span className="text-zinc-500">True to athletic fit</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizeList.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-all ${
                          selectedSize === sz
                            ? 'bg-white text-black border-white shadow-lg'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="flex items-center gap-3">
                {/* Add to Bag */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 px-6 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${
                    isAdded ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-3.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-white text-white transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {/* Try on Mannequin CTA */}
              {product.slot !== 'beauty' && (
                <button
                  onClick={() => {
                    setQuickViewProduct(null);
                    openFittingRoomWithProduct(product.id);
                  }}
                  className="w-full py-3 px-4 rounded-full bg-zinc-900 border border-zinc-700 hover:border-white text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Try On Live Mannequin with Full Outfit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
