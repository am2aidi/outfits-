import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Sparkles, 
  Trash2, 
  Check, 
  Layers, 
  ShoppingBag, 
  Upload, 
  RotateCcw, 
  Eye, 
  Search, 
  Tag, 
  DollarSign, 
  ShieldCheck, 
  Shirt, 
  Ruler,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DEMOGRAPHICS, CATEGORIES, FITTING_SLOTS } from '../data/products';

export default function AdminModal() {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    addProduct,
    deleteProduct,
    resetProductsToDefault,
    fitState,
    equipFitItem,
    clearFit,
    formatPrice,
    setIsFittingRoomOpen,
    showToast,
    orders
  } = useShop();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'add' | 'mannequin' | 'orders'
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form State for Adding New Clothes
  const [formData, setFormData] = useState({
    name: '',
    origin: 'Made in Rwanda',
    demographic: 'men',
    category: 'clothes',
    slot: 'top',
    price: 65000,
    originalPrice: 80000,
    tag: 'NEW DROP',
    tagType: 'new',
    garmentStyle: 'jacket',
    mannequinImage: '/mannequin-windrunner.jpg',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    description: 'Engineered high-performance luxury outerwear crafted with East African heritage silhouette, weather-shield taped seams, and breathable athletic cut.',
    details: '100% Sustainable East African Cotton & Poly\nWater-repellent matte storm finish\nTaped waterproof bonded zippers\nErgonomic anatomical fit'
  });

  if (!isAdminOpen) return null;

  // Preset Mannequin Wear Styles
  const mannequinPresets = [
    {
      id: 'windrunner',
      label: 'Kigali Stealth Windrunner Look',
      image: '/mannequin-windrunner.jpg',
      garmentStyle: 'jacket',
      desc: 'Matte black boutique mannequin wearing Kigali Windrunner, cargo pants, and black sneakers'
    },
    {
      id: 'hoodie',
      label: 'Pan-African 480GSM Hoodie Look',
      image: '/mannequin-hoodie.jpg',
      garmentStyle: 'hoodie',
      desc: 'Matte black boutique mannequin wearing heavy oversized hoodie, cargo sweatpants, and sneakers'
    },
    {
      id: 'leather',
      label: 'Handcrafted Biker Leather Look',
      image: '/mannequin-leather.jpg',
      garmentStyle: 'leather',
      desc: 'Matte black boutique mannequin wearing lambskin motorcycle jacket, tailored trousers, and boots'
    },
    {
      id: 'tee',
      label: 'Boxy Minimalist Tee Look',
      image: '/mannequin-tee.jpg',
      garmentStyle: 'tee',
      desc: 'Matte black boutique mannequin wearing heavy cotton minimalist boxy tee, cargo trousers, and sneakers'
    },
    {
      id: 'puffer',
      label: 'Virunga Alpine Down Puffer Look',
      image: '/m2.jpg',
      garmentStyle: 'puffer',
      desc: 'Studio catalog mannequin wearing quilted Army Green Down Puffer jacket, cap, and trousers'
    },
    {
      id: 'denim',
      label: 'Selvedge Raw Denim Trucker Look',
      image: '/m3.jpg',
      garmentStyle: 'denim',
      desc: 'Studio catalog mannequin wearing 14oz raw selvedge denim trucker jacket, cap, and trousers'
    },
    {
      id: 'trench',
      label: 'Noir Wool Trench Coat Look',
      image: '/m1.jpg',
      garmentStyle: 'coat',
      desc: 'Studio catalog mannequin wearing tailored Camel Wool Trench Coat, dark shirt, and trousers'
    }
  ];

  // Curated Preset Image Library
  const imagePresets = [
    {
      category: 'Outerwear',
      url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      name: 'Black Tech Shell'
    },
    {
      category: 'Hoodie',
      url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      name: 'Heavy French Terry'
    },
    {
      category: 'Leather',
      url: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&auto=format&fit=crop&q=80',
      name: 'Lambskin Moto'
    },
    {
      category: 'Denim',
      url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
      name: 'Indigo Selvedge'
    },
    {
      category: 'Tee',
      url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      name: '280GSM Boxy Tee'
    },
    {
      category: 'Puffer',
      url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
      name: 'Alpine Down Puffer'
    },
    {
      category: 'Sneakers',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      name: 'Carbon Plate Runner'
    },
    {
      category: 'Pants',
      url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
      name: 'Safari Cargo Trousers'
    }
  ];

  // Handle Image Upload (Converts to Data URL)
  const handleFileUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, [field]: reader.result }));
      showToast(`Uploaded custom image for ${field}`);
    };
    reader.readAsDataURL(file);
  };

  // Submit New Clothes
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a product title');
      return;
    }

    const newProd = addProduct({
      name: formData.name.trim(),
      origin: formData.origin.trim() || 'HURANOW Studio Lab',
      demographic: formData.demographic,
      category: formData.category,
      slot: formData.slot,
      price: Number(formData.price) || 50000,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      tag: formData.tag.trim() || 'NEW DROP',
      tagType: formData.tagType,
      garmentStyle: formData.garmentStyle,
      mannequinImage: formData.mannequinImage,
      image: formData.image,
      hoverImage: formData.hoverImage || formData.image,
      description: formData.description,
      details: formData.details.split('\n').filter(Boolean)
    });

    // Auto-equip the new garment on the mannequin so it wears it immediately!
    if (newProd.slot && newProd.slot !== 'beauty') {
      equipFitItem(newProd.slot, newProd.id);
      showToast(`New clothes published and equipped on mannequin!`);
    }

    // Switch to inventory view
    setActiveTab('inventory');
  };

  // Filtered Products for Inventory Table
  const filteredProducts = (products || []).filter(p => {
    const matchesSearch = !searchFilter || 
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.origin?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.id.toLowerCase().includes(searchFilter.toLowerCase());
    
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/95 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl bg-[#0c0c0e] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[96vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-800/80 bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-200 text-black rounded-xl shadow-lg">
              <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black uppercase text-white font-display tracking-tight">
                  HURANOW ADMIN & INVENTORY
                </h2>
                <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Store Manager
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Add new clothes, manage catalog & configure live mannequin fitting outfits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetProductsToDefault}
              className="text-[11px] font-bold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center gap-1.5"
              title="Reset catalog back to initial factory collection"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Catalog</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 px-5 sm:px-6 py-2.5 bg-[#0e0e11] border-b border-zinc-800/80 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-white text-black shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Clothes & Products ({products?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'add'
                ? 'bg-amber-400 text-black shadow-lg font-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add New Clothes</span>
          </button>

          <button
            onClick={() => setActiveTab('mannequin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'mannequin'
                ? 'bg-white text-black shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Live Mannequin State</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-white text-black shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Sales ({orders?.length || 0})</span>
          </button>
        </div>

        {/* Main Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#09090b]">

          {/* ======================================================== */}
          {/* TAB 1: INVENTORY & PRODUCT MANAGEMENT                    */}
          {/* ======================================================== */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              
              {/* Search & Filter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by title, origin or product ID..."
                    className="w-full bg-[#121215] border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
                        categoryFilter === cat.id
                          ? 'bg-zinc-800 text-white border-zinc-600 shadow'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.map(product => {
                  const isWorn = Boolean(product.slot && fitState.worn?.[product.slot] === product.id);

                  return (
                    <div
                      key={product.id}
                      className="bg-[#111115] border border-zinc-800/80 rounded-2xl p-3 flex gap-3 relative group hover:border-zinc-700 transition-colors"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-black shrink-0 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {isWorn && (
                          <div className="absolute top-1 right-1 bg-amber-400 text-black px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                            Worn
                          </div>
                        )}
                      </div>

                      {/* Info & Actions */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[9px] uppercase font-bold text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                              {product.demographic} • {product.slot || product.category}
                            </span>
                            <span className="text-xs font-extrabold text-amber-400">
                              {formatPrice(product.price)}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-white truncate" title={product.name}>
                            {product.name}
                          </h4>
                          <p className="text-[10px] text-zinc-400 truncate">
                            {product.origin || 'HURANOW Lab'}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-800/80 mt-2">
                          {product.slot && product.slot !== 'beauty' && (
                            <button
                              onClick={() => {
                                equipFitItem(product.slot, product.id);
                                showToast(isWorn ? `Removed ${product.name} from mannequin` : `Mannequin is now wearing ${product.name}!`);
                              }}
                              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                                isWorn
                                  ? 'bg-amber-400 text-black shadow'
                                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-700'
                              }`}
                            >
                              <Shirt className="w-3 h-3" />
                              <span>{isWorn ? 'Worn on Mannequin' : 'Dress Mannequin'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/80 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-800 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-12 text-center text-xs text-zinc-500 bg-zinc-950 rounded-2xl border border-dashed border-zinc-800">
                    No products matched your search or category filter.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: + ADD NEW CLOTHES / PRODUCT CREATOR               */}
          {/* ======================================================== */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Title & Origin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Kigali Obsidian Tech Windbreaker"
                      className="w-full bg-[#141418] border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                      Origin / Craft Heritage
                    </label>
                    <input
                      type="text"
                      value={formData.origin}
                      onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                      placeholder="e.g. Made in Rwanda"
                      className="w-full bg-[#141418] border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Demographic & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                      Demographic
                    </label>
                    <div className="grid grid-cols-4 gap-1 bg-[#141418] border border-zinc-700 p-1 rounded-xl">
                      {[
                        { id: 'men', label: 'Men' },
                        { id: 'women', label: 'Women' },
                        { id: 'kids', label: 'Kids' },
                        { id: 'baby', label: 'Baby' }
                      ].map(d => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, demographic: d.id }))}
                          className={`py-1 text-xs font-bold rounded-lg transition-all ${
                            formData.demographic === d.id
                              ? 'bg-white text-black shadow'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-[#141418] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="clothes">Outfits & Clothes</option>
                      <option value="shoes">Shoes & Footwear</option>
                      <option value="beauty">African Luxury Beauty</option>
                      <option value="accessories">Gear & Accessories</option>
                    </select>
                  </div>
                </div>

                {/* Wardrobe Slot */}
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                    Fitting Studio Wardrobe Slot
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-[#141418] border border-zinc-700 p-1 rounded-xl">
                    {FITTING_SLOTS.map(slot => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, slot: slot.id }))}
                        className={`py-1.5 px-1 text-[11px] font-bold rounded-lg transition-all text-center truncate ${
                          formData.slot === slot.id
                            ? 'bg-amber-400 text-black shadow font-black'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {slot.label.split('/')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prices & Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                      Price (RWF) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1000"
                      step="1000"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full bg-[#141418] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                      Original Price (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                      className="w-full bg-[#141418] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-400 outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                      Tag Badge
                    </label>
                    <input
                      type="text"
                      value={formData.tag}
                      onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                      placeholder="e.g. NEW DROP"
                      className="w-full bg-[#141418] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* CRUCIAL: MANNEQUIN FIT ARCHETYPE & WEAR PHOTO */}
                <div className="p-3.5 bg-zinc-950 border border-amber-500/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Mannequin Fit Archetype (How Mannequin Wears It)
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Real boutique display photo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mannequinPresets.map(preset => {
                      const isSelected = formData.mannequinImage === preset.image;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            mannequinImage: preset.image,
                            garmentStyle: preset.garmentStyle
                          }))}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                          }`}
                        >
                          <img
                            src={preset.image}
                            alt={preset.label}
                            className="w-10 h-10 rounded-lg object-cover bg-black shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold block truncate text-white">
                              {preset.label}
                            </span>
                            <span className="text-[9px] text-zinc-500 block truncate">
                              {preset.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Or Custom Mannequin URL / Upload */}
                  <div className="pt-2 border-t border-zinc-800/80">
                    <label className="text-[10px] font-bold text-zinc-400 block mb-1">
                      Or Upload Custom Mannequin Photo URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.mannequinImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, mannequinImage: e.target.value }))}
                        placeholder="https://... or /mannequin-windrunner.jpg"
                        className="flex-1 bg-[#141418] border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
                      />
                      <label className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'mannequinImage')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Product Catalog Image */}
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                    Product Catalog Image
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="Product image URL..."
                      className="flex-1 bg-[#141418] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                    <label className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'image')}
                      />
                    </label>
                  </div>

                  {/* Preset Library Quick Buttons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    <span className="text-[10px] text-zinc-500 font-bold mr-1">Presets:</span>
                    {imagePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: preset.url }))}
                        className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-[10px] font-bold text-zinc-300 whitespace-nowrap"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description & Details */}
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#141418] border border-zinc-700 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-300 uppercase block mb-1">
                    Key Features / Details (One bullet per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.details}
                    onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                    className="w-full bg-[#141418] border border-zinc-700 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-400 font-mono text-[11px]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl active:scale-98 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-black stroke-[3]" />
                  <span>Publish Clothes & Dress on Mannequin</span>
                </button>

              </div>

              {/* Right Column: Live Dual Preview (Catalog Card + Mannequin Dressed) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* 1. Real Mannequin Wearing The New Clothes Preview */}
                <div className="bg-[#111115] border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white uppercase flex items-center gap-1.5">
                      <Shirt className="w-3.5 h-3.5 text-amber-400" />
                      Live Mannequin Wear Preview
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                      ✓ Fits Live Mannequin
                    </span>
                  </div>

                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center group">
                    <img
                      src={formData.mannequinImage}
                      alt="Mannequin Wearing Preview"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none"></div>

                    {/* Tag badge on preview */}
                    <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md border border-zinc-700 p-2.5 rounded-xl space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span className="truncate">{formData.name || 'New Clothes Preview'}</span>
                        <span className="text-amber-400">{formatPrice(Number(formData.price) || 0)}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                        <span>Slot: <strong className="text-white uppercase">{formData.slot}</strong></span>
                        <span className="text-emerald-400 font-bold">Live Mannequin Ready</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Store Catalog Product Card Preview */}
                <div className="bg-[#111115] border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-bold text-white uppercase block">
                    Catalog Card Preview
                  </span>

                  <div className="max-w-[240px] mx-auto bg-[#0f0f11] border border-zinc-800 rounded-2xl overflow-hidden p-2.5 shadow-xl">
                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black mb-2 relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-amber-400 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                        {formData.tag || 'NEW'}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-white truncate">
                      {formData.name || 'Product Title'}
                    </h5>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-extrabold text-amber-400">
                        {formatPrice(Number(formData.price) || 0)}
                      </span>
                      <span className="text-[9px] text-zinc-400 uppercase font-bold">
                        {formData.origin}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 3: LIVE MANNEQUIN STATE CONTROL                      */}
          {/* ======================================================== */}
          {activeTab === 'mannequin' && (
            <div className="space-y-6">
              
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">
                    Currently Dressed Look on Boutique Mannequin
                  </h3>
                  <p className="text-xs text-zinc-400">
                    See each wardrobe layer worn on the live mannequin. Tap any slot to test swap or clear.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsFittingRoomOpen(true);
                      setIsAdminOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-zinc-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Launch Fitting Studio</span>
                  </button>

                  <button
                    onClick={clearFit}
                    className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Mannequin</span>
                  </button>
                </div>
              </div>

              {/* Slot Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {FITTING_SLOTS.map(slot => {
                  const equippedId = fitState.worn?.[slot.id];
                  const product = equippedId ? (products || []).find(p => p.id === equippedId) : null;

                  return (
                    <div
                      key={slot.id}
                      className="bg-[#111115] border border-zinc-800 rounded-2xl p-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">
                          {slot.label}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${product ? 'bg-amber-400' : 'bg-zinc-700'}`}></span>
                      </div>

                      {product ? (
                        <div className="space-y-2">
                          <div className="aspect-square rounded-xl overflow-hidden bg-black border border-zinc-800">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h5 className="text-[11px] font-bold text-white truncate" title={product.name}>
                              {product.name}
                            </h5>
                            <span className="text-[10px] text-amber-400 font-semibold">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                          <button
                            onClick={() => equipFitItem(slot.id, product.id)}
                            className="w-full py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="aspect-square rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center p-2 text-center text-zinc-600 text-[10px]">
                          <span>Empty Slot</span>
                          <span className="text-[8px] text-zinc-500 mt-1">Tap a product to dress</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Preset Outfit Quick Loader */}
              <div className="bg-[#111115] border border-zinc-800 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-white uppercase block">
                  Quick Load Signature Outfits onto Mannequin:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      title: 'Kigali Stealth Windrunner Set',
                      top: 'hn-top-01',
                      bottom: 'hn-bot-01',
                      shoe: 'hn-sh-01',
                      desc: 'Weatherproof shell + safari cargo trousers + matrix runners'
                    },
                    {
                      title: '480GSM Heavy Streetwear Look',
                      top: 'hn-top-02',
                      bottom: 'hn-bot-02',
                      shoe: 'hn-sh-02',
                      desc: 'Oversized black hoodie + track pants + nubuck leather lows'
                    },
                    {
                      title: 'Motorcycle Artisan Leather Fit',
                      top: 'hn-top-06',
                      bottom: 'hn-bot-01',
                      shoe: 'hn-sh-03',
                      desc: 'Biker lambskin jacket + safari cargos + waterproof sneakerboots'
                    }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        equipFitItem('top', preset.top);
                        equipFitItem('bottom', preset.bottom);
                        equipFitItem('shoe', preset.shoe);
                        showToast(`Loaded ${preset.title} onto mannequin!`);
                      }}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-400/60 text-left transition-all group"
                    >
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-400">
                        {preset.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        {preset.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: ORDERS & STORE SALES METRICS                      */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#111115] border border-zinc-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">Total Products</span>
                  <span className="text-2xl font-black text-white">{products?.length || 0}</span>
                </div>

                <div className="bg-[#111115] border border-zinc-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">Customer Orders</span>
                  <span className="text-2xl font-black text-amber-400">{orders?.length || 0}</span>
                </div>

                <div className="bg-[#111115] border border-zinc-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">Active Fit Slots</span>
                  <span className="text-2xl font-black text-emerald-400">
                    {Object.values(fitState.worn || {}).filter(Boolean).length} / 6
                  </span>
                </div>

                <div className="bg-[#111115] border border-zinc-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">System Status</span>
                  <span className="text-xs font-black text-white flex items-center gap-1.5 mt-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live & Operational
                  </span>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#111115] border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-zinc-800 text-xs font-bold text-white uppercase">
                  Recent Store Orders
                </div>

                {orders && orders.length > 0 ? (
                  <div className="divide-y divide-zinc-800/80">
                    {orders.map(order => (
                      <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{order.id}</span>
                            <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded">
                              {order.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            {new Date(order.date).toLocaleString()} • {order.items.length} items
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold text-white text-sm">
                            {formatPrice(order.total)}
                          </span>
                          <span className="text-[10px] text-zinc-500 block">
                            Paid via {order.paymentMethod?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    No orders placed yet in this session.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
