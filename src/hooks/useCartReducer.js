import { useReducer } from "react";
import useLoggingThunkReducer from "./useLoggingThunkReducer";

import { CartTypes, CartInitialState, CartReducer } from "../reducers/cart";
import {
  resetCart,
  fetchData,
  updateLocalCartItem,
  deleteLocalCartItem,
} from "../actions/cart";

const actions = {
  resetCart,
  fetchData,
  updateLocalCartItem,
  deleteLocalCartItem,
};

function useCartReducer() {
  const [state, dispatch] = useLoggingThunkReducer(
    useReducer(CartReducer, CartInitialState),
  );

  return [state, dispatch, actions, CartTypes];
}

export default useCartReducer;
