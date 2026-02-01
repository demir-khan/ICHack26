// context/CartContext.js
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize as an empty array
  const [cart, setCart] = useState([]);

  // Add item to basket
  const addToCart = (item) => {
    setCart((prevCart) => {
      // 🛡️ SAFETY FIX: If the cart is somehow 'undefined' (the bug), make it an array []
      const safeCart = Array.isArray(prevCart) ? prevCart : [];
      return [...safeCart, item];
    });
  };

  // Remove item
  const removeFromCart = (indexToRemove) => {
    setCart((prevCart) => {
       const safeCart = Array.isArray(prevCart) ? prevCart : [];
       return safeCart.filter((_, index) => index !== indexToRemove);
    });
  };

  // Calculate Total Price
  const getTotalPrice = () => {
    // 🛡️ Safety Check for the total calculation too
    const safeCart = Array.isArray(cart) ? cart : [];
    return safeCart.reduce((total, item) => total + (item.price || 0), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);