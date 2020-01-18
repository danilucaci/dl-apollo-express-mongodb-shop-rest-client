import { useReducer } from "react";
import useLoggingThunkReducer from "./useLoggingThunkReducer";

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
  const [state, dispatch] = useLoggingThunkReducer(
    useReducer(ShopItemsReducer, ShopItemsInitialState),
  );

  return [state, dispatch, actions, ShopItemsTypes];
}

export default useShopItemsReducer;
