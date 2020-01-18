import { useReducer } from "react";
import useLoggingThunkReducer from "./useLoggingThunkReducer";

import {
  LocalCartTypes,
  LocalCartInitialState,
  LocalCartReducer,
} from "../reducers/localCart";
import { deleteCartItem, addOrder, updateCartItem } from "../actions/localCart";

const actions = {
  deleteCartItem,
  addOrder,
  updateCartItem,
};

function useLocalCartReducer() {
  const [state, dispatch] = useLoggingThunkReducer(
    useReducer(LocalCartReducer, LocalCartInitialState),
  );

  return [state, dispatch, actions, LocalCartTypes];
}

export default useLocalCartReducer;
