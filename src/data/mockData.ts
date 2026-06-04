export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  image: string;
  thumbnails: string[];
}

export interface ProductSize {
  id: string;
  name: string;
  stock: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ExtendedProductData {
  colors: ProductColor[];
  sizes: ProductSize[];
  originalPrice: number;
  specs: ProductSpec[];
  features: string[];
  badge?: string; // e.g. "New Arrival", "Best Seller"
}

// Hardcoded mock data to extend FakeStoreAPI's product
export const mockExtendedData: ExtendedProductData = {
  originalPrice: 159.99,
  badge: 'Best Seller',
  features: [
    'Water-resistant G-1000 HeavyDuty Eco shell',
    'Padded 15" laptop sleeve with internal organizer',
    'Ergonomic Air Mesh back panel for ventilation',
    'Quick-access top pocket with key fob',
    'Side compression straps for load stabilization',
    'Reinforced bottom panel for extra durability',
  ],
  specs: [
    { label: 'Category',       value: "Men's Backpacks" },
    { label: 'Volume',         value: '16 Litres' },
    { label: 'Weight',         value: '1.2 lbs / 0.54 kg' },
    { label: 'Material',       value: 'G-1000 HeavyDuty Eco (65% polyester, 35% cotton)' },
    { label: 'Dimensions',     value: '15" × 10.6" × 5.1" (H × W × D)' },
    { label: 'Laptop Sleeve',  value: 'Up to 15" laptops' },
    { label: 'Water Resistant',value: 'Yes - hydrostatic head 400 mm' },
    { label: 'Origin',         value: 'Sweden' },
  ],
  colors: [
    {
      id: 'c-navy',
      name: 'Navy Blue',
      hex: '#1e3a8a',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      thumbnails: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
      ],
    },
    {
      id: 'c-olive',
      name: 'Olive Green',
      hex: '#4d7c0f',
      image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
      thumbnails: [
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
        'https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      ],
    },
    {
      id: 'c-charcoal',
      name: 'Charcoal',
      hex: '#374151',
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
      thumbnails: [
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80',
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
      ],
    },
    {
      id: 'c-rust',
      name: 'Rust Orange',
      hex: '#c2410c',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      thumbnails: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
      ],
    },
  ],
  sizes: [
    { id: 's-xs', name: 'XS', stock: 8 },
    { id: 's-s',  name: 'S',  stock: 14 },
    { id: 's-m',  name: 'M',  stock: 3 },  // low stock
    { id: 's-l',  name: 'L',  stock: 0 },  // sold out
    { id: 's-xl', name: 'XL', stock: 7 },
    { id: 's-xxl',name: 'XXL',stock: 2 },  // low stock
  ],
};
