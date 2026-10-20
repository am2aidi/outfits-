// HURANOW Official Product Catalog
// Inspired by Nike Egypt / Global Store & Huranow "Fit, Wear, Buy"

export const CURRENCY_RATES = {
  RWF: { symbol: 'RWF', rate: 1, format: (n) => `RWF ${Math.round(n).toLocaleString('en-US')}` },
  USD: { symbol: '$', rate: 0.00078, format: (n) => `$${(n * 0.00078).toFixed(2)}` },
  EUR: { symbol: '€', rate: 0.00072, format: (n) => `€${(n * 0.00072).toFixed(2)}` },
};

export const DEMOGRAPHICS = [
  { id: 'all', label: 'All Demographics' },
  { id: 'men', label: 'Men', short: 'M' },
  { id: 'women', label: 'Women', short: 'W' },
  { id: 'kids', label: 'Kids (5-14Y)', short: 'K' },
  { id: 'baby', label: 'Baby & Toddler (0-4Y)', short: 'B' },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'clothes', label: 'Outfits & Clothes' },
  { id: 'shoes', label: 'Shoes & Sneakers' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'beauty', label: 'Beauty & Fragrance' },
];

// Fitting Room Slots
export const FITTING_SLOTS = [
  { id: 'top', label: 'Top / Jacket' },
  { id: 'bottom', label: 'Bottom / Pants' },
  { id: 'shoe', label: 'Footwear' },
  { id: 'head', label: 'Headwear' },
  { id: 'face', label: 'Eyewear' },
  { id: 'bag', label: 'Bags & Carry' },
];

// Real Mannequin / Model references for the Fitting Room
export const MANNEQUINS = {
  men: {
    name: 'Male Athletic Mannequin',
    height: "6'1\"",
    baseImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
    silhouetteUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    defaultSizes: { clothes: 'L', shoes: '42' }
  },
  women: {
    name: 'Female Sculpt Mannequin',
    height: "5'9\"",
    baseImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    silhouetteUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    defaultSizes: { clothes: 'M', shoes: '38' }
  },
  kids: {
    name: 'Junior Athletic Model',
    height: "4'5\"",
    baseImage: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80',
    silhouetteUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
    defaultSizes: { clothes: '8Y', shoes: '32' }
  },
  baby: {
    name: 'Baby & Toddler Model',
    height: "2'4\"",
    baseImage: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80',
    silhouetteUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
    defaultSizes: { clothes: '6-12M', shoes: '18' }
  }
};

// Size lookup tables
export const SIZE_SYSTEM = {
  men: {
    clothes: ['S', 'M', 'L', 'XL', '2XL'],
    shoes: ['40', '41', '42', '43', '44', '45', '46']
  },
  women: {
    clothes: ['XS', 'S', 'M', 'L', 'XL'],
    shoes: ['36', '37', '38', '39', '40', '41']
  },
  kids: {
    clothes: ['4Y', '6Y', '8Y', '10Y', '12Y', '14Y'],
    shoes: ['28', '30', '32', '34', '36']
  },
  baby: {
    clothes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
    shoes: ['16', '17', '18', '19', '20']
  }
};

export const PRODUCTS = [
  // =================== MEN ===================
  {
    id: 1,
    name: "Men's HURANOW Stealth Windrunner Track Jacket",
    category: 'clothes',
    demographic: 'men',
    slot: 'top',
    price: 68000,
    originalPrice: 85000,
    tag: 'NEW LAUNCH',
    tagType: 'new',
    rating: 4.9,
    reviews: 142,
    colors: ['#000000', '#27272a', '#1e293b'],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80',
    description: 'Constructed from lightweight storm-repellent ripstop with matte taped waterproof zippers, ergonomic chevron chest design, and breathable back ventilation slits.',
    details: ['100% Recycled polyester micro-ripstop', 'Storm-FIT wind and moisture barrier', 'Secure zippered hand pockets', 'Tonal embroidered HURANOW logo on chest']
  },
  {
    id: 2,
    name: "Men's Heavyweight Fleece Oversized Tee",
    category: 'clothes',
    demographic: 'men',
    slot: 'top',
    price: 24000,
    originalPrice: 30000,
    tag: 'BEST SELLER',
    tagType: 'hot',
    rating: 4.95,
    reviews: 310,
    colors: ['#0a0a0a', '#ffffff', '#52525b'],
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    description: '300 GSM dense organic combed cotton. Boxy drop-shoulder silhouette inspired by modern Tokyo street style.',
    details: ['Heavy 300 GSM combed jersey', 'Pre-shrunk ribbed crew collar', 'Double-needle hem stitch', 'Minimalist side hem flag label']
  },
  {
    id: 3,
    name: "Men's HURANOW Tactical Utility Cargo Trousers",
    category: 'clothes',
    demographic: 'men',
    slot: 'bottom',
    price: 48000,
    originalPrice: 58000,
    tag: 'FEATURED',
    tagType: 'feature',
    rating: 4.88,
    reviews: 89,
    colors: ['#0f0f11', '#1f2937', '#2e2b27'],
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=80',
    description: 'Engineered for mobility with articulated knee darts, waterproof zip cargo bellows, and an integrated Fidlock magnetic belt clip.',
    details: ['DWR coated water-resistant stretch canvas', '6 tactical storage pockets', 'Adjustable bungee leg openings', 'Reinforced gusseted crotch']
  },
  {
    id: 4,
    name: "Men's HURANOW Matrix Stealth Carbon Runner",
    category: 'shoes',
    demographic: 'men',
    slot: 'shoe',
    price: 110000,
    originalPrice: 135000,
    tag: 'SNKRS DROP',
    tagType: 'hot',
    rating: 4.98,
    reviews: 420,
    colors: ['#09090b', '#dc2626', '#3b82f6'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
    description: 'The pinnacle of marathon racing technology. Full-length curved carbon fiber propulsion plate encased in supercritical nitrogen-infused foam.',
    details: ['VaporWeave translucent engineered mesh upper', 'Full carbon-composite plate', 'Continental high-grip waffle tread', 'Weight: 205 grams']
  },
  {
    id: 5,
    name: "Men's Court Retro High Stealth Sneaker",
    category: 'shoes',
    demographic: 'men',
    slot: 'shoe',
    price: 95000,
    originalPrice: null,
    tag: 'ICONIC',
    tagType: 'feature',
    rating: 4.91,
    reviews: 260,
    colors: ['#121214', '#e4e4e7'],
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=80',
    description: 'Tumbled black full-grain leather paired with perforated toe box and encapsulated air-sole heel cushion.',
    details: ['Full grain leather and nubuck', 'Encapsulated Air-Sole unit', 'Solid rubber cupsole with pivot circle', 'Padded high collar']
  },

  // =================== WOMEN ===================
  {
    id: 6,
    name: "Women's HURANOW Seamless Sculpt Compression Top",
    category: 'clothes',
    demographic: 'women',
    slot: 'top',
    price: 38000,
    originalPrice: 48000,
    tag: 'TRENDING',
    tagType: 'hot',
    rating: 4.96,
    reviews: 215,
    colors: ['#0f0f11', '#4c1d95', '#831843'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80',
    description: 'Second-skin engineered knit that provides high-support compression while maintaining featherweight breathability.',
    details: ['Sweat-wicking Dri-Motion yarn', 'Ribbed contour waistband for secure grip', 'Removable molded modesty cups', 'Seamless friction-free build']
  },
  {
    id: 7,
    name: "Women's HURANOW Noir Bonded Trench Track Coat",
    category: 'clothes',
    demographic: 'women',
    slot: 'top',
    price: 92000,
    originalPrice: 115000,
    tag: 'LUXURY DROP',
    tagType: 'hot',
    rating: 4.94,
    reviews: 88,
    colors: ['#000000', '#3f3f46'],
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    description: 'Dramatic architectural silhouette inspired by couture runways, cut from matte water-repellent memory fabric with internal storm harness.',
    details: ['Matte double-faced memory taffeta', 'Detachable webbing waist belt', 'Concealed magnet storm flap closure', 'Deep internal device pockets']
  },
  {
    id: 8,
    name: "Women's High-Rise Sculpt Biker Legging",
    category: 'clothes',
    demographic: 'women',
    slot: 'bottom',
    price: 36000,
    originalPrice: 44000,
    tag: 'BEST SELLER',
    tagType: 'hot',
    rating: 4.97,
    reviews: 520,
    colors: ['#000000', '#1c1917', '#172554'],
    image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=500&auto=format&fit=crop&q=80',
    description: '100% squat-proof compression leggings featuring zero front seam, curved glute sculpting contour, and side drop-in phone sleeve.',
    details: ['Zero camel-toe seamless front', 'Four-way omni-stretch fabric', 'High compression bonded waistband', 'Drop-in phone pocket']
  },
  {
    id: 9,
    name: "Women's AeroGlide Chunky Platform Sneaker",
    category: 'shoes',
    demographic: 'women',
    slot: 'shoe',
    price: 88000,
    originalPrice: 105000,
    tag: 'NEW',
    tagType: 'new',
    rating: 4.89,
    reviews: 134,
    colors: ['#09090b', '#fafafa', '#d4d4d8'],
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80',
    description: 'Chunky architectural platform sole with cloud-foam dual density rebound. Lightweight, sleek, and effortlessly elevated.',
    details: ['Sculpted 45mm platform sole', 'Breathable engineered monomesh', 'Ortholite anti-odor insole', 'Reflective heel pull tab']
  },

  // =================== KIDS (5-14Y) ===================
  {
    id: 10,
    name: "Junior HURANOW Swift Reflective Track Jacket",
    category: 'clothes',
    demographic: 'kids',
    slot: 'top',
    price: 42000,
    originalPrice: 50000,
    tag: 'KIDS FAVORITE',
    tagType: 'hot',
    rating: 4.92,
    reviews: 78,
    colors: ['#18181b', '#0369a1'],
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&auto=format&fit=crop&q=80',
    description: 'Durable sports zip jacket built for school, practice, and play. Features reinforced elbow panels and 360-degree reflective trim.',
    details: ['Rip-resistant brush-backed fleece', '360° reflective high-vis piping', 'Anti-pinch chin guard on zipper', 'Machine washable at 40°C']
  },
  {
    id: 11,
    name: "Junior Athletic Speed Track Pants",
    category: 'clothes',
    demographic: 'kids',
    slot: 'bottom',
    price: 32000,
    originalPrice: 38000,
    tag: 'DURABLE',
    tagType: 'feature',
    rating: 4.88,
    reviews: 64,
    colors: ['#18181b', '#374151'],
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&auto=format&fit=crop&q=80',
    description: 'Double-stitched reinforced knee patches and comfortable elastic waistband with internal safety drawstring.',
    details: ['Abrasion-resistant knee pads', 'Elastic cinch cuff ankles', 'Deep mesh-lined hand pockets', 'Tear-resistant poly blend']
  },
  {
    id: 12,
    name: "Junior HURANOW Flex Blade Speed Runner",
    category: 'shoes',
    demographic: 'kids',
    slot: 'shoe',
    price: 55000,
    originalPrice: 65000,
    tag: 'EASY ON/OFF',
    tagType: 'new',
    rating: 4.95,
    reviews: 110,
    colors: ['#09090b', '#dc2626', '#eab308'],
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&auto=format&fit=crop&q=80',
    description: 'Speed-toggle bungee cord laces with zero tying required. High grip non-marking rubber outsoles protect gym floors and pavement.',
    details: ['Speed toggle lace lock', 'Non-marking gym sole', 'Cushioned foam midsole for growth plates', 'Washable mesh upper']
  },

  // =================== BABY & TODDLER (0-4Y) ===================
  {
    id: 13,
    name: "HURANOW Baby Organic Soft-Flex Romper",
    category: 'clothes',
    demographic: 'baby',
    slot: 'top',
    price: 28000,
    originalPrice: 34000,
    tag: '100% ORGANIC',
    tagType: 'hot',
    rating: 4.99,
    reviews: 198,
    colors: ['#1c1917', '#e7e5e4', '#44403c'],
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&auto=format&fit=crop&q=80',
    description: 'Hypoallergenic GOTS certified combed organic cotton with two-way zipper for effortless nighttime diaper checks.',
    details: ['100% GOTS certified combed cotton', 'Full length two-way safety zipper', 'Protective fabric zipper garage at neck', 'Fold-over scratch mittens (sizes up to 6M)']
  },
  {
    id: 14,
    name: "Baby First-Step Stealth Soft-Sole Pre-Walker",
    category: 'shoes',
    demographic: 'baby',
    slot: 'shoe',
    price: 26000,
    originalPrice: 32000,
    tag: 'PEDIATRIC APPROVED',
    tagType: 'feature',
    rating: 4.97,
    reviews: 144,
    colors: ['#000000', '#f5f5f5'],
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1555009393-f20bdb245c4d?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&auto=format&fit=crop&q=80',
    description: 'Zero-drop barefoot sole recommended by pediatricians to support natural arch and balance development during first steps.',
    details: ['Ultra-flexible natural silicone sole', 'Slip-resistant sensory grips', 'Elastic heel collar keeps shoe in place', 'Featherweight under 40 grams']
  },

  // =================== ACCESSORIES (UNISEX / ALL) ===================
  {
    id: 15,
    name: "HURANOW Stealth Aerodynamic Baseball Cap",
    category: 'accessories',
    demographic: 'men',
    slot: 'head',
    price: 18000,
    originalPrice: 22000,
    tag: 'ESSENTIAL',
    tagType: 'feature',
    rating: 4.88,
    reviews: 165,
    colors: ['#000000', '#e5e7eb'],
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=80',
    description: 'Structured low-profile athletic cap made from laser-perforated quick-dry poly with matte rubber logo badge.',
    details: ['Laser-cut side ventilation eyelets', 'Moisture-wicking internal sweatband', 'Adjustable quick-release metal clip strap', 'Curved pre-shaped brim']
  },
  {
    id: 16,
    name: "HURANOW Noir Tactical Polarized Sunglasses",
    category: 'accessories',
    demographic: 'men',
    slot: 'face',
    price: 32000,
    originalPrice: 42000,
    tag: 'UV400',
    tagType: 'feature',
    rating: 4.93,
    reviews: 98,
    colors: ['#09090b', '#374151'],
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=80',
    description: 'Shatterproof TR90 polymer frames with polarized glare-eliminating lenses and oleophobic sweat-repellent coating.',
    details: ['Category 3 UV400 full ultraviolet block', 'TR90 memory-flex indestructible frame', 'Hydrophobic anti-fog lens coating', 'Includes matte hard case & microfiber pouch']
  },
  {
    id: 17,
    name: "HURANOW Ballistic Cordura Shoulder Bag",
    category: 'accessories',
    demographic: 'women',
    slot: 'bag',
    price: 45000,
    originalPrice: 55000,
    tag: 'HOT ITEM',
    tagType: 'hot',
    rating: 4.96,
    reviews: 240,
    colors: ['#000000', '#78350f'],
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=80',
    description: 'Minimalist crossbody sling crafted from 1000D waterproof Cordura with quick-adjust magnetic shoulder strap.',
    details: ['1000D Ballistic Cordura nylon', 'Fidlock V-buckle magnetic release', 'Padded fleece interior phone compartment', 'Key clip & hidden passport pocket']
  },
  {
    id: 18,
    name: "HURANOW Stealth Titanium Chrono Watch",
    category: 'accessories',
    demographic: 'men',
    slot: 'bag',
    price: 180000,
    originalPrice: 220000,
    tag: 'TITANIUM',
    tagType: 'hot',
    rating: 4.98,
    reviews: 67,
    colors: ['#0a0a0a'],
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=80',
    description: 'Diamond-Like Carbon (DLC) matte black coated titanium with scratchproof sapphire crystal and 100M water resistance.',
    details: ['Aerospace Grade 5 Titanium case', 'Anti-reflective sapphire crystal', '100m / 330ft water resistance', 'Swiss Ronda quartz movement']
  },

  // =================== BEAUTY & GROOMING ===================
  {
    id: 19,
    name: "HURANOW Noir Extrait De Parfum (50ml)",
    category: 'beauty',
    demographic: 'men',
    slot: 'beauty',
    price: 75000,
    originalPrice: 90000,
    tag: 'ICONIC SCENT',
    tagType: 'hot',
    rating: 4.99,
    reviews: 380,
    colors: ['#050505'],
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=80',
    description: 'Pure extrait de parfum concentration (28% oil). Opening with crisp Calabrian bergamot, leading to smoked birch, dark leather, and aged Haitian vetiver.',
    details: ['28% Extrait de Parfum concentration', '14+ hour long-lasting sillage', 'Handcrafted black glass flacon with magnetic cap', 'Unisex scent profile']
  },
  {
    id: 20,
    name: "HURANOW Midnight Recovery Barrier Oil",
    category: 'beauty',
    demographic: 'women',
    slot: 'beauty',
    price: 38000,
    originalPrice: 48000,
    tag: 'DERM TESTED',
    tagType: 'feature',
    rating: 4.95,
    reviews: 215,
    colors: ['#292524'],
    image: 'https://images.unsplash.com/photo-1608248597359-009d1d078174?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1608248597359-009d1d078174?w=500&auto=format&fit=crop&q=80',
    description: 'Overnight regenerative elixir powered by plant squalane, evening primrose, and natural bakuchiol to rebuild the moisture barrier.',
    details: ['100% cold-pressed botanical oils', 'Non-comedogenic pore-safe formula', 'Fragrance-free and vegan', '30ml UV-protected dropper bottle']
  },
  {
    id: 21,
    name: "HURANOW Gentle Organic Baby Soothing Balm",
    category: 'beauty',
    demographic: 'baby',
    slot: 'beauty',
    price: 22000,
    originalPrice: null,
    tag: '100% PURE',
    tagType: 'new',
    rating: 4.98,
    reviews: 130,
    colors: ['#262626'],
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80',
    fitImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80',
    description: 'Hypoallergenic multi-use butter formulated with raw shea, colloidal oat extract, and organic calendula for sensitive newborn skin and diaper care.',
    details: ['0% Fragrance, parabens, phthalates, or sulfates', 'Pediatrician and dermatologist approved', 'Safe for eczema-prone baby skin', '100g recyclable amber jar']
  }
];

// Quick lookup map
export const PRODUCT_MAP = PRODUCTS.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {});
