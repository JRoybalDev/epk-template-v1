import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import { FallbackImage } from './FallbackImage'
import {
  categoryLabels,
  formatMoney,
  getFeaturedShopItems,
  getShopItems,
  useShopCart,
} from './shopCart'

export function ShopGrid() {
  const { epk } = useEPKOutlet()
  const shop = epk.shop
  const items = getShopItems(shop)
  const featuredItems = getFeaturedShopItems(items)
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const {
    cartItems,
    cartCurrency,
    cartSubtotal,
    clearCart,
    updateCartQuantity,
  } = useShopCart(items)

  if (!shop) {
    return (
      <section data-section="shop" data-state="unavailable">
        <h1>Shop unavailable</h1>
        <p>Shop details have not been added yet.</p>
      </section>
    )
  }

  if (shop.redirectOnly) {
    return (
      <section data-section="shop">
        <header>
          <p>Shop</p>
          <h1>{shop.headline || 'Shop'}</h1>
          <a href={shop.externalStoreUrl} rel="noreferrer" target="_blank">
            Visit store
          </a>
        </header>
      </section>
    )
  }

  return (
    <section data-section="shop">
      <header>
        <p>Shop</p>
        <h1>{shop.headline || 'Featured merch'}</h1>
      </header>
      <div data-list="shopItems">
        {featuredItems.map((item) => {
          return (
            <article data-item="shopItem" key={item.id}>
              <FallbackImage
                alt=""
                fallbackLabel="Shop image"
                src={item.image}
              />
              <div>
                <h2>{item.name}</h2>
                <p>{item.currency} {item.price}</p>
                {item.category && <p>{categoryLabels[item.category]}</p>}
                {item.description && <p>{item.description}</p>}
                {item.category === 'clothing' && item.sizes?.length ? (
                  <p>Sizes: {item.sizes.join(', ')}</p>
                ) : null}
                <Link to={`/shop/${item.id}`}>View item</Link>
              </div>
            </article>
          )
        })}
        {featuredItems.length === 0 && <p>No featured shop items yet.</p>}
      </div>
      <aside data-section="shopCart" aria-label="Shopping cart">
        <h2>Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div data-list="cartItems">
              {cartItems.map(({ item, quantity, selectedSize }) => (
                <article
                  data-item="cartItem"
                  key={`${item.id}-${selectedSize ?? 'default'}`}
                >
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      {quantity} x {item.currency} {item.price}
                      {selectedSize ? ` - ${selectedSize}` : ''}
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(item.id, quantity - 1, selectedSize)
                      }
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(item.id, quantity + 1, selectedSize)
                      }
                    >
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p>
              Subtotal {formatMoney(cartSubtotal, cartCurrency)}
            </p>
            <button
              type="button"
              onClick={() => setCheckoutMessage('Checkout is ready for template integration.')}
            >
              Checkout
            </button>
            <button type="button" onClick={clearCart}>
              Clear cart
            </button>
            {checkoutMessage && <p role="status">{checkoutMessage}</p>}
          </>
        )}
      </aside>
    </section>
  )
}
