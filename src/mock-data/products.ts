import { Product } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- JEWELLS (From Jewels.zip) ---
  {
    id: 'prod-j01',
    slug: 'imperial-polki-choker-set',
    name: 'Imperial Polki & Emerald Choker Set',
    category: 'jewells',
    collection: 'Royal Heritage',
    shortDescription: 'Handcrafted Polki choker embellished with Zambian emerald beads and delicate freshwater pearls.',
    description: 'A regal masterpiece crafted in 18k hallmarked gold-finished brass. Features uncut Polki stones set in traditional open-claw settings, complemented by cascading clusters of deep green Zambian emerald drops and luminous South Sea pearl accents. Paired with matching handcrafted chandelier earrings.',
    sellingPrice: 42500,
    originalPrice: 48000,
    discountPercent: 11,
    isSale: true,
    sku: 'ELX-JW-PK01',
    stock: 6,
    lowStockThreshold: 3,
    images: [
      '/assets/products/jewels/jewel-01.jpeg',
      '/assets/products/jewels/jewel-02.jpeg',
      '/assets/products/jewels/new.png'
    ],
    coverImage: '/assets/products/jewels/jewel-01.jpeg',
    status: 'active',
    jewelleryAttributes: {
      materials: ['18K Gold Plated Brass', 'Uncut Polki', 'Zambian Emerald Glass', 'Freshwater Pearls'],
      finishes: ['Antique Gold Finish', 'High Polish Gold'],
      dimensions: 'Choker length: 18cm with adjustable dori. Earrings: 6.5cm length.',
      weight: '142 grams',
      care: 'Store in airtight velvet pouches. Avoid contact with perfumes, hairspray, and harsh moisture.'
    },
    variants: [
      { id: 'v-j01-1', sku: 'ELX-JW-PK01-EM', name: 'Zambian Emerald & Pearl', stock: 4, price: 42500 },
      { id: 'v-j01-2', sku: 'ELX-JW-PK01-RB', name: 'Burmese Ruby & Pearl', stock: 2, price: 44000 }
    ],
    rating: 4.9,
    reviewsCount: 28,
    tags: ['Bridal', 'Choker', 'Polki', 'Emerald', 'Bestseller'],
    featured: true,
    newArrival: true,
    updatedAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'prod-j02',
    slug: 'solitaire-crest-diamond-cuff',
    name: 'Solitaire Crest Diamond & Gold Cuff',
    category: 'jewells',
    collection: 'Atelier Modernist',
    shortDescription: 'Sculptural open-cuff bracelet studded with brilliant-cut simulated diamonds in 18k vermeil.',
    description: 'An architectural statement piece embodying contemporary European minimalism. Crafted with a micro-pave encrusted central crest that catches ambient light from every angle. Features a secure flexible hinge mechanism for seamless wrist contouring.',
    sellingPrice: 28900,
    originalPrice: 34000,
    discountPercent: 15,
    isSale: true,
    sku: 'ELX-JW-CF02',
    stock: 8,
    lowStockThreshold: 3,
    images: [
      '/assets/products/jewels/jewel-03.jpeg',
      '/assets/products/jewels/jewel-04.jpeg',
      '/assets/products/jewels/new2.png'
    ],
    coverImage: '/assets/products/jewels/jewel-03.jpeg',
    status: 'active',
    jewelleryAttributes: {
      materials: ['925 Sterling Silver', '18K Yellow Gold Vermeil', 'VVS Simulant Diamonds'],
      finishes: ['Satin Brushed & High Polish Gold', 'Rose Gold Finish'],
      dimensions: 'Diameter: 6.0cm (Medium), Band width: 1.4cm',
      weight: '38 grams',
      care: 'Wipe with microfiber cloth after wear. Keep away from chlorine and detergents.'
    },
    variants: [
      { id: 'v-j02-1', sku: 'ELX-JW-CF02-YG', name: '18K Yellow Gold Vermeil', stock: 5, price: 28900 },
      { id: 'v-j02-2', sku: 'ELX-JW-CF02-RG', name: '18K Rose Gold Vermeil', stock: 3, price: 28900 }
    ],
    rating: 4.8,
    reviewsCount: 19,
    tags: ['Bracelet', 'Diamonds', 'Modernist', 'Minimal'],
    featured: true,
    newArrival: true,
    updatedAt: '2026-09-16T12:00:00Z'
  },
  {
    id: 'prod-j03',
    slug: 'vintage-kundan-layered-necklace',
    name: 'Vintage Kundan & Pearl Layered Ranimyc',
    category: 'jewells',
    collection: 'Royal Heritage',
    shortDescription: 'Seven-strand ceremonial necklace handcrafted with kundan meenakari and natural seed pearls.',
    description: 'Exquisite bridal opulence rooted in centuries-old Rajasthani craftsmanship. Each kundan plaque is reverse-enamelled in signature Ellext ivory and cobalt meenakari, suspending cascading graduated pearls that drape gracefully across the neckline.',
    sellingPrice: 65000,
    originalPrice: 72000,
    discountPercent: 10,
    isSale: false,
    sku: 'ELX-JW-RN03',
    stock: 3,
    lowStockThreshold: 2,
    images: [
      '/assets/products/jewels/jewel-05.jpeg',
      '/assets/products/jewels/jewel-06.jpeg',
      '/assets/products/jewels/new3.png'
    ],
    coverImage: '/assets/products/jewels/jewel-05.jpeg',
    status: 'active',
    jewelleryAttributes: {
      materials: ['Pure Silver Base', '22K Gold Foil Kundan', 'Basra Seed Pearls', 'Meenakari Enamel'],
      finishes: ['Heirloom Antique Finish'],
      dimensions: 'Inner necklace drop: 24cm, Outer drop: 40cm',
      weight: '210 grams',
      care: 'Professional dry jewellery cleaning only. Store individually flat in silk folds.'
    },
    variants: [
      { id: 'v-j03-1', sku: 'ELX-JW-RN03-PR', name: 'Ivory Pearl & Kundan', stock: 3, price: 65000 }
    ],
    rating: 5.0,
    reviewsCount: 14,
    tags: ['Bridal', 'Heritage', 'Kundan', 'Pearls'],
    featured: true,
    newArrival: false,
    updatedAt: '2026-09-14T09:30:00Z'
  },
  {
    id: 'prod-j04',
    slug: 'art-deco-chandelier-earrings',
    name: 'Art Deco Geometric Chandelier Drops',
    category: 'jewells',
    collection: 'Nocturne Evening',
    shortDescription: 'Linear tiered drop earrings featuring baguette and brilliant-cut stones.',
    description: 'A striking tribute to 1920s Parisian glamour with sharp rectilinear architecture. Light dances across alternating rows of custom-cut baguettes and round pavé crystals, ending in slender spear pendants that sway effortlessly with movement.',
    sellingPrice: 16800,
    originalPrice: 19500,
    discountPercent: 14,
    isSale: true,
    sku: 'ELX-JW-EA04',
    stock: 12,
    lowStockThreshold: 4,
    images: [
      '/assets/products/jewels/jewel-07.jpeg',
      '/assets/products/jewels/jewel-08.jpeg',
      '/assets/products/jewels/new4.png'
    ],
    coverImage: '/assets/products/jewels/jewel-07.jpeg',
    status: 'active',
    jewelleryAttributes: {
      materials: ['Rhodium Plated 925 Silver', 'Faceted Crystal Zirconia'],
      finishes: ['Platinum Bright White Rhodium'],
      dimensions: 'Length: 7.2cm, Width: 2.1cm at base',
      weight: '22 grams (pair)',
      care: 'Avoid alcohol wipes. Gently clean with mild soapy warm water and pat dry.'
    },
    variants: [
      { id: 'v-j04-1', sku: 'ELX-JW-EA04-SL', name: 'Platinum Rhodium', stock: 8, price: 16800 },
      { id: 'v-j04-2', sku: 'ELX-JW-EA04-GL', name: '18K Champagne Gold', stock: 4, price: 17200 }
    ],
    rating: 4.7,
    reviewsCount: 31,
    tags: ['Earrings', 'Art Deco', 'Evening', 'Drops'],
    featured: false,
    newArrival: true,
    updatedAt: '2026-09-17T14:15:00Z'
  },
  {
    id: 'prod-j05',
    slug: 'filigree-temple-gold-kada',
    name: 'Carved Filigree Temple Gold Kada (Pair)',
    category: 'jewells',
    collection: 'Royal Heritage',
    shortDescription: 'Pair of screw-lock heavy cuffs embellished with traditional nakshi motifs and cabochon rubies.',
    description: 'Detailed repoussé and granulation artistry rendered in warm golden tones. Flanked by delicate floral vines and centered with flush-set ruby cabochons, equipped with a precision internal screw closure for effortless wear.',
    sellingPrice: 52000,
    originalPrice: 58000,
    discountPercent: 10,
    isSale: false,
    sku: 'ELX-JW-KD05',
    stock: 5,
    lowStockThreshold: 2,
    images: [
      '/assets/products/jewels/jewel-09.jpeg',
      '/assets/products/jewels/jewel-10.jpeg',
      '/assets/products/jewels/jewel-11.jpeg'
    ],
    coverImage: '/assets/products/jewels/jewel-09.jpeg',
    status: 'active',
    jewelleryAttributes: {
      materials: ['Copper & Silver Alloy', '24K Micro Gold Plating', 'Synthetic Rubies'],
      finishes: ['Antique Temple Matt Finish'],
      dimensions: 'Sizes: 2.4, 2.6, 2.8 inner diameter',
      weight: '118 grams (pair)',
      care: 'Store in dry moisture-free boxes. Do not wash with abrasives.'
    },
    variants: [
      { id: 'v-j05-1', sku: 'ELX-JW-KD05-24', name: 'Size 2.4 (Small)', stock: 2, price: 52000 },
      { id: 'v-j05-2', sku: 'ELX-JW-KD05-26', name: 'Size 2.6 (Medium)', stock: 2, price: 52000 },
      { id: 'v-j05-3', sku: 'ELX-JW-KD05-28', name: 'Size 2.8 (Large)', stock: 1, price: 52000 }
    ],
    rating: 4.9,
    reviewsCount: 22,
    tags: ['Bangles', 'Kada', 'Temple Gold', 'Heirloom'],
    featured: true,
    newArrival: false,
    updatedAt: '2026-09-12T11:00:00Z'
  },
  {
    id: 'prod-j06',
    slug: 'celestial-solitaire-cocktail-ring',
    name: 'Celestial Solitaire Cocktail Ring',
    category: 'jewells',
    collection: 'Atelier Modernist',
    shortDescription: 'Statement emerald-cut lab sapphire nestled in asymmetric diamond-pave bands.',
    description: 'A bold, contemporary statement ring designed for modern formal soirees. A vibrant 4-carat equivalent deep blue sapphire rests in a cathedral bezel, embraced by twin floating bands pavé-set with shimmering crystals.',
    sellingPrice: 19500,
    originalPrice: 23000,
    discountPercent: 15,
    isSale: true,
    sku: 'ELX-JW-RG06',
    stock: 9,
    lowStockThreshold: 3,
    images: [
      '/assets/products/jewels/jewel-12.jpeg',
      '/assets/products/jewels/jewel-13.jpeg',
      '/assets/products/jewels/jewel-14.jpeg'
    ],
    coverImage: '/assets/products/jewels/jewel-12.jpeg',
    status: 'active',
    jewelleryAttributes: {
      materials: ['925 Sterling Silver', 'Synthetic Royal Sapphire', 'Cubic Zirconia'],
      finishes: ['White Rhodium Mirror Finish', 'Champagne Gold'],
      dimensions: 'Stone: 12mm x 9mm. Band thickness: 3mm.',
      weight: '11.5 grams',
      care: 'Clean with soft lint-free cloth. Remove before swimming or sports.'
    },
    variants: [
      { id: 'v-j06-1', sku: 'ELX-JW-RG06-52', name: 'Size 12 (52mm)', stock: 3, price: 19500 },
      { id: 'v-j06-2', sku: 'ELX-JW-RG06-54', name: 'Size 14 (54mm)', stock: 4, price: 19500 },
      { id: 'v-j06-3', sku: 'ELX-JW-RG06-56', name: 'Size 16 (56mm)', stock: 2, price: 19500 }
    ],
    rating: 4.8,
    reviewsCount: 16,
    tags: ['Ring', 'Cocktail', 'Sapphire', 'Modernist'],
    featured: false,
    newArrival: true,
    updatedAt: '2026-09-17T16:00:00Z'
  },
  {
    id: 'prod-j07',
    slug: 'jadau-hasli-torque-necklace',
    name: 'Heritage Jadau Hasli Torque Choker',
    category: 'jewells',
    collection: 'Royal Heritage',
    shortDescription: 'Rigid torque neckpiece with intricate kundan flower motifs and baroque pearl drop.',
    description: 'An ancient silhouette reimagined for modern aristocracy. The sculpted curve of the torque rests comfortably against the collarbone, displaying master-level jadau stone setting and a singular baroque pearl pendant at the terminus.',
    sellingPrice: 38000,
    originalPrice: 42000,
    discountPercent: 9,
    isSale: false,
    sku: 'ELX-JW-HS07',
    stock: 4,
    lowStockThreshold: 2,
    images: [
      '/assets/products/jewels/jewel-15.jpeg',
      '/assets/products/jewels/jewel-16.jpeg',
      '/assets/products/jewels/jewel-17.jpeg'
    ],
    coverImage: '/assets/products/jewels/jewel-15.jpeg',
    status: 'active',
    jewelleryAttributes: {
      materials: ['Silver Brass Alloy', '22K Matte Gold Dip', 'Uncut Stones', 'Baroque Pearl'],
      finishes: ['Brushed Matte Gold'],
      dimensions: 'Inner neck opening: 12.5cm, flexible hinged clasp.',
      weight: '98 grams',
      care: 'Store in dry place wrapped in cotton cloth.'
    },
    variants: [
      { id: 'v-j07-1', sku: 'ELX-JW-HS07-GD', name: 'Matte Antique Gold', stock: 4, price: 38000 }
    ],
    rating: 4.9,
    reviewsCount: 20,
    tags: ['Hasli', 'Necklace', 'Heritage', 'Baroque'],
    featured: true,
    newArrival: true,
    updatedAt: '2026-09-13T10:45:00Z'
  },
  {
    id: 'prod-j08',
    slug: 'eternity-tennis-choker-diamonds',
    name: 'Eternity Tennis Choker in White Gold',
    category: 'jewells',
    collection: 'Atelier Modernist',
    shortDescription: 'Seamless continuous strand of individually-set brilliant round simulated diamonds.',
    description: 'A benchmark of understated luxury. Engineered with ultra-flexible links that lay completely flat against the skin with zero twisting, fastened with a concealed double-safety box clasp.',
    sellingPrice: 34500,
    originalPrice: 39000,
    discountPercent: 12,
    isSale: true,
    sku: 'ELX-JW-TC08',
    stock: 7,
    lowStockThreshold: 3,
    images: [
      '/assets/products/jewels/jewel-18.jpeg',
      '/assets/products/jewels/jewel-19.jpeg',
      '/assets/products/jewels/jewel-20.jpeg'
    ],
    coverImage: '/assets/products/jewels/jewel-18.jpeg',
    status: 'active',
    jewelleryAttributes: {
      materials: ['Solid 925 Silver', 'Triple Rhodium Dip', '5A Cubic Zirconia (3mm each)'],
      finishes: ['High Polish Rhodium White Gold'],
      dimensions: 'Length: 38cm + 5cm extension chain',
      weight: '26 grams',
      care: 'Clean with warm water and soft brush. Polish with silver cloth.'
    },
    variants: [
      { id: 'v-j08-1', sku: 'ELX-JW-TC08-WG', name: 'White Rhodium 38cm', stock: 5, price: 34500 },
      { id: 'v-j08-2', sku: 'ELX-JW-TC08-YG', name: 'Champagne Gold 38cm', stock: 2, price: 34500 }
    ],
    rating: 5.0,
    reviewsCount: 45,
    tags: ['Tennis', 'Choker', 'Diamonds', 'Minimalist', 'Bestseller'],
    featured: true,
    newArrival: false,
    updatedAt: '2026-09-11T13:20:00Z'
  },
  {
    id: 'prod-j09',
    slug: 'chandbali-pearl-earrings',
    name: 'Royal Chandbali Drop Earrings',
    category: 'jewells',
    collection: 'Royal Heritage',
    shortDescription: 'Crescent moon statement earrings with seed pearl fringe and ruby centers.',
    description: 'Timeless Mughal poetry in jewellery. A delicate crescent silhouette adorned with floral filigree, suspension bells, and micro-pearl bunches that chime softly with movement.',
    sellingPrice: 18200,
    originalPrice: 21000,
    discountPercent: 13,
    isSale: true,
    sku: 'ELX-JW-CB09',
    stock: 11,
    lowStockThreshold: 4,
    images: [
      '/assets/products/jewels/jewel-21.jpeg',
      '/assets/products/jewels/jewel-22.jpeg',
      '/assets/products/jewels/jewel-23.jpeg'
    ],
    coverImage: '/assets/products/jewels/jewel-21.jpeg',
    status: 'active',
    jewelleryAttributes: {
      materials: ['Brass Alloy', 'Gold Micron Plating', 'Glass Rubies', 'Seed Pearls'],
      finishes: ['Vintage Brushed Gold'],
      dimensions: 'Length: 8.0cm, Width: 4.5cm',
      weight: '34 grams (pair)',
      care: 'Avoid moisture, spray, and direct friction.'
    },
    variants: [
      { id: 'v-j09-1', sku: 'ELX-JW-CB09-PR', name: 'Classic Pearl & Ruby', stock: 8, price: 18200 },
      { id: 'v-j09-2', sku: 'ELX-JW-CB09-EM', name: 'Classic Pearl & Emerald', stock: 3, price: 18200 }
    ],
    rating: 4.9,
    reviewsCount: 27,
    tags: ['Chandbali', 'Earrings', 'Heritage', 'Pearl'],
    featured: false,
    newArrival: true,
    updatedAt: '2026-09-15T15:10:00Z'
  },
  {
    id: 'prod-j10',
    slug: 'sculpted-gold-mesh-collar',
    name: 'Sculpted Woven Gold Mesh Collar',
    category: 'jewells',
    collection: 'Atelier Modernist',
    shortDescription: 'Fluid woven metal mesh neck collar with magnetic clasp.',
    description: 'Crafted with tactile fluidity resembling liquid gold ribbon. Sits flush against the clavicle, delivering a high-fashion runway aesthetic paired with evening tailoring or silk slip dresses.',
    sellingPrice: 29800,
    originalPrice: 35000,
    discountPercent: 15,
    isSale: true,
    sku: 'ELX-JW-MC10',
    stock: 6,
    lowStockThreshold: 2,
    images: [
      '/assets/products/jewels/jewel-24.jpeg',
      '/assets/products/jewels/jewel-25.jpeg',
      '/assets/products/jewels/jewel-26.jpeg'
    ],
    coverImage: '/assets/products/jewels/jewel-24.jpeg',
    status: 'active',
    jewelleryAttributes: {
      materials: ['Stainless Steel & Silver Mesh', '18K Yellow Gold Micron Plating'],
      finishes: ['Silken Gold Sheen'],
      dimensions: 'Circumference: 40cm, Width: 1.8cm',
      weight: '64 grams',
      care: 'Roll gently when storing; do not fold or crimp.'
    },
    variants: [
      { id: 'v-j10-1', sku: 'ELX-JW-MC10-GD', name: '18K Yellow Gold', stock: 4, price: 29800 },
      { id: 'v-j10-2', sku: 'ELX-JW-MC10-SL', name: 'Sterling Silver Mesh', stock: 2, price: 28500 }
    ],
    rating: 4.8,
    reviewsCount: 12,
    tags: ['Collar', 'Mesh', 'Runway', 'Modernist'],
    featured: true,
    newArrival: true,
    updatedAt: '2026-09-14T17:00:00Z'
  },

  // --- CLOTHING (Editorial Fashion Line) ---
  {
    id: 'prod-c01',
    slug: 'noir-double-breasted-silk-blazer',
    name: 'Noir Silk & Wool Structured Blazer',
    category: 'clothing',
    collection: 'Atelier Modernist',
    shortDescription: 'Precision-tailored double-breasted jacket with sculpted shoulders and silk satin lapels.',
    description: 'An architectural silhouette cut from Italian wool crepe with pure silk faille peaked lapels. Tailored with internal canvas construction, horn button closures, and functional surgeon cuffs. Designed to effortlessly transition from boardroom to black-tie gala.',
    sellingPrice: 38500,
    originalPrice: 45000,
    discountPercent: 14,
    isSale: true,
    sku: 'ELX-CL-BL01',
    stock: 14,
    lowStockThreshold: 4,
    images: [
      '/assets/products/clothing/clothing-01.jpg',
      '/assets/products/clothing/clothing-02.jpg',
      '/assets/products/clothing/01.png'
    ],
    coverImage: '/assets/products/clothing/clothing-01.jpg',
    status: 'active',
    clothingAttributes: {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colours: ['Noir Black', 'Ivory Cream'],
      fabric: '70% Fine Virgin Wool, 30% Mulberry Silk Crepe. 100% Cupro Lining.',
      fit: 'Structured tailored fit. Fits true to size with sculpted shoulders.'
    },
    variants: [
      { id: 'v-c01-xs', sku: 'ELX-CL-BL01-XS', name: 'XS / Noir Black', stock: 2, price: 38500 },
      { id: 'v-c01-s', sku: 'ELX-CL-BL01-S', name: 'S / Noir Black', stock: 4, price: 38500 },
      { id: 'v-c01-m', sku: 'ELX-CL-BL01-M', name: 'M / Noir Black', stock: 5, price: 38500 },
      { id: 'v-c01-l', sku: 'ELX-CL-BL01-L', name: 'L / Noir Black', stock: 2, price: 38500 },
      { id: 'v-c01-xl', sku: 'ELX-CL-BL01-XL', name: 'XL / Noir Black', stock: 1, price: 38500 }
    ],
    rating: 4.9,
    reviewsCount: 38,
    tags: ['Blazer', 'Tailoring', 'Silk', 'Formal', 'Bestseller'],
    featured: true,
    newArrival: true,
    updatedAt: '2026-09-17T08:00:00Z'
  },
  {
    id: 'prod-c02',
    slug: 'champagne-draped-silk-evening-gown',
    name: 'Champagne Draped Bias-Cut Silk Gown',
    category: 'clothing',
    collection: 'Nocturne Evening',
    shortDescription: 'Floor-length bias-cut pure silk satin gown with cascading cowled back.',
    description: 'The epitome of liquid sensuality. Cut on the true bias from heavyweight 32-momme pure silk charmeuse, this silhouette gently skims the curves of the body. Finished with a dramatic plunging cowl back and a soft sweeping train.',
    sellingPrice: 54000,
    originalPrice: 62000,
    discountPercent: 13,
    isSale: false,
    sku: 'ELX-CL-GW02',
    stock: 7,
    lowStockThreshold: 3,
    images: [
      '/assets/products/clothing/clothing-03.jpg',
      '/assets/products/clothing/clothing-04.jpg',
      '/assets/editorial/the-edit.jpg'
    ],
    coverImage: '/assets/products/clothing/clothing-03.jpg',
    status: 'active',
    clothingAttributes: {
      sizes: ['XS', 'S', 'M', 'L'],
      colours: ['Champagne Gold', 'Midnight Emerald'],
      fabric: '100% Mulberry Silk Charmeuse (32 momme)',
      fit: 'Bias-cut drape. Fluid silhouette with natural waist accentuation.'
    },
    variants: [
      { id: 'v-c02-xs', sku: 'ELX-CL-GW02-XS', name: 'XS / Champagne Gold', stock: 2, price: 54000 },
      { id: 'v-c02-s', sku: 'ELX-CL-GW02-S', name: 'S / Champagne Gold', stock: 3, price: 54000 },
      { id: 'v-c02-m', sku: 'ELX-CL-GW02-M', name: 'M / Champagne Gold', stock: 2, price: 54000 }
    ],
    rating: 5.0,
    reviewsCount: 24,
    tags: ['Gown', 'Evening', 'Mulberry Silk', 'Red Carpet'],
    featured: true,
    newArrival: true,
    updatedAt: '2026-09-16T14:30:00Z'
  },
  {
    id: 'prod-c03',
    slug: 'banarasi-tissue-organza-saree',
    name: 'Handwoven Banarasi Tissue Organza Saree',
    category: 'clothing',
    collection: 'Royal Heritage',
    shortDescription: 'Metallic gold tissue saree woven with antique silver zari kadwa booties.',
    description: 'An ethereal confluence of heritage weaves. Master artisans in Varanasi spent over 180 hours handcrafting this tissue organza drape, creating featherlight luminescence interwoven with genuine tested metallic threads. Comes with unstitched brocade blouse fabric.',
    sellingPrice: 48000,
    originalPrice: 55000,
    discountPercent: 12,
    isSale: true,
    sku: 'ELX-CL-SR03',
    stock: 5,
    lowStockThreshold: 2,
    images: [
      '/assets/products/clothing/clothing-05.jpg',
      '/assets/products/clothing/clothing-06.jpg',
      '/assets/editorial/clothing-banner.jpg'
    ],
    coverImage: '/assets/products/clothing/clothing-05.jpg',
    status: 'active',
    clothingAttributes: {
      sizes: ['Free Size'],
      colours: ['Muted Gold', 'Rose Quartz'],
      fabric: 'Pure Silk & Tested Metallic Tissue Zari',
      fit: '5.5 metres saree length + 0.8 metre matching unstitched blouse fabric.'
    },
    variants: [
      { id: 'v-c03-gd', sku: 'ELX-CL-SR03-GD', name: 'Muted Gold', stock: 3, price: 48000 },
      { id: 'v-c03-rq', sku: 'ELX-CL-SR03-RQ', name: 'Rose Quartz', stock: 2, price: 48000 }
    ],
    rating: 4.9,
    reviewsCount: 17,
    tags: ['Saree', 'Handwoven', 'Banarasi', 'Tissue', 'Heritage'],
    featured: true,
    newArrival: false,
    updatedAt: '2026-09-13T09:00:00Z'
  },
  {
    id: 'prod-c04',
    slug: 'linen-relaxed-resort-trouser-suit',
    name: 'Italian Flax Linen Relaxed Trouser Suit',
    category: 'clothing',
    collection: 'Summer Solstice',
    shortDescription: 'Unstructured two-piece suit crafted from pure Belgian flax linen in oat beige.',
    description: 'Effortless Mediterranean refinement for warm-weather coastal escapes. Unlined and deconstructed for breathable drape, featuring pleated wide-leg trousers and a relaxed notch-lapel jacket with tortoiseshell buttons.',
    sellingPrice: 26500,
    originalPrice: 31000,
    discountPercent: 15,
    isSale: true,
    sku: 'ELX-CL-LN04',
    stock: 10,
    lowStockThreshold: 3,
    images: [
      '/assets/products/clothing/clothing-07.jpg',
      '/assets/products/clothing/clothing-08.jpg',
      '/assets/editorial/story.jpg'
    ],
    coverImage: '/assets/products/clothing/clothing-07.jpg',
    status: 'active',
    clothingAttributes: {
      sizes: ['S', 'M', 'L', 'XL'],
      colours: ['Oat Beige', 'Olive Drab'],
      fabric: '100% Certified Belgian Flax Linen',
      fit: 'Relaxed loose fit. Trousers feature elasticated back waistband.'
    },
    variants: [
      { id: 'v-c04-s', sku: 'ELX-CL-LN04-S', name: 'S / Oat Beige', stock: 3, price: 26500 },
      { id: 'v-c04-m', sku: 'ELX-CL-LN04-M', name: 'M / Oat Beige', stock: 4, price: 26500 },
      { id: 'v-c04-l', sku: 'ELX-CL-LN04-L', name: 'L / Oat Beige', stock: 3, price: 26500 }
    ],
    rating: 4.7,
    reviewsCount: 15,
    tags: ['Linen', 'Resort', 'Suit', 'Summer'],
    featured: false,
    newArrival: true,
    updatedAt: '2026-09-17T11:20:00Z'
  }
];
