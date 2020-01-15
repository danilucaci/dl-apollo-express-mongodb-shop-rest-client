export const LocalCartTypes = {
  DELETE_CART_ITEM_LOADING: "DELETE_CART_ITEM_LOADING",
  DELETE_CART_ITEM_DELETED: "DELETE_CART_ITEM_DELETED",
  DELETE_CART_ITEM_ERROR: "DELETE_CART_ITEM_ERROR",
  ADD_ORDER_LOADING: "ADD_ORDER_LOADING",
  ADD_ORDER_ERROR: "ADD_ORDER_ERROR",
  ADD_ORDER_ADDED: "ADD_ORDER_ADDED",
  UPDATE_CART_ITEM_LOADING: "UPDATE_CART_ITEM_LOADING",
  UPDATE_CART_ITEM_UPDATED: "UPDATE_CART_ITEM_UPDATED",
  UPDATE_CART_ITEM_ERROR: "UPDATE_CART_ITEM_ERROR",
};

export const LocalCartInitialState = {
  deleteCartItemLoading: false,
  deleteCartItemError: null,
  addOrderLoading: false,
  addOrderError: null,
  addOrderAdded: false,
  updateCartItemLoading: false,
  updateCartItemError: null,
};

export const LocalCartReducer = (state, { type, payload }) => {
  switch (type) {
    case LocalCartTypes.DELETE_CART_ITEM_LOADING: {
      return {
        ...state,
        deleteCartItemLoading: true,
      };
    }
    case LocalCartTypes.DELETE_CART_ITEM_DELETED: {
      return {
        ...state,
        deleteCartItemLoading: false,
      };
    }
    case LocalCartTypes.DELETE_CART_ITEM_ERROR: {
      return {
        ...state,
        deleteCartItemLoading: false,
      };
    }
    case LocalCartTypes.ADD_ORDER_LOADING: {
      return {
        ...state,
        addOrderLoading: true,
      };
    }
    case LocalCartTypes.ADD_ORDER_ADDED: {
      return {
        ...state,
        addOrderLoading: false,
        addOrderAdded: true,
      };
    }
    case LocalCartTypes.ADD_ORDER_ERROR: {
      return {
        ...state,
        addOrderError: payload,
      };
    }
    case LocalCartTypes.UPDATE_CART_ITEM_LOADING: {
      return {
        ...state,
        updateCartItemLoading: true,
      };
    }
    case LocalCartTypes.UPDATE_CART_ITEM_UPDATED: {
      return {
        ...state,
        updateCartItemLoading: false,
      };
    }
    case LocalCartTypes.UPDATE_CART_ITEM_ERROR: {
      return {};
    }
    default: {
      return state;
    }
  }
};
