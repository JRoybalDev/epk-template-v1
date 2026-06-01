import { useEffect, useMemo, useState } from 'react'
import type { EPK, ShopItem } from '../../../../../packages/schema'

export type ShopCartLine = {
  itemId: string
  quantity: number
  selectedSize?: string
}

export type ShopCartItem = ShopCartLine & {
  item: ShopItem
}

const cartStorageKey = 'epk-shop-cart'

export const categoryLabels: Record<NonNullable<ShopItem['category']>, string> = {
  clothing: 'Clothing',
  music: 'Music',
  other: 'Other',
}

export const parsePrice = (value: string) => {
  const parsed = Number.parseFloat(value.replace(/[^0-9.]/g, ''))

  return Number.isFinite(parsed) ? parsed : 0
}

export const formatMoney = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    currency,
    style: 'currency',
  }).format(value)

const getLineKey = (itemId: string, selectedSize?: string) =>
  [itemId, selectedSize ?? 'default'].join('::')

const readStoredCart = (): Record<string, ShopCartLine> => {
  if (typeof window === 'undefined') return {}

  try {
    const stored = window.localStorage.getItem(cartStorageKey)
    if (!stored) return {}

    const parsed = JSON.parse(stored) as Record<string, ShopCartLine>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function useShopCart(items: ShopItem[]) {
  const [cart, setCart] = useState<Record<string, ShopCartLine>>(readStoredCart)
  const itemsById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items],
  )
  const cartItems = useMemo(
    () =>
      Object.values(cart)
        .map((line) => {
          const item = itemsById.get(line.itemId)

          return item ? { ...line, item } : null
        })
        .filter((line): line is ShopCartItem => Boolean(line)),
    [cart, itemsById],
  )
  const cartCurrency = cartItems[0]?.item.currency ?? 'USD'
  const cartSubtotal = cartItems.reduce(
    (total, cartItem) =>
      total + parsePrice(cartItem.item.price) * cartItem.quantity,
    0,
  )

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cart))
  }, [cart])

  const updateCartQuantity = (
    itemId: string,
    quantity: number,
    selectedSize?: string,
  ) => {
    setCart((current) => {
      const next = { ...current }
      const lineKey = getLineKey(itemId, selectedSize)

      if (quantity <= 0) {
        delete next[lineKey]
        return next
      }

      next[lineKey] = { itemId, quantity, selectedSize }
      return next
    })
  }

  const addToCart = (
    item: Pick<ShopItem, 'id'>,
    quantity = 1,
    selectedSize?: string,
  ) => {
    setCart((current) => {
      const lineKey = getLineKey(item.id, selectedSize)
      const currentQuantity = current[lineKey]?.quantity ?? 0

      return {
        ...current,
        [lineKey]: {
          itemId: item.id,
          quantity: currentQuantity + quantity,
          selectedSize,
        },
      }
    })
  }

  const clearCart = () => setCart({})

  return {
    addToCart,
    cartItems,
    cartSubtotal,
    cartCurrency,
    clearCart,
    updateCartQuantity,
  }
}

export const getShopItems = (shop: EPK['shop']) => shop?.featuredItems ?? []

export const getFeaturedShopItems = (items: ShopItem[]) =>
  items.some((item) => item.isFeatured)
    ? items.filter((item) => item.isFeatured)
    : items
