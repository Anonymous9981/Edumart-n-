import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import { mockOffers, mockProducts, mockUser, productCategories } from './mock-data';

interface MockStoreValue {
  products: typeof mockProducts;
  offers: typeof mockOffers;
  user: typeof mockUser;
  categories: typeof productCategories;
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
      const product = mockProducts.find((item) => item.id === productId);
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
  }, [cart]);

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
      products: mockProducts,
      offers: mockOffers,
      user: mockUser,
      categories: productCategories,
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
    [wishlistIds, cart, cartMetrics],
  );

  return <MockStoreContext.Provider value={value}>{children}</MockStoreContext.Provider>;
}

export function useMockStore() {
  const context = useContext(MockStoreContext);
  if (!context) {
    throw new Error('useMockStore must be used inside MockStoreProvider');
  }
  return context;
}
