import React, { useState } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCT_MAP } from '../data/products';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    formatPrice,
    user,
    placeOrder
  } = useShop();

  const [paymentMethod, setPaymentMethod] = useState('momo'); // 'momo' | 'airtel' | 'visa' | 'mc'
  const [phone, setPhone] = useState('078 123 4567');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(user || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [address, setAddress] = useState('KG 11 Ave, Kigali');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);

  if (!isCheckoutOpen) return null;

  const isCard = paymentMethod === 'visa' || paymentMethod === 'mc';

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length > 2) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardExpiry(raw);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isCard) {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 13) {
        setError('Please enter a valid credit card number.');
        return;
      }
      if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
        setError('Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (cardCvc.length < 3) {
        setError('Please enter the 3 or 4 digit security CVC.');
        return;
      }
    } else {
      if (!phone.trim()) {
        setError('Please enter your mobile money registered phone number.');
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const receipt = placeOrder(
        paymentMethod === 'momo'
          ? 'MTN MoMo'
          : paymentMethod === 'airtel'
          ? 'Airtel Money'
          : paymentMethod.toUpperCase(),
        { phone, address }
      );
      setOrderReceipt(receipt);
    }, 2200);
  };

  const handleFinish = () => {
    setOrderReceipt(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-[#0e0e11] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto">
        
        {/* Close Button */}
        {!orderReceipt && (
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* PROCESSING SCREEN */}
        {isProcessing && (
          <div className="py-16 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-white animate-spin mx-auto" />
            <h3 className="text-xl font-black uppercase text-white font-display">
              {isCard ? 'Contacting Your Card Issuer...' : 'Sending Mobile Money Prompt...'}
            </h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              {isCard
                ? 'Securing connection with bank 3D-Secure authentication.'
                : `Please approve the prompt sent to your phone (${phone}) for ${formatPrice(cartTotal)}.`}
            </p>
          </div>
        )}

        {/* ORDER SUCCESS RECEIPT SCREEN */}
        {orderReceipt && !isProcessing && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl">
                <CheckCircle className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-black uppercase text-white font-display">
                Order Placed Successfully
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Thank you for shopping with HURANOW. Your order is being dispatched from our laboratory.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-[#141418] border border-zinc-800 rounded-2xl p-5 text-xs space-y-3 font-mono">
              <div className="flex justify-between pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">Order Reference</span>
                <span className="text-white font-bold">{orderReceipt.id}</span>
              </div>

              <div className="flex justify-between pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">Payment Channel</span>
                <span className="text-white font-bold">{orderReceipt.paymentMethod}</span>
              </div>

              <div className="space-y-1 py-1">
                {orderReceipt.items.map((item, idx) => {
                  const p = PRODUCT_MAP[item.id];
                  return (
                    <div key={idx} className="flex justify-between text-zinc-300">
                      <span className="truncate max-w-[200px]">
                        {item.quantity}× {p?.name} ({item.size})
                      </span>
                      <span>{p ? formatPrice(p.price * item.quantity) : ''}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-zinc-800 flex justify-between text-zinc-400">
                <span>Delivery</span>
                <span>{orderReceipt.deliveryFee === 0 ? 'FREE' : formatPrice(orderReceipt.deliveryFee)}</span>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
                <span>Total Paid</span>
                <span>{formatPrice(orderReceipt.total)}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-white text-black font-extrabold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all shadow-xl"
            >
              Continue Exploring
            </button>
          </div>
        )}

        {/* CHECKOUT FORM SCREEN */}
        {!orderReceipt && !isProcessing && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Instant Checkout
              </span>
              <h3 className="text-2xl font-black uppercase text-white font-display">
                Pay {formatPrice(cartTotal)}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Demo checkout simulation. Safe sandbox environment.
              </p>
            </div>

            {/* Payment Method Selector (MTN MoMo, Airtel, Visa, Mastercard) */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {[
                { id: 'momo', label: 'MTN MoMo', sub: 'Mobile Money', icon: Smartphone },
                { id: 'airtel', label: 'Airtel Money', sub: 'Mobile Money', icon: Smartphone },
                { id: 'visa', label: 'Visa Card', sub: 'Debit / Credit', icon: CreditCard },
                { id: 'mc', label: 'Mastercard', sub: 'Debit / Credit', icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(m.id);
                      setError('');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-zinc-800 border-white ring-1 ring-white/30 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{m.label}</span>
                      <Icon className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <span className="text-[10px] text-zinc-500">{m.sub}</span>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Delivery Address */}
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Delivery Destination
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street Address, City / Region"
                  className="w-full bg-[#151518] border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-white transition-colors"
                />
              </div>

              {/* Card Inputs */}
              {isCard ? (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full bg-[#151518] border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-white transition-colors font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-[#151518] border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-white transition-colors font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        CVC Security
                      </label>
                      <input
                        type="password"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.slice(0, 4))}
                        placeholder="CVC"
                        maxLength={4}
                        className="w-full bg-[#151518] border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-white transition-colors font-mono"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Mobile Money Input */
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 078 123 4567"
                    className="w-full bg-[#151518] border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-white transition-colors font-mono"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    You will receive a USSD push notification on this number to approve payment.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-white text-black font-extrabold py-3.5 px-6 rounded-full text-xs sm:text-sm uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl mt-4"
              >
                <span>Authorize & Pay {formatPrice(cartTotal)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit SSL encrypted & tokenized checkout</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
