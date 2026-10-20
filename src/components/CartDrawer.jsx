import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCT_MAP } from '../data/products';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQty,
    removeFromCart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    totalItemCount,
    deliveryThreshold,
    formatPrice,
    setIsCheckoutOpen,
    openFittingRoomWithProduct,
    showToast
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (cartSubtotal / deliveryThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, deliveryThreshold - cartSubtotal);

  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'HURANOW10') {
      setDiscountPercent(10);
      showToast('Promo code HURANOW10 applied: 10% OFF!');
    } else {
      showToast('Invalid promo code. Try HURANOW10');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Slide-over backdrop click */}
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        
        <div className="w-screen max-w-md bg-[#0a0a0c] border-l border-zinc-800 flex flex-col justify-between shadow-2xl relative">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-[#111114]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h2 className="text-xl font-black uppercase text-white font-display tracking-tight">
                Your Bag ({totalItemCount})
              </h2>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-zinc-950 px-6 py-3 border-b border-zinc-800 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-zinc-400">
                {remainingForFreeShipping > 0
                  ? `Add ${formatPrice(remainingForFreeShipping)} more for FREE Delivery`
                  : '🎉 You have qualified for FREE Priority Delivery!'}
              </span>
              <span className="font-bold text-white">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-800/80">
            {cart.length > 0 ? (
              cart.map((item, index) => {
                const product = PRODUCT_MAP[item.id];
                if (!product) return null;

                return (
                  <div key={`${item.id}-${item.size}-${index}`} className="py-4 flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-white line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-zinc-500 hover:text-red-400 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          Size: <strong className="text-white">{item.size}</strong> · {product.demographic}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateCartQty(index, -1)}
                            className="text-zinc-400 hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(index, 1)}
                            className="text-zinc-400 hover:text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-xs font-black text-white">
                          {formatPrice(product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center text-zinc-500">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1 mb-3 opacity-40" />
                <p className="text-sm font-medium text-zinc-300">Your bag is empty.</p>
                <p className="text-xs mt-1 text-zinc-500">
                  Build an outfit in the Fitting Studio or explore shoes & apparel.
                </p>
              </div>
            )}
          </div>

          {/* Summary & Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#0f0f12] border-t border-zinc-800 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={applyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Promo code (try HURANOW10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-[#18181b] border border-zinc-700 text-white placeholder-zinc-500 rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-white uppercase font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatPrice(cartSubtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount (10%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-white text-black font-extrabold py-3.5 px-6 rounded-full text-xs sm:text-sm uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
