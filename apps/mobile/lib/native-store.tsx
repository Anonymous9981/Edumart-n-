import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { mockProducts } from './mock-data';
import { fetchWebsiteMobileContent } from './web-content';

const CART_STORAGE_KEY = 'edumart-native-cart';
const WISHLIST_STORAGE_KEY = 'edumart-native-wishlist';

type CartState = Record<string, number>;

export interface NativeProduct {
  id: string;
  title: string;
  slug: string;
  vendor: string;
  category: string;
  audience: 'student' | 'teacher';
  image: string;
  price: number;
  finalPrice: number;
  discountPercentage: number;
  description: string;
  rating: number;
  reviews: number;
}

interface NativeStoreValue {
  loading: boolean;
  products: NativeProduct[];
  updatedAt: string | null;
  cart: CartState;
  wishlist: string[];
  cartItemsDetailed: Array<{ productId: string; quantity: number; product: NativeProduct; subtotal: number }>;
  wishlistProducts: NativeProduct[];
  addToCart: (productId: string) => void;
  increaseCart: (productId: string) => void;
  decreaseCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  refresh: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
}

const NativeStoreContext = createContext<NativeStoreValue | null>(null);

function toNativeFromMock() {
  return mockProducts.map((product) => ({
    id: product.id,
    title: product.name,
    slug: product.id,
    vendor: 'EduMart',
    category: product.category,
    audience: product.audience === 'school' ? 'teacher' : 'student',
    image: product.image,
    price: product.price,
    finalPrice: Math.max(Math.round(product.price * (1 - product.discountPercent / 100)), 0),
    discountPercentage: product.discountPercent,
    description: product.description,
    rating: product.rating,
    reviews: product.reviewCount,
  } satisfies NativeProduct));
}

function sanitizeCart(value: unknown): CartState {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<CartState>((acc, [id, qty]) => {
    if (typeof qty === 'number' && Number.isFinite(qty) && qty > 0) {
      acc[id] = Math.floor(qty);
    }
    return acc;
  }, {});
}

function sanitizeWishlist(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(new Set(value.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0)));
}

export function NativeStoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<NativeProduct[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [cart, setCart] = useState<CartState>({});
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const syncFromRemote = useCallback(async () => {
    const remote = await fetchWebsiteMobileContent();
    const liveProducts: NativeProduct[] =
      remote?.products?.map((product) => ({
        id: product.id,
        title: product.title,
        slug: product.slug,
        vendor: product.vendor,
        category: product.subcategory ?? product.category,
        audience: product.audience,
        image: product.image,
        price: product.price,
        finalPrice: product.finalPrice,
        discountPercentage: product.discountPercentage,
        description: product.description,
        rating: product.rating,
        reviews: product.reviews,
      })) ?? [];

    if (liveProducts.length) {
      setProducts(liveProducts);
      setUpdatedAt(remote?.updatedAt ?? new Date().toISOString());
      return true;
    }

    return false;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const synced = await syncFromRemote();
      if (!synced) {
        setProducts(toNativeFromMock());
        setUpdatedAt(new Date().toISOString());
      }
    } catch {
      setProducts(toNativeFromMock());
      setUpdatedAt(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  }, [syncFromRemote]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const [remote, rawCart, rawWishlist] = await Promise.all([
          fetchWebsiteMobileContent(),
          AsyncStorage.getItem(CART_STORAGE_KEY),
          AsyncStorage.getItem(WISHLIST_STORAGE_KEY),
        ]);

        if (!active) {
          return;
        }

        const liveProducts: NativeProduct[] =
          remote?.products?.map((product) => ({
            id: product.id,
            title: product.title,
            slug: product.slug,
            vendor: product.vendor,
            category: product.subcategory ?? product.category,
            audience: product.audience,
            image: product.image,
            price: product.price,
            finalPrice: product.finalPrice,
            discountPercentage: product.discountPercentage,
            description: product.description,
            rating: product.rating,
            reviews: product.reviews,
          })) ?? [];

        setProducts(liveProducts.length ? liveProducts : toNativeFromMock());
        setUpdatedAt(remote?.updatedAt ?? new Date().toISOString());
        setCart(rawCart ? sanitizeCart(JSON.parse(rawCart)) : {});
        setWishlist(rawWishlist ? sanitizeWishlist(JSON.parse(rawWishlist)) : []);
      } catch {
        if (!active) {
          return;
        }

        setProducts(toNativeFromMock());
        setUpdatedAt(new Date().toISOString());
        setCart({});
        setWishlist([]);
      } finally {
        if (active) {
          setLoading(false);
          setHydrated(true);
        }
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void syncFromRemote();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [syncFromRemote]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [hydrated, wishlist]);

  const value = useMemo<NativeStoreValue>(() => {
    function addToCart(productId: string) {
      setCart((current) => ({
        ...current,
        [productId]: (current[productId] ?? 0) + 1,
      }));
    }

    function increaseCart(productId: string) {
      addToCart(productId);
    }

    function decreaseCart(productId: string) {
      setCart((current) => {
        const next = (current[productId] ?? 0) - 1;
        if (next <= 0) {
          const copy = { ...current };
          delete copy[productId];
          return copy;
        }
        return {
          ...current,
          [productId]: next,
        };
      });
    }

    function removeFromCart(productId: string) {
      setCart((current) => {
        const copy = { ...current };
        delete copy[productId];
        return copy;
      });
    }

    function clearCart() {
      setCart({});
    }

    function updateCartQuantity(productId: string, quantity: number) {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCart((current) => ({
        ...current,
        [productId]: Math.max(1, Math.floor(quantity)),
      }));
    }

    function toggleWishlist(productId: string) {
      setWishlist((current) => (current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]));
    }

    const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const cartItemsDetailed = Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = products.find((entry) => entry.id === productId);
        if (!product) {
          return null;
        }
        return {
          productId,
          quantity,
          product,
          subtotal: product.finalPrice * quantity,
        };
      })
      .filter((entry): entry is { productId: string; quantity: number; product: NativeProduct; subtotal: number } =>
        Boolean(entry),
      );
    const wishlistProducts = products.filter((product) => wishlist.includes(product.id));
    const cartTotal = cartItemsDetailed.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      loading,
      products,
      updatedAt,
      cart,
      wishlist,
      cartItemsDetailed,
      wishlistProducts,
      addToCart,
      increaseCart,
      decreaseCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      refresh,
      cartCount,
      cartTotal,
      wishlistCount: wishlist.length,
    };
  }, [cart, loading, products, refresh, updatedAt, wishlist]);

  return <NativeStoreContext.Provider value={value}>{children}</NativeStoreContext.Provider>;
}

export function useNativeStore() {
  const context = useContext(NativeStoreContext);
  if (!context) {
    throw new Error('useNativeStore must be used inside NativeStoreProvider');
  }
  return context;
}
