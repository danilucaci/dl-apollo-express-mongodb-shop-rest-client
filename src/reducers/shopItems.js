export const ShopItemsTypes = {
  FETCH_START: "FETCH_START",
  FETCH_DONE: "FETCH_DONE",
  FETCHED_MORE: "FETCHED_MORE",
  ERROR: "ERROR",
};

export const ShopItemsInitialState = {
  dataFetched: false,
  shopItems: null,
  hasNextPage: false,
  loading: false,
  error: false,
};

export const ShopItemsReducer = (state, { type, payload }) => {
  switch (type) {
    case ShopItemsTypes.FETCH_START: {
      return {
        ...state,
        loading: true,
      };
    }
    case ShopItemsTypes.FETCH_DONE: {
      return {
        ...state,
        loading: false,
        dataFetched: true,
        hasNextPage: payload.hasNextPage,
        shopItems: payload.shopItems,
      };
    }
    case ShopItemsTypes.FETCHED_MORE: {
      return {
        ...state,
        loading: false,
        hasNextPage: payload.hasNextPage,
        shopItems: [...state.shopItems, ...payload.shopItems],
      };
    }
    case ShopItemsTypes.ERROR: {
      return {
        ...state,
        error: true,
      };
    }
    default:
      return state;
  }
};
