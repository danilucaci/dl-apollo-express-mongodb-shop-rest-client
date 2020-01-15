import { useReducer } from "react";
import useLogger from "./useLogger";
import useThunk from "./useThunk";
import { composeReducers } from "../utils/helpers";

import {
  LocalCartTypes,
  LocalCartInitialState,
  LocalCartReducer,
} from "../reducers/localCart";
import { deleteCartItem, addOrder, updateCartItem } from "../actions/localCart";

function useLocalCartReducer() {
  const [state, dispatch] = composeReducers(
    useThunk,
    useLogger,
    useReducer(LocalCartReducer, LocalCartInitialState),
  );

  const actions = {
    deleteCartItem,
    addOrder,
    updateCartItem,
  };

  return [state, dispatch, actions, LocalCartTypes];
}

export default useLocalCartReducer;
