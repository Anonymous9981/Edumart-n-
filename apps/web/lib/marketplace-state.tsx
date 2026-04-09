'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import type { HomepageProduct } from './homepage-types'

type CartState = Record<string, number>

interface MarketplaceStateValue {
  ready: boolean
  cart: CartState
  wishlist: string[]
  addToCart: (productId: string, quantity?: number) => boolean
  increaseCartQuantity: (productId: string, quantity?: number) => void
  decrementCartItem: (productId: string) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  toggleWishlist: (productId: string) => void
  isInCart: (productId: string) => boolean
  isInWishlist: (productId: string) => boolean
  cartQuantity: (productId: string) => number
}

const CART_STORAGE_KEY = 'edumart-cart'
const WISHLIST_STORAGE_KEY = 'edumart-wishlist'

const MarketplaceStateContext = createContext<MarketplaceStateValue | null>(null)

function readCartState(): CartState {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw) as CartState
    return Object.entries(parsed).reduce<CartState>((accumulator, [productId, quantity]) => {
      if (typeof quantity === 'number' && quantity > 0) {
        accumulator[productId] = quantity
      }
      return accumulator
    }, {})
  } catch {
    return {}
  }
}

function readWishlistState(): string[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? Array.from(new Set(parsed.filter((entry) => typeof entry === 'string' && entry.length > 0))) : []
  } catch {
    return []
  }
}

function writeCartState(nextState: CartState) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextState))
}

function writeWishlistState(nextState: string[]) {
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(nextState))
}

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [cart, setCart] = useState<CartState>({})
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    setCart(readCartState())
    setWishlist(readWishlistState())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) {
      return
    }

    writeCartState(cart)
  }, [cart, ready])

  useEffect(() => {
    if (!ready) {
      return
    }

    writeWishlistState(wishlist)
  }, [ready, wishlist])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === CART_STORAGE_KEY) {
        setCart(readCartState())
      }

      if (event.key === WISHLIST_STORAGE_KEY) {
        setWishlist(readWishlistState())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const value = useMemo<MarketplaceStateValue>(() => {
    function addToCart(productId: string, quantity = 1) {
      if (quantity <= 0) {
        return false
      }

      if ((cart[productId] ?? 0) > 0) {
        return false
      }

      setCart((current) => ({
        ...current,
        [productId]: (current[productId] ?? 0) + quantity,
      }))

      return true
    }

    function increaseCartQuantity(productId: string, quantity = 1) {
      if (quantity <= 0) {
        return
      }

      setCart((current) => ({
        ...current,
        [productId]: (current[productId] ?? 0) + quantity,
      }))
    }

    function decrementCartItem(productId: string) {
      setCart((current) => {
        const nextQuantity = (current[productId] ?? 0) - 1
        if (nextQuantity <= 0) {
          const nextState = { ...current }
          delete nextState[productId]
          return nextState
        }

        return {
          ...current,
          [productId]: nextQuantity,
        }
      })
    }

    function removeFromCart(productId: string) {
      setCart((current) => {
        if (!(productId in current)) {
          return current
        }

        const nextState = { ...current }
        delete nextState[productId]
        return nextState
      })
    }

    function clearCart() {
      setCart({})
    }

    function addToWishlist(productId: string) {
      setWishlist((current) => (current.includes(productId) ? current : [...current, productId]))
    }

    function removeFromWishlist(productId: string) {
      setWishlist((current) => current.filter((entry) => entry !== productId))
    }

    function toggleWishlist(productId: string) {
      setWishlist((current) => (current.includes(productId) ? current.filter((entry) => entry !== productId) : [...current, productId]))
    }

    return {
      ready,
      cart,
      wishlist,
      addToCart,
      increaseCartQuantity,
      decrementCartItem,
      removeFromCart,
      clearCart,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInCart: (productId) => (cart[productId] ?? 0) > 0,
      isInWishlist: (productId) => wishlist.includes(productId),
      cartQuantity: (productId) => cart[productId] ?? 0,
    }
  }, [cart, ready, wishlist])

  return <MarketplaceStateContext.Provider value={value}>{children}</MarketplaceStateContext.Provider>
}

export function useMarketplaceState() {
  const context = useContext(MarketplaceStateContext)

  if (!context) {
    throw new Error('useMarketplaceState must be used within MarketplaceProvider')
  }

  return context
}

export function resolveProductsByIds(products: HomepageProduct[], ids: string[]) {
  const productById = new Map(products.map((product) => [product.id, product]))
  return ids.map((id) => productById.get(id)).filter((product): product is HomepageProduct => Boolean(product))
}