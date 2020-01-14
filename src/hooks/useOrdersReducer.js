import { useReducer } from "react";

function useOrdersReducer() {
  const types = {
    FETCH_START: "FETCH_START",
    FETCH_DONE: "FETCH_DONE",
    SET_ERROR: "SET_ERROR",
  };

  const initialState = {
    dataFetched: false,
    loading: false,
    orders: [],
    error: null,
  };

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case types.FETCH_START: {
        return {
          ...state,
          loading: true,
          ordersReset: false,
        };
      }
      case types.FETCH_DONE: {
        return {
          ...state,
          dataFetched: true,
          loading: false,
          orders: [...state.orders, ...payload],
        };
      }
      case types.SET_ERROR: {
        return {
          ...state,
          loading: false,
          error: payload,
        };
      }
      default: {
        return state;
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return [state, dispatch, types];
}

export default useOrdersReducer;
