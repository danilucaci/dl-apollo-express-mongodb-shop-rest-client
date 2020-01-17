import { useReducer } from "react";
import useLogger from "./useLogger";
import useThunk from "./useThunk";
import { composeReducers } from "../utils/helpers";

import {
  OrdersTypes,
  OrdersInitialState,
  OrdersReducer,
} from "../reducers/orders";

import { fetchData } from "../actions/orders";

const actions = {
  fetchData,
};

function useOrdersReducer() {
  const [state, dispatch] = composeReducers(
    useThunk,
    useLogger,
    useReducer(OrdersReducer, OrdersInitialState),
  );

  return [state, dispatch, actions, OrdersTypes];
}

export default useOrdersReducer;
