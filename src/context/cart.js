import React, { createContext } from "react";
import useCart from "../hooks/useCart";

export const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, dispatch, types] = useCart();

  return (
    <CartContext.Provider value={{ cart, dispatch, types }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
