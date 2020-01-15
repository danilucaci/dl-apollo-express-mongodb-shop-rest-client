import React, { createContext } from "react";
import useCart from "../hooks/useCart";

export const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, dispatch, actions, types] = useCart();

  return (
    <CartContext.Provider value={{ cart, dispatch, actions, types }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
