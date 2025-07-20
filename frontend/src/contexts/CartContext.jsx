import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  // Fonction pour rafraîchir le panier (et le compteur)
  const refreshCart = async () => {
    try {
      const res = await axios.get('http://localhost:5003/api/cart', { withCredentials: true });
      let items = [];
      if (Array.isArray(res.data)) {
        items = res.data;
      } else if (Array.isArray(res.data.cartItems)) {
        items = res.data.cartItems;
      } else if (Array.isArray(res.data.cart)) {
        items = res.data.cart;
      }
      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    } catch {
      setCartItems([]);
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

// Fichier inutilisé. Supprimez ce fichier si vous n'utilisez pas de contexte panier global.
