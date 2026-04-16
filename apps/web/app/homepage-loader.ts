import type { HomepageData, HomepageProduct } from '../lib/homepage-types'
import { buildHomepageProducts } from '../lib/supabase/public-catalog'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'

export const FALLBACK_PRODUCTS: HomepageProduct[] = [
  {
    id: 'mock-1',
    slug: 'math-notebook-200-pages',
    title: 'Math Notebook 200 Pages',
    vendor: 'Karom Stationery',
    category: 'Stationery',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    reviews: 42,
    price: 120,
    finalPrice: 100,
    discountPercentage: 17,
    description: 'Quality math notebook for students with smooth writing pages',
    featured: true,
  },
  {
    id: 'mock-2',
    slug: 'science-textbook-class-10',
    title: 'Science Textbook Class 10',
    vendor: 'Educational Books Co',
    category: 'Books',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 156,
    price: 450,
    finalPrice: 380,
    discountPercentage: 16,
    description: 'Comprehensive science textbook with diagrams and experiments',
    featured: true,
  },
  {
    id: 'mock-3',
    slug: 'school-uniform-shirt',
    title: 'School Uniform Shirt',
    vendor: 'EduFit Uniforms',
    category: 'Uniforms',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
    rating: 4.3,
    reviews: 89,
    price: 450,
    finalPrice: 350,
    discountPercentage: 22,
    description: 'Comfortable cotton school uniform shirt',
    featured: false,
  },
  {
    id: 'mock-4',
    slug: 'school-bag-comfort',
    title: 'School Bag with Comfort Padding',
    vendor: 'BagWorks India',
    category: 'Bags',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviews: 203,
    price: 1200,
    finalPrice: 950,
    discountPercentage: 21,
    description: 'Durable school bag with ergonomic padding',
    featured: true,
  },
  {
    id: 'mock-5',
    slug: 'english-grammar-guide',
    title: 'English Grammar Reference Guide',
    vendor: 'Language Masters',
    category: 'Books',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 67,
    price: 280,
    finalPrice: 220,
    discountPercentage: 21,
    description: 'Complete English grammar reference with examples',
    featured: false,
  },
  {
    id: 'mock-6',
    slug: 'geometry-compass-set',
    title: 'Geometry Compass Set',
    vendor: 'Precision Tools',
    category: 'Stationery',
    audience: 'student',
    image: 'https://images.unsplash.com/photo-1516979187457-635ffe35ff81?auto=format&fit=crop&w=400&q=80',
    rating: 4.4,
    reviews: 34,
    price: 180,
    finalPrice: 140,
    discountPercentage: 22,
    description: 'Complete geometry and drawing instrument set',
    featured: false,
  },
]

export async function getHomepageData(options?: { take?: number }): Promise<HomepageData> {
  const take = options?.take ?? 24

  try {
    const products = await buildHomepageProducts(take)

    if (products.length) {
      return { products }
    }

    return {
      products: FALLBACK_PRODUCTS,
    }
  } catch {
    return { products: FALLBACK_PRODUCTS }
  }
}
