import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Search, RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, DEMOGRAPHICS, CATEGORIES } from '../data/products';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const {
    activeDemographic,
    setActiveDemographic,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    products
  } = useShop();

  // Filter products by demographic, category, and search query
  const filteredProducts = (products || PRODUCTS).filter((product) => {
    // Demographic filter
    const matchesDemographic =
      activeDemographic === 'all' ||
      product.demographic === activeDemographic ||
      (product.demographic === 'unisex' && (activeDemographic === 'men' || activeDemographic === 'women'));

    // Category filter
    const matchesCategory =
      activeCategory === 'all' || product.category === activeCategory;

    // Search query
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.demographic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDemographic && matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'newest') return (b.tagType === 'new' ? 1 : 0) - (a.tagType === 'new' ? 1 : 0);
    return 0; // Default featured
  });

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      
      {/* Title & Demographics Horizontal Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-zinc-400 block mb-1">
            Official Catalog
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-display tracking-tight">
            EXPLORE THE COLLECTION
          </h2>
        </div>

        {/* Demographic Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {DEMOGRAPHICS.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemographic(demo.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeDemographic === demo.id
                  ? 'bg-white text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {demo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Bar: Category Chips & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                activeCategory === cat.id
                  ? 'bg-zinc-800 text-white border-zinc-400'
                  : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort & Count Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Showing <strong className="text-white">{sortedProducts.length}</strong> items
          </span>

          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-medium outline-none cursor-pointer"
            >
              <option value="featured" className="bg-zinc-900">Featured</option>
              <option value="newest" className="bg-zinc-900">New Drops</option>
              <option value="price-low" className="bg-zinc-900">Price: Low to High</option>
              <option value="price-high" className="bg-zinc-900">Price: High to Low</option>
              <option value="rating" className="bg-zinc-900">Highest Rated</option>
            </select>
          </div>
        </div>

      </div>

      {/* Active Search Notification */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between bg-zinc-900/60 border border-zinc-800 px-4 py-2.5 rounded-xl text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-zinc-400" />
            <span>
              Searching for: <strong className="text-white">"{searchQuery}"</strong> ({sortedProducts.length} results)
            </span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-white hover:underline font-bold"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-zinc-950 rounded-2xl border border-dashed border-zinc-800 p-8">
          <p className="text-zinc-400 text-sm mb-4">
            No products found matching your current filter selection.
          </p>
          <button
            onClick={() => {
              setActiveDemographic('all');
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

    </section>
  );
}
