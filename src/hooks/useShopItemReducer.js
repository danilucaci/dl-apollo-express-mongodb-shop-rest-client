import { useReducer } from "react";
import useLogger from "./useLogger";
import useThunk from "./useThunk";
import { composeReducers } from "../utils/helpers";

import {
  ShopItemReducer,
  ShopItemInitialState,
  ShopItemTypes,
} from "../reducers/shopItem";

import {
  fetchData,
  handleAddToCart,
  handleItemSizeChange,
} from "../actions/shopItem";

function useShopItemReducer() {
  const [state, dispatch] = composeReducers(
    useThunk,
    useLogger,
    useReducer(ShopItemReducer, ShopItemInitialState),
  );

  const actions = {
    fetchData,
    handleAddToCart,
    handleItemSizeChange,
  };

  return [state, dispatch, actions, ShopItemTypes];
}

export default useShopItemReducer;
