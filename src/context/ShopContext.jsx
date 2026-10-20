import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, PRODUCT_MAP, CURRENCY_RATES, SIZE_SYSTEM } from '../data/products';
import confetti from 'canvas-confetti';

const ShopContext = createContext(null);

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}

// SHA-256 hashing matching user's original security implementation
async function hashPassword(str) {
  try {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return btoa(str);
  }
}

export function ShopProvider({ children }) {
  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hn_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart State (tied to user or guest)
  const [cart, setCart] = useState(() => {
    try {
      const savedUser = localStorage.getItem('hn_user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      const key = parsedUser ? `hn_cart_${parsedUser}` : 'hn_cart_guest';
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('hn_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    try {
      const savedUser = localStorage.getItem('hn_user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      if (!parsedUser) return [];
      const saved = localStorage.getItem(`hn_orders_${parsedUser}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Currency & Navigation
  const [currency, setCurrency] = useState('RWF');
  const [activeDemographic, setActiveDemographic] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [pendingCartAction, setPendingCartAction] = useState(null);
  const [isFittingRoomOpen, setIsFittingRoomOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Mannequin Fitting Room State
  const [fitState, setFitState] = useState({
    demographic: 'men',
    slot: 'top',
    worn: {
      top: 'hn-top-01',
      bottom: 'hn-bot-01',
      shoe: 'hn-sh-01',
      head: 'hn-acc-02',
      face: 'hn-acc-03',
      bag: 'hn-acc-01'
    },
    sizes: {
      clothes: 'L',
      shoes: '42'
    }
  });

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      const key = user ? `hn_cart_${user}` : 'hn_cart_guest';
      localStorage.setItem(key, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart, user]);

  // Save Wishlist
  useEffect(() => {
    try {
      localStorage.setItem('hn_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Toast Trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2800);
  };

  // Price Formatter
  const formatPrice = (rwfAmount) => {
    const config = CURRENCY_RATES[currency] || CURRENCY_RATES.RWF;
    return config.format(rwfAmount);
  };

  // Raw internal add to cart without gate
  const executeAddToCart = (productId, size = null, quiet = false, targetCart = null) => {
    const product = PRODUCT_MAP[productId];
    if (!product) return;

    let finalSize = size;
    if (!finalSize) {
      if (product.category === 'clothes') {
        const sizes = SIZE_SYSTEM[product.demographic]?.clothes || ['M'];
        finalSize = sizes[Math.floor(sizes.length / 2)];
      } else if (product.category === 'shoes') {
        const sizes = SIZE_SYSTEM[product.demographic]?.shoes || ['42'];
        finalSize = sizes[Math.floor(sizes.length / 2)];
      } else {
        finalSize = 'One Size';
      }
    }

    setCart(prev => {
      const current = targetCart || prev;
      const existing = current.find(item => item.id === productId && item.size === finalSize);
      let updated;
      if (existing) {
        updated = current.map(item =>
          item.id === productId && item.size === finalSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...current, { id: productId, size: finalSize, quantity: 1, addedAt: Date.now() }];
      }
      return updated;
    });

    if (!quiet) {
      showToast(`Added ${product.name} to bag`);
    }
  };

  // Raw internal add entire fit to cart
  const executeAddEntireFitToCart = () => {
    const equippedIds = Object.values(fitState.worn).filter(Boolean);
    if (!equippedIds.length) {
      showToast('Select at least one piece to add to bag');
      return;
    }

    equippedIds.forEach(id => {
      const prod = PRODUCT_MAP[id];
      if (prod) {
        let size = 'One Size';
        if (prod.category === 'clothes') size = fitState.sizes.clothes;
        if (prod.category === 'shoes') size = fitState.sizes.shoes;
        executeAddToCart(id, size, true);
      }
    });

    setIsFittingRoomOpen(false);
    setIsCartOpen(true);
    showToast(`${equippedIds.length} pieces added to your cart`);
  };

  // Public addToCart: AUTH GATED just like user requested!
  const addToCart = (productId, size = null, quiet = false) => {
    if (!user) {
      setPendingCartAction({ type: 'add_to_cart', productId, size, quiet });
      setAuthPromptMessage('Log in to add items to your cart.');
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }
    executeAddToCart(productId, size, quiet);
  };

  // Public addEntireFitToCart: AUTH GATED
  const addEntireFitToCart = () => {
    if (!user) {
      setPendingCartAction({ type: 'add_outfit' });
      setAuthPromptMessage('Log in to add this outfit to your cart.');
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }
    executeAddEntireFitToCart();
  };

  // Public openCart: AUTH GATED
  const openCart = () => {
    if (!user) {
      setPendingCartAction({ type: 'open_cart' });
      setAuthPromptMessage('Log in to view and manage your cart.');
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }
    setIsCartOpen(true);
  };

  // Handle post-auth resolution of pending actions
  const resolvePendingAction = (userName, loadedCart) => {
    if (pendingCartAction) {
      if (pendingCartAction.type === 'add_to_cart') {
        executeAddToCart(
          pendingCartAction.productId,
          pendingCartAction.size,
          pendingCartAction.quiet,
          loadedCart
        );
        setIsCartOpen(true);
      } else if (pendingCartAction.type === 'add_outfit') {
        executeAddEntireFitToCart();
      } else if (pendingCartAction.type === 'open_cart') {
        setIsCartOpen(true);
      }
      setPendingCartAction(null);
    }
  };

  // Login handler
  const login = async (identifier, password) => {
    const users = JSON.parse(localStorage.getItem('hn_users') || '{}');
    const id = identifier.trim().toLowerCase();
    const account = users[id] || Object.values(users).find(u => u.e === id);
    const hashed = await hashPassword(password);

    if (!account || account.h !== hashed) {
      throw new Error('Incorrect credentials. Please verify username/email and password.');
    }

    const userName = account.n;
    setUser(userName);
    localStorage.setItem('hn_user', JSON.stringify(userName));

    // Load user's cart
    const userCart = JSON.parse(localStorage.getItem(`hn_cart_${userName}`) || '[]');
    setCart(userCart);

    setIsAuthOpen(false);
    showToast(`Welcome back, ${userName}!`);
    resolvePendingAction(userName, userCart);
  };

  // Signup handler
  const signup = async (username, email, password) => {
    const users = JSON.parse(localStorage.getItem('hn_users') || '{}');
    const u = username.trim();
    const em = email.trim().toLowerCase();

    if (users[u.toLowerCase()] || Object.values(users).some(x => x.e === em)) {
      throw new Error('That username or email is already registered. Please log in.');
    }

    const hashed = await hashPassword(password);
    users[u.toLowerCase()] = { n: u, e: em, h: hashed };
    localStorage.setItem('hn_users', JSON.stringify(users));

    setUser(u);
    localStorage.setItem('hn_user', JSON.stringify(u));
    setIsAuthOpen(false);
    showToast(`Account created! Welcome to HURANOW, ${u}.`);
    resolvePendingAction(u, []);
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('hn_user');
    setCart([]);
    showToast('Logged out');
  };

  // Update Cart Quantity
  const updateCartQty = (index, delta) => {
    setCart(prev => {
      const copy = [...prev];
      const item = copy[index];
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index] = { ...item, quantity: newQty };
      }
      return copy;
    });
  };

  // Remove from Cart
  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart');
  };

  // Toggle Wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from favorites');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to favorites');
        return [...prev, productId];
      }
    });
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const prod = PRODUCT_MAP[item.id];
    return sum + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const deliveryThreshold = 100000;
  const deliveryFee = cartSubtotal > 0 && cartSubtotal < deliveryThreshold ? 3000 : 0;
  const cartTotal = cartSubtotal + deliveryFee;
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Fitting Room Actions
  const setFitDemographic = (demo) => {
    const sizes = SIZE_SYSTEM[demo] || SIZE_SYSTEM.men;
    setFitState(prev => ({
      ...prev,
      demographic: demo,
      worn: {},
      sizes: {
        clothes: sizes.clothes[Math.floor(sizes.clothes.length / 2)],
        shoes: sizes.shoes[Math.floor(sizes.shoes.length / 2)],
      }
    }));
  };

  const equipFitItem = (slot, productId) => {
    setFitState(prev => ({
      ...prev,
      worn: {
        ...prev.worn,
        [slot]: prev.worn[slot] === productId ? null : productId
      }
    }));
  };

  const clearFit = () => {
    setFitState(prev => ({ ...prev, worn: {} }));
    showToast('Mannequin outfit cleared');
  };

  const openFittingRoomWithProduct = (productId) => {
    const product = PRODUCT_MAP[productId];
    if (!product) return;

    const demo = product.demographic === 'all' ? 'men' : product.demographic;
    setFitDemographic(demo);
    setFitState(prev => ({
      ...prev,
      demographic: demo,
      slot: product.slot || 'top',
      worn: {
        ...prev.worn,
        [product.slot || 'top']: product.id
      }
    }));
    setIsFittingRoomOpen(true);
  };

  // Place Order Simulation
  const placeOrder = (paymentMethod, paymentDetails) => {
    const ref = 'HN-' + Date.now().toString().slice(-8);
    const orderRecord = {
      id: ref,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartTotal,
      currency,
      paymentMethod,
      customer: user || 'Customer',
      status: 'Confirmed'
    };

    const existingOrders = JSON.parse(localStorage.getItem(`hn_orders_${user || 'guest'}`) || '[]');
    existingOrders.unshift(orderRecord);
    localStorage.setItem(`hn_orders_${user || 'guest'}`, JSON.stringify(existingOrders));
    setOrders(existingOrders);

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    setCart([]);
    return orderRecord;
  };

  return (
    <ShopContext.Provider
      value={{
        user,
        login,
        signup,
        logout,

        // Cart & Wishlist
        cart,
        addToCart,
        openCart,
        removeFromCart,
        updateCartQty,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        totalItemCount,
        deliveryThreshold,
        wishlist,
        toggleWishlist,

        // Currency
        currency,
        setCurrency,
        formatPrice,

        // Filters & Search
        activeDemographic,
        setActiveDemographic,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,

        // Modals
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        authPromptMessage,
        setAuthPromptMessage,
        isFittingRoomOpen,
        setIsFittingRoomOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        quickViewProduct,
        setQuickViewProduct,

        // Toast
        toastMessage,
        isToastVisible,
        showToast,

        // Fitting Room Mannequin
        fitState,
        setFitState,
        setFitDemographic,
        equipFitItem,
        clearFit,
        openFittingRoomWithProduct,
        addEntireFitToCart,

        // Order
        orders,
        placeOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
