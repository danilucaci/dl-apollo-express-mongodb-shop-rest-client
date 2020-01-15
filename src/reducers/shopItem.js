export const ShopItemTypes = {
  INITIAL_FETCH_START: "INITIAL_FETCH_START",
  SET_INITIAL_FETCH_ERROR: "SET_INITIAL_FETCH_ERROR",
  SET_INITIAL_FETCH_DONE: "SET_INITIAL_FETCH_DONE",
  SET_SELECTED_ITEM_SIZE: "SET_SELECTED_ITEM_SIZE",
  SET_ITEM_SIZES_ERROR: "SET_ITEM_SIZES_ERROR",
  SET_SHOP_ITEM_ERROR: "SET_SHOP_ITEM_ERROR",
  ADD_TO_CART_START: "ADD_TO_CART_START",
  ADD_TO_CART_ERROR: "ADD_TO_CART_ERROR",
  ADD_TO_CART_DONE: "ADD_TO_CART_DONE",
};

export const ShopItemInitialState = {
  initialFetchLoading: false,
  initialFetchDone: false,
  initialFetchError: false,
  shopItemSizes: null,
  shopItemSizesError: false,
  shopItem: null,
  shopItemError: false,
  selectedItemSize: null,
  addCartItemCalled: false,
  addCartItemError: null,
  addCartItemLoading: false,
  addToCartItem: null,
};

export const ShopItemReducer = (state, { type, payload }) => {
  switch (type) {
    case ShopItemTypes.INITIAL_FETCH_START: {
      return {
        ...state,
        initialFetchLoading: true,
      };
    }
    case ShopItemTypes.SET_INITIAL_FETCH_ERROR: {
      return {
        ...state,
        initialFetchError: true,
        initialFetchLoading: false,
      };
    }
    case ShopItemTypes.SET_INITIAL_FETCH_DONE: {
      return {
        ...state,
        initialFetchLoading: false,
        shopItem: payload.shopItem,
        shopItemSizes: payload.shopItemSizes,
      };
    }
    case ShopItemTypes.SET_SELECTED_ITEM_SIZE: {
      return {
        ...state,
        selectedItemSize: payload,
      };
    }
    case ShopItemTypes.SET_ITEM_SIZES_ERROR: {
      return {
        ...state,
        shopItemSizesError: payload,
      };
    }
    case ShopItemTypes.SET_SHOP_ITEM_ERROR: {
      return {
        ...state,
        shopItemError: payload,
      };
    }
    case ShopItemTypes.ADD_TO_CART_START: {
      return {
        ...state,
        addCartItemLoading: true,
      };
    }
    case ShopItemTypes.ADD_TO_CART_ERROR: {
      return {
        ...state,
        addCartItemLoading: false,
        addCartItemError: payload,
      };
    }
    case ShopItemTypes.ADD_TO_CART_DONE: {
      return {
        ...state,
        addCartItemLoading: false,
        addToCartItem: payload,
      };
    }
    default: {
      return state;
    }
  }
};
