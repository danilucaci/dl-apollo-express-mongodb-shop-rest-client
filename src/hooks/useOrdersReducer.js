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

function useOrdersReducer() {
  const [state, dispatch] = composeReducers(
    useThunk,
    useLogger,
    useReducer(OrdersReducer, OrdersInitialState),
  );

  const actions = {
    fetchData,
  };

  return [state, dispatch, actions, OrdersTypes];
}

export default useOrdersReducer;
