import { useReducer } from "react";

function useShopItems() {
  const types = {
    FETCH_START: "FETCH_START",
    FETCH_DONE: "FETCH_DONE",
    FETCHED_MORE: "FETCHED_MORE",
    ERROR: "ERROR",
  };

  const initialState = {
    dataFetched: false,
    shopItems: null,
    hasNextPage: false,
    loading: false,
    error: false,
  };

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case types.FETCH_START: {
        return {
          ...state,
          loading: true,
        };
      }
      case types.FETCH_DONE: {
        return {
          ...state,
          loading: false,
          dataFetched: true,
          hasNextPage: payload.hasNextPage,
          shopItems: payload.shopItems,
        };
      }
      case types.FETCHED_MORE: {
        return {
          ...state,
          loading: false,
          hasNextPage: payload.hasNextPage,
          shopItems: [...state.shopItems, ...payload.shopItems],
        };
      }
      case types.ERROR: {
        return {
          ...state,
          error: true,
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return [state, dispatch, types];
}

export default useShopItems;
