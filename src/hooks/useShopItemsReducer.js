import { useReducer } from "react";
import useLogger from "./useLogger";
import useThunk from "./useThunk";
import { composeReducers } from "../utils/helpers";

import {
  ShopItemsTypes,
  ShopItemsInitialState,
  ShopItemsReducer,
} from "../reducers/shopItems";
import { fetchMore, fetchShopItems } from "../actions/shopItems";

const actions = {
  fetchMore,
  fetchShopItems,
};

function useShopItemsReducer() {
  const [state, dispatch] = composeReducers(
    useThunk,
    useLogger,
    useReducer(ShopItemsReducer, ShopItemsInitialState),
  );

  return [state, dispatch, actions, ShopItemsTypes];
}

export default useShopItemsReducer;
