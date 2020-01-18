import { useReducer } from "react";
import useLoggingThunkReducer from "./useLoggingThunkReducer";

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

const actions = {
  fetchData,
  handleAddToCart,
  handleItemSizeChange,
};

function useShopItemReducer() {
  const [state, dispatch] = useLoggingThunkReducer(
    useReducer(ShopItemReducer, ShopItemInitialState),
  );

  return [state, dispatch, actions, ShopItemTypes];
}

export default useShopItemReducer;
