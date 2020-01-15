export const OrdersTypes = {
  FETCH_START: "FETCH_START",
  FETCH_DONE: "FETCH_DONE",
  SET_ERROR: "SET_ERROR",
};

export const OrdersInitialState = {
  dataFetched: false,
  loading: false,
  orders: [],
  error: null,
};

export const OrdersReducer = (state, { type, payload }) => {
  switch (type) {
    case OrdersTypes.FETCH_START: {
      return {
        ...state,
        loading: true,
        ordersReset: false,
      };
    }
    case OrdersTypes.FETCH_DONE: {
      return {
        ...state,
        dataFetched: true,
        loading: false,
        orders: [...state.orders, ...payload],
      };
    }
    case OrdersTypes.SET_ERROR: {
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
