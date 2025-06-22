export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  // Storage & Organization
  {
    id: 'p1',
    name: 'Bamboo Storage Boxes Set',
    description: 'Sustainable bamboo storage boxes for organizing small items',
    price: 45,
    category: 'Storage',
    image: 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg',
    features: ['Eco-friendly bamboo', 'Set of 3 sizes', 'Stackable design', 'Natural finish'],
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'p2',
    name: 'Minimalist Drawer Organizers',
    description: 'Clean-lined drawer organizers for kitchen and office',
    price: 32,
    category: 'Storage',
    image: 'https://images.pexels.com/photos/6489664/pexels-photo-6489664.jpeg',
    features: ['Modular design', 'Non-slip base', 'Easy to clean', 'Multiple configurations'],
    inStock: true,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 'p3',
    name: 'Glass Storage Containers',
    description: 'Airtight glass containers for pantry organization',
    price: 68,
    category: 'Kitchen',
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
    features: ['Borosilicate glass', 'Airtight seals', 'Stackable', 'Dishwasher safe'],
    inStock: true,
    rating: 4.9,
    reviews: 203
  },

  // Wardrobe Essentials
  {
    id: 'p4',
    name: 'Capsule Wardrobe Planner',
    description: 'Digital guide to building your perfect capsule wardrobe',
    price: 29,
    category: 'Wardrobe',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    features: ['Step-by-step guide', 'Color palette tool', 'Mix & match charts', 'Seasonal planning'],
    inStock: true,
    rating: 4.7,
    reviews: 156
  },
  {
    id: 'p5',
    name: 'Wooden Hangers Set',
    description: 'Premium wooden hangers for a cohesive closet look',
    price: 54,
    category: 'Wardrobe',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    features: ['Solid wood construction', 'Non-slip bar', 'Set of 20', 'Space-saving design'],
    inStock: true,
    rating: 4.5,
    reviews: 78
  },
  {
    id: 'p6',
    name: 'Minimalist Jewelry Box',
    description: 'Clean-lined jewelry storage with compartments',
    price: 89,
    category: 'Wardrobe',
    image: 'https://images.pexels.com/photos/1927574/pexels-photo-1927574.jpeg',
    features: ['Velvet-lined compartments', 'Mirror inside lid', 'Compact design', 'Lock included'],
    inStock: true,
    rating: 4.8,
    reviews: 92
  },

  // Kitchen Tools
  {
    id: 'p7',
    name: 'Essential Chef\'s Knife',
    description: 'High-quality chef\'s knife for all your cooking needs',
    price: 125,
    category: 'Kitchen',
    image: 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg',
    features: ['High-carbon steel', 'Ergonomic handle', 'Professional grade', 'Lifetime sharpening'],
    inStock: true,
    rating: 4.9,
    reviews: 267
  },
  {
    id: 'p8',
    name: 'Cast Iron Skillet',
    description: 'Versatile cast iron pan that lasts generations',
    price: 78,
    category: 'Kitchen',
    image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg',
    features: ['Pre-seasoned', 'Oven safe to 500°F', 'Improves with use', 'Multi-functional'],
    inStock: true,
    rating: 4.8,
    reviews: 189
  },
  {
    id: 'p9',
    name: 'Minimalist Cutting Board',
    description: 'Beautiful bamboo cutting board with clean lines',
    price: 42,
    category: 'Kitchen',
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
    features: ['Sustainable bamboo', 'Knife-friendly surface', 'Easy maintenance', 'Compact storage'],
    inStock: true,
    rating: 4.6,
    reviews: 134
  },

  // Digital Organization
  {
    id: 'p10',
    name: 'Digital Declutter Course',
    description: 'Complete course on organizing your digital life',
    price: 97,
    category: 'Digital',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
    features: ['6-week program', 'Email templates', 'File organization system', 'Lifetime access'],
    inStock: true,
    rating: 4.9,
    reviews: 312
  },
  {
    id: 'p11',
    name: 'Cable Management Kit',
    description: 'Clean up your workspace with organized cables',
    price: 24,
    category: 'Digital',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
    features: ['Multiple organizers', 'Adhesive mounts', 'Various sizes', 'Reusable'],
    inStock: true,
    rating: 4.4,
    reviews: 67
  },

  // Home Essentials
  {
    id: 'p12',
    name: 'Minimalist Desk Lamp',
    description: 'Clean-lined LED desk lamp with adjustable brightness',
    price: 89,
    category: 'Home',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    features: ['LED technology', 'Adjustable brightness', 'USB charging port', 'Modern design'],
    inStock: true,
    rating: 4.7,
    reviews: 145
  },
  {
    id: 'p13',
    name: 'Natural Cleaning Kit',
    description: 'Eco-friendly cleaning supplies for the whole home',
    price: 56,
    category: 'Home',
    image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg',
    features: ['Plant-based ingredients', 'Multi-surface cleaner', 'Refillable bottles', 'Non-toxic'],
    inStock: true,
    rating: 4.6,
    reviews: 98
  },
  {
    id: 'p14',
    name: 'Minimalist Wall Hooks',
    description: 'Simple, functional wall hooks for entryway organization',
    price: 28,
    category: 'Home',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    features: ['Solid wood construction', 'Easy installation', 'Set of 4', 'Weight capacity 10lbs each'],
    inStock: true,
    rating: 4.5,
    reviews: 76
  },

  // Books & Guides
  {
    id: 'p15',
    name: 'The Minimalist Home Guide',
    description: 'Comprehensive guide to creating a minimalist living space',
    price: 34,
    category: 'Books',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    features: ['200+ pages', 'Room-by-room guide', 'Before/after photos', 'Maintenance tips'],
    inStock: true,
    rating: 4.8,
    reviews: 234
  },
  {
    id: 'p16',
    name: 'Minimalist Mindset Journal',
    description: 'Guided journal for developing minimalist thinking',
    price: 26,
    category: 'Books',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    features: ['Daily prompts', 'Progress tracking', 'Reflection exercises', 'Premium paper'],
    inStock: true,
    rating: 4.7,
    reviews: 167
  },

  // Travel & Mobility
  {
    id: 'p17',
    name: 'Minimalist Travel Backpack',
    description: 'Versatile backpack designed for minimalist travelers',
    price: 145,
    category: 'Travel',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    features: ['35L capacity', 'Laptop compartment', 'Water-resistant', 'Lifetime warranty'],
    inStock: true,
    rating: 4.9,
    reviews: 189
  },
  {
    id: 'p18',
    name: 'Packing Cubes Set',
    description: 'Organize your luggage with compression packing cubes',
    price: 39,
    category: 'Travel',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    features: ['Set of 4 sizes', 'Compression zippers', 'Mesh panels', 'Lightweight'],
    inStock: true,
    rating: 4.6,
    reviews: 123
  },

  // Wellness & Self-Care
  {
    id: 'p19',
    name: 'Essential Oil Diffuser',
    description: 'Minimalist ultrasonic diffuser for aromatherapy',
    price: 67,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    features: ['Ultrasonic technology', 'Timer settings', 'Auto shut-off', 'Whisper quiet'],
    inStock: true,
    rating: 4.5,
    reviews: 156
  },
  {
    id: 'p20',
    name: 'Minimalist Skincare Set',
    description: 'Simple, effective skincare routine in 3 steps',
    price: 89,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    features: ['Cleanser, moisturizer, SPF', 'Natural ingredients', 'All skin types', '30-day supply'],
    inStock: true,
    rating: 4.7,
    reviews: 198
  }
];

export const categories = [
  'Storage', 'Kitchen', 'Wardrobe', 'Digital', 'Home', 
  'Books', 'Travel', 'Wellness', 'Office', 'Cleaning'
];