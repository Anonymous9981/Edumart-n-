export type ProductAudience = 'student' | 'school';

export interface MockProduct {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  description: string;
  vendor?: string;
  category: string;
  subcategory?: string;
  audience: ProductAudience;
  gradeBand: string;
  price: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: string;
  featured?: boolean;
}

export interface MockOffer {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
}

export interface MockCompany {
  name: string;
  tagline: string;
  about: string;
  supportEmail: string;
  supportPhone: string;
  trustBadges: string[];
}

export interface MockUser {
  name: string;
  email: string;
  school: string;
  city: string;
}

export const mockProducts: MockProduct[] = [
  {
    id: 'bk-math-7',
    name: 'Class 7 Mathematics Set',
    subtitle: 'NCERT aligned with workbook',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
    description: 'Complete class kit with textbook, workbook, and weekly practice sheets for guided revision.',
    category: 'Books',
    audience: 'student',
    gradeBand: 'Class 7',
    price: 899,
    discountPercent: 12,
    rating: 4.8,
    reviewCount: 412,
    stock: 34,
    badge: 'Best Seller',
  },
  {
    id: 'bk-sci-8',
    name: 'Class 8 Science Lab Notes',
    subtitle: 'Practical-ready diagrams',
    image: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&w=900&q=80',
    description: 'Concept summaries and lab-ready templates designed for school practical workflows.',
    category: 'Books',
    audience: 'student',
    gradeBand: 'Class 8',
    price: 649,
    discountPercent: 10,
    rating: 4.7,
    reviewCount: 259,
    stock: 21,
  },
  {
    id: 'st-prem-kit',
    name: 'Premium Stationery Combo',
    subtitle: 'Notebooks, pens, geometry tools',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    description: 'Premium writing and geometry kit tailored for middle school and board exam preparation.',
    category: 'Stationery',
    audience: 'student',
    gradeBand: 'Class 6-10',
    price: 1199,
    discountPercent: 18,
    rating: 4.6,
    reviewCount: 198,
    stock: 50,
    badge: 'Value Pack',
  },
  {
    id: 'st-art-pack',
    name: 'Creative Art Pack',
    subtitle: 'Color pencils and sketch set',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
    description: 'Curated art essentials for drawing, shading, and project-based classroom activities.',
    category: 'Stationery',
    audience: 'student',
    gradeBand: 'Class 3-9',
    price: 799,
    discountPercent: 14,
    rating: 4.5,
    reviewCount: 152,
    stock: 42,
  },
  {
    id: 'tech-lamp',
    name: 'Smart Study Lamp',
    subtitle: 'Eye-care LED with timer',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80',
    description: 'Adjustable brightness with low blue-light mode and auto timer for focused sessions.',
    category: 'Tech',
    audience: 'student',
    gradeBand: 'All grades',
    price: 1499,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 533,
    stock: 18,
    badge: 'Prime Pick',
  },
  {
    id: 'tech-tab-10',
    name: 'EduTab 10.1',
    subtitle: 'Student tablet with parental controls',
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80',
    description: 'Classroom-ready tablet with safe browsing, assignment dashboard, and long battery.',
    category: 'Tech',
    audience: 'student',
    gradeBand: 'Class 5-12',
    price: 16999,
    discountPercent: 8,
    rating: 4.4,
    reviewCount: 88,
    stock: 9,
  },
  {
    id: 'fur-chair-ergo',
    name: 'Ergo Student Chair',
    subtitle: 'Posture support design',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    description: 'Compact ergonomic chair for study corners and school reading spaces.',
    category: 'Furniture',
    audience: 'school',
    gradeBand: 'All grades',
    price: 3299,
    discountPercent: 16,
    rating: 4.5,
    reviewCount: 73,
    stock: 27,
  },
  {
    id: 'fur-desk-fold',
    name: 'Foldable Study Desk',
    subtitle: 'Space-saving home setup',
    image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=900&q=80',
    description: 'Durable foldable desk with cable slot and anti-slip leg support.',
    category: 'Furniture',
    audience: 'school',
    gradeBand: 'All grades',
    price: 5499,
    discountPercent: 11,
    rating: 4.6,
    reviewCount: 64,
    stock: 16,
  },
  {
    id: 'uni-summer-boy',
    name: 'Summer Uniform Set (Boys)',
    subtitle: 'Breathable cotton blend',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    description: 'School-compliant uniform set with stitched shirt and trousers.',
    category: 'Uniform',
    audience: 'student',
    gradeBand: 'Class 1-10',
    price: 1399,
    discountPercent: 9,
    rating: 4.3,
    reviewCount: 140,
    stock: 36,
  },
  {
    id: 'uni-summer-girl',
    name: 'Summer Uniform Set (Girls)',
    subtitle: 'Comfort fit with size range',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
    description: 'School-approved uniform set designed for everyday comfort.',
    category: 'Uniform',
    audience: 'student',
    gradeBand: 'Class 1-10',
    price: 1429,
    discountPercent: 9,
    rating: 4.4,
    reviewCount: 128,
    stock: 39,
  },
  {
    id: 'tech-headset',
    name: 'Online Class Headset',
    subtitle: 'Noise-reducing mic',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    description: 'Clear audio headset with soft earcups and detachable mic for class calls.',
    category: 'Tech',
    audience: 'student',
    gradeBand: 'Class 4-12',
    price: 1899,
    discountPercent: 22,
    rating: 4.7,
    reviewCount: 241,
    stock: 30,
  },
  {
    id: 'bk-english-10',
    name: 'Class 10 English Booster',
    subtitle: 'Board-focused sample papers',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    description: 'Board prep guide with solved papers and chapter-wise writing templates.',
    category: 'Books',
    audience: 'student',
    gradeBand: 'Class 10',
    price: 699,
    discountPercent: 15,
    rating: 4.8,
    reviewCount: 309,
    stock: 55,
  },
];

export const mockOffers: MockOffer[] = [
  {
    id: 'offer-prime',
    title: 'EduMart Prime',
    subtitle: '4 free deliveries, early sale access, priority support.',
    cta: 'Explore Prime',
  },
  {
    id: 'offer-refer',
    title: 'Refer and Earn',
    subtitle: 'Get INR 100 wallet credit for each successful referral above INR 499.',
    cta: 'Start Referring',
  },
  {
    id: 'offer-bundle',
    title: 'School Bundle Weeks',
    subtitle: 'Up to 20% off on class-wise book + stationery bundle kits.',
    cta: 'View Bundles',
  },
];

export const mockUser: MockUser = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@edumart.app',
  school: 'Sunrise Public School',
  city: 'Lucknow',
};

export const mockCompany: MockCompany = {
  name: 'EduMart',
  tagline: 'A trusted marketplace built for students, schools and vendors',
  about:
    'EduMart combines verified supply, school-focused curation, and fast delivery so institutions and families can buy with confidence.',
  supportEmail: 'info@edu-mart.com',
  supportPhone: '+91 90000 00000',
  trustBadges: ['Verified Vendors', 'Fast Delivery', 'Secure Checkout', 'School Bulk Support'],
};

export const mockAboutPoints = [
  'Verified vendor onboarding',
  'School and class-based catalog mapping',
  'Auto-applied percentage and fixed discounts',
  'Fast dispatch and order tracking',
  'Post-delivery support for institutions and families',
];

export const productCategories: string[] = ['All', ...Array.from(new Set(mockProducts.map((product) => product.category)))];
