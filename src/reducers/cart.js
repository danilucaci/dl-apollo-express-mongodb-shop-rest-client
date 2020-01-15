export const CartTypes = {
  FETCH_START: "FETCH_START",
  FETCH_DONE: "FETCH_DONE",
  RESET_CART: "RESET_CART",
  SET_ERROR: "SET_ERROR",
  UPDATE_CART_ITEM: "UPDATE_CART_ITEM",
  DELETE_CART_ITEM: "DELETE_CART_ITEM",
  ADD_CART_ITEM: "ADD_CART_ITEM",
};

export const CartInitialState = {
  dataFetched: false,
  cartReset: false,
  loading: false,
  cart: [],
  error: null,
};

export const CartReducer = (state, { type, payload }) => {
  switch (type) {
    case CartTypes.FETCH_START: {
      return {
        ...state,
        loading: true,
        cartReset: false,
      };
    }
    case CartTypes.FETCH_DONE: {
      return {
        ...state,
        dataFetched: true,
        loading: false,
        cart: [...state.cart, ...payload],
      };
    }
    case CartTypes.DELETE_CART_ITEM: {
      const filteredCart = state.cart.filter(
        (cartItem) => cartItem.id !== payload.id,
      );

      return {
        ...state,
        cart: [...filteredCart],
      };
    }
    case CartTypes.UPDATE_CART_ITEM: {
      const updatedCart = state.cart.map((cartItem) => {
        if (cartItem.id === payload.id) {
          return {
            ...cartItem,
            quantity: payload.quantity,
          };
        } else {
          return cartItem;
        }
      });

      return {
        ...state,
        cart: [...updatedCart],
      };
    }
    case CartTypes.ADD_CART_ITEM: {
      return {
        ...state,
        cart: [...state.cart, payload],
      };
    }
    case CartTypes.SET_ERROR: {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    }
    case CartTypes.RESET_CART: {
      return {
        dataFetched: false,
        cartReset: true,
        loading: false,
        cart: [],
        error: null,
      };
    }
    default: {
      return state;
    }
  }
};
