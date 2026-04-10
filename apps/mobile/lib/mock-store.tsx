import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { mockAboutPoints, mockCompany, mockOffers, mockProducts, mockUser, productCategories } from './mock-data';
import { fetchWebsiteMobileContent } from './web-content';

type AudienceFilter = 'all' | 'student' | 'school';
type ProductCategory = Exclude<(typeof productCategories)[number], 'All'>;

interface MockStoreValue {
  products: typeof mockProducts;
  offers: typeof mockOffers;
  user: typeof mockUser;
  categories: typeof productCategories;
  audienceFilter: AudienceFilter;
  setAudienceFilter: (value: AudienceFilter) => void;
  company: typeof mockCompany;
  aboutPoints: string[];
  contentSource: 'website' | 'fallback';
  lastSyncedAt: string | null;
  wishlistIds: string[];
  cart: Record<string, number>;
  wishlistCount: number;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  toggleWishlist: (id: string) => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  decrementFromCart: (id: string) => void;
  clearCart: () => void;
}

const MockStoreContext = createContext<MockStoreValue | null>(null);

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState(mockProducts);
  const [offers, setOffers] = useState(mockOffers);
  const [categories, setCategories] = useState(productCategories);
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>('all');
  const [company, setCompany] = useState(mockCompany);
  const [aboutPoints, setAboutPoints] = useState<string[]>(mockAboutPoints);
  const [contentSource, setContentSource] = useState<'website' | 'fallback'>('fallback');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['tech-lamp', 'bk-math-7']);
  const [cart, setCart] = useState<Record<string, number>>({
    'bk-english-10': 1,
    'st-prem-kit': 1,
    'tech-headset': 1,
  });

  const cartMetrics = useMemo(() => {
    let subtotal = 0;
    let discount = 0;
    let count = 0;

    for (const [productId, qty] of Object.entries(cart)) {
      const product = products.find((item) => item.id === productId);
      if (!product || qty <= 0) {
        continue;
      }

      const linePrice = product.price * qty;
      const lineDiscount = Math.round((linePrice * product.discountPercent) / 100);
      subtotal += linePrice;
      discount += lineDiscount;
      count += qty;
    }

    return {
      cartCount: count,
      cartSubtotal: subtotal,
      cartDiscount: discount,
      cartTotal: subtotal - discount,
    };
  }, [cart, products]);

  useEffect(() => {
    let isMounted = true;

    async function loadWebsiteContent() {
      const remoteContent = await fetchWebsiteMobileContent();

      if (!isMounted || !remoteContent) {
        return;
      }

      const mappedProducts = remoteContent.products.map((product) => ({
        id: product.id,
        name: product.title,
        subtitle: `${product.vendor} • ${product.category}`,
        image: product.image,
        description: product.description,
        category: resolveCategory(product.category),
        audience: (product.audience === 'teacher' ? 'school' : 'student') as 'student' | 'school',
        gradeBand: product.schoolClasses?.length ? `Class ${product.schoolClasses.join(', ')}` : product.audience === 'teacher' ? 'School Solutions' : 'Student Picks',
        price: Math.max(product.price, product.finalPrice),
        discountPercent: product.discountPercentage,
        rating: product.rating || 4.5,
        reviewCount: product.reviews || 0,
        stock: Math.max(8, Math.min(99, product.reviews || 20)),
        badge: product.featured ? 'Featured' : undefined,
      }));

      const mappedOffers = remoteContent.offers.map((offer) => ({
        id: offer.id,
        title: offer.title,
        subtitle: offer.subtitle,
        cta: offer.cta,
      }));

      const mappedCategories = buildCategories(mappedProducts);

      setProducts(mappedProducts.length ? mappedProducts : mockProducts);
      setOffers(mappedOffers.length ? mappedOffers : mockOffers);
      setCategories(mappedCategories.length ? mappedCategories : productCategories);
      if (remoteContent.company) {
        setCompany({
          name: remoteContent.company.name,
          tagline: remoteContent.company.tagline,
          about: remoteContent.company.about,
          supportEmail: remoteContent.company.supportEmail,
          supportPhone: remoteContent.company.supportPhone,
          trustBadges: remoteContent.company.trustBadges,
        });
      }
      if (remoteContent.aboutPoints?.length) {
        setAboutPoints(remoteContent.aboutPoints);
      }
      setContentSource('website');
      setLastSyncedAt(remoteContent.updatedAt || new Date().toISOString());
    }

    void loadWebsiteContent();

    return () => {
      isMounted = false;
    };
  }, []);

  function toggleWishlist(id: string) {
    setWishlistIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function addToCart(id: string) {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  }

  function decrementFromCart(id: string) {
    setCart((current) => {
      const qty = current[id] ?? 0;
      if (qty <= 1) {
        const { [id]: _, ...rest } = current;
        return rest;
      }
      return { ...current, [id]: qty - 1 };
    });
  }

  function removeFromCart(id: string) {
    setCart((current) => {
      const { [id]: _, ...rest } = current;
      return rest;
    });
  }

  function clearCart() {
    setCart({});
  }

  const value = useMemo<MockStoreValue>(
    () => ({
      products,
      offers,
      user: mockUser,
      categories,
      audienceFilter,
      setAudienceFilter,
      company,
      aboutPoints,
      contentSource,
      lastSyncedAt,
      wishlistIds,
      cart,
      wishlistCount: wishlistIds.length,
      toggleWishlist,
      addToCart,
      removeFromCart,
      decrementFromCart,
      clearCart,
      ...cartMetrics,
    }),
    [products, offers, categories, audienceFilter, company, aboutPoints, contentSource, lastSyncedAt, wishlistIds, cart, cartMetrics],
  );

  return <MockStoreContext.Provider value={value}>{children}</MockStoreContext.Provider>;
}

const supportedCategoryMap: Record<string, (typeof productCategories)[number]> = {
  books: 'Books',
  workbook: 'Books',
  reading: 'Books',
  stationery: 'Stationery',
  craft: 'Stationery',
  classroom: 'Furniture',
  furniture: 'Furniture',
  infrastructure: 'Furniture',
  tech: 'Tech',
  coding: 'Tech',
  tablet: 'Tech',
  bag: 'Uniform',
  uniform: 'Uniform',
};

function resolveCategory(categoryName: string): ProductCategory {
  const key = categoryName.toLowerCase();
  const hit = Object.entries(supportedCategoryMap).find(([token]) => key.includes(token));
  return (hit?.[1] ?? 'Books') as ProductCategory;
}

function buildCategories(products: Array<{ category: (typeof productCategories)[number] }>) {
  const unique = Array.from(new Set(products.map((product) => product.category)));
  return ['All', ...unique] as typeof productCategories;
}

export function useMockStore() {
  const context = useContext(MockStoreContext);
  if (!context) {
    throw new Error('useMockStore must be used inside MockStoreProvider');
  }
  return context;
}
