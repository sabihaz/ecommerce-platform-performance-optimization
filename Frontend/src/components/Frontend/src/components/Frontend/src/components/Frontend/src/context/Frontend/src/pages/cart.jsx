import React, { createContext, useState, useEffect } from 'react'

const CartContext = createContext()
const cartFromLocal = JSON.parse(localStorage.getItem('cartItems')) || []

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(cartFromLocal)

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const clearItem = (product) => {
    const newCart = cartItems.filter((item) => item.id !== product.id)
    setCartItems(newCart)
  }

  const removeOneItem = (product) => {
    const existingItemIndex = cartItems.findIndex((item) => item.id === product.id)
    if (product.quantity > 1 && existingItemIndex !== -1) {
      setCartItems(
        cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity - 1,
              price: product.price - item.realPrice,
            }
          }
          return item
        })
      )
    } else {
      const newCart = cartItems.filter((item) => item.id !== product.id)
      setCartItems(newCart)
    }
  }

  const addToCart = (product) => {
    const existingItemIndex = cartItems.findIndex((item) => item.id === product.id)
    if (existingItemIndex !== -1) {
      setCartItems(
        cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + 1,
              price: (item.quantity + 1) * product.realPrice,
            }
          }
          return item
        })
      )
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          quantity: 1,
          name: product.productName,
          image: product.image,
          price: product.price,
          realPrice: product.price,
        },
      ])
    }
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearItem, removeOneItem }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
