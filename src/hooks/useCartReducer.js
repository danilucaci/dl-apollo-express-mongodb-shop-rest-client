import { useReducer } from "react";
import useLogger from "./useLogger";
import useThunk from "./useThunk";
import { composeReducers } from "../utils/helpers";

import { CartTypes, CartInitialState, CartReducer } from "../reducers/cart";
import {
  resetCart,
  fetchData,
  updateLocalCartItem,
  deleteLocalCartItem,
} from "../actions/cart";

function useCartReducer() {
  const [state, dispatch] = composeReducers(
    useThunk,
    useLogger,
    useReducer(CartReducer, CartInitialState),
  );

  const actions = {
    resetCart,
    fetchData,
    updateLocalCartItem,
    deleteLocalCartItem,
  };

  return [state, dispatch, actions, CartTypes];
}

export default useCartReducer;
