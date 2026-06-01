import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEPKOutlet } from '../../hooks/useEPKOutlet'
import { FallbackImage } from './FallbackImage'
import {
  categoryLabels,
  formatMoney,
  getShopItems,
  parsePrice,
  useShopCart,
} from './shopCart'

export function ShopItemPage() {
  const { itemId } = useParams()
  const { epk } = useEPKOutlet()
  const shop = epk.shop
  const items = getShopItems(shop)
  const item = items.find((entry) => entry.id === itemId)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const {
    addToCart,
    cartCurrency,
    cartItems,
    cartSubtotal,
    clearCart,
    updateCartQuantity,
  } = useShopCart(items)
  const requiresSize = item?.category === 'clothing' && Boolean(item.sizes?.length)
  const canAddToCart = Boolean(item) && (!requiresSize || selectedSize)
  const itemTotal = useMemo(
    () => (item ? formatMoney(parsePrice(item.price) * quantity, item.currency) : ''),
    [item, quantity],
  )

  if (!shop || !item) {
    return (
      <section data-section="shop-item" data-state="not-found">
        <p>Shop</p>
        <h1>Item unavailable</h1>
        <p>This shop item could not be found.</p>
        <Link to="/shop">Back to shop</Link>
      </section>
    )
  }

  return (
    <section data-section="shop-item">
      <Link to="/shop">Back to shop</Link>
      <article data-item="shopItemDetail">
        <FallbackImage
          alt=""
          fallbackLabel="Shop image"
          src={item.image}
        />
        <div>
          <p>{item.category ? categoryLabels[item.category] : 'Shop item'}</p>
          <h1>{item.name}</h1>
          <p>{item.currency} {item.price}</p>
          {item.description && <p>{item.description}</p>}
          {requiresSize && (
            <div>
              <label htmlFor={`${item.id}-size`}>Size</label>
              <select
                id={`${item.id}-size`}
                value={selectedSize}
                onChange={(event) => setSelectedSize(event.target.value)}
              >
                <option value="">Select a size</option>
                {item.sizes?.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor={`${item.id}-quantity`}>Quantity</label>
            <input
              id={`${item.id}-quantity`}
              min="1"
              type="number"
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.max(1, Number.parseInt(event.target.value, 10) || 1))
              }
            />
          </div>
          <p>Total {itemTotal}</p>
          <button
            disabled={!canAddToCart}
            type="button"
            onClick={() => {
              addToCart(item, quantity, selectedSize || undefined)
              setCheckoutMessage(`${item.name} added to cart.`)
            }}
          >
            Add to cart
          </button>
          {requiresSize && !selectedSize && <p>Select a size before adding to cart.</p>}
          {checkoutMessage && <p role="status">{checkoutMessage}</p>}
        </div>
      </article>
      <aside data-section="shopCart" aria-label="Shopping cart">
        <h2>Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div data-list="cartItems">
              {cartItems.map(({ item: cartItem, quantity: cartQuantity, selectedSize }) => (
                <article
                  data-item="cartItem"
                  key={`${cartItem.id}-${selectedSize ?? 'default'}`}
                >
                  <div>
                    <h3>{cartItem.name}</h3>
                    <p>
                      {cartQuantity} x {cartItem.currency} {cartItem.price}
                      {selectedSize ? ` - ${selectedSize}` : ''}
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(
                          cartItem.id,
                          cartQuantity - 1,
                          selectedSize,
                        )
                      }
                    >
                      -
                    </button>
                    <span>{cartQuantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(
                          cartItem.id,
                          cartQuantity + 1,
                          selectedSize,
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p>Subtotal {formatMoney(cartSubtotal, cartCurrency)}</p>
            <button
              type="button"
              onClick={() => setCheckoutMessage('Checkout is ready for template integration.')}
            >
              Checkout
            </button>
            <button type="button" onClick={clearCart}>
              Clear cart
            </button>
          </>
        )}
      </aside>
    </section>
  )
}
