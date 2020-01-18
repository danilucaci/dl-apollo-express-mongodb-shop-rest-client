import { useReducer } from "react";
import useLoggingThunkReducer from "./useLoggingThunkReducer";

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
  const [state, dispatch] = useLoggingThunkReducer(
    useReducer(OrdersReducer, OrdersInitialState),
  );

  return [state, dispatch, actions, OrdersTypes];
}

export default useOrdersReducer;
