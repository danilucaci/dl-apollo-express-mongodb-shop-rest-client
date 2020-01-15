import axios from "axios";

import { ShopItemTypes } from "../reducers/shopItem";

const RESPONSE_TYPES = {
  created: "created",
  updated: "updated",
};

const ITEM_SIZES_QUERY = `
  query itemSizes {
    __type(name: "Size") {
      name
      enumValues {
        name
      }
    }
  }
`;

export function handleItemSizeChange(value) {
  return function thunk(dispatch) {
    dispatch({ type: ShopItemTypes.SET_SELECTED_ITEM_SIZE, payload: value });
  };
}

async function getItemSizes(isAuthenticated, userToken) {
  return axios({
    method: "post",
    url: "http://localhost:4000/graphql",
    headers: {
      "Content-Type": "application/json",
      Authorization: isAuthenticated && userToken ? `Bearer ${userToken}` : "",
    },
    data: JSON.stringify({
      query: ITEM_SIZES_QUERY,
    }),
    validateStatus: (_status) => {
      return true;
    },
  });
}

async function getShopItem(isAuthenticated, userToken, shopItemID) {
  return axios({
    method: "get",
    url: `http://localhost:4000/shop-item/${shopItemID}`,
    headers:
      isAuthenticated && userToken
        ? {
            Authorization: `Bearer ${userToken}`,
          }
        : null,
    validateStatus: (status) => {
      if (status > 400) {
        return false;
      }
      return true;
    },
  });
}

export function fetchData(isAuthenticated, userToken, shopItemID) {
  return async function thunk(dispatch) {
    dispatch({ type: ShopItemTypes.INITIAL_FETCH_START });

    const res = await Promise.all([
      getItemSizes(isAuthenticated, userToken, shopItemID).catch((error) =>
        dispatch({
          type: ShopItemTypes.SET_SHOP_ITEM_ERROR,
          payload: error.message,
        }),
      ),
      getShopItem(isAuthenticated, userToken, shopItemID).catch((error) =>
        dispatch({
          type: ShopItemTypes.SET_SHOP_ITEM_ERROR,
          payload: error.message,
        }),
      ),
    ]).catch((error) =>
      dispatch({
        type: ShopItemTypes.SET_INITIAL_FETCH_ERROR,
        payload: error.message,
      }),
    );

    const [
      {
        data: {
          data: { __type: { enumValues: shopItemSizes } = {} } = {},
        } = {},
      } = {},
      { data: { data: shopItem } = {} } = {},
    ] = res || [];

    if (!shopItemSizes && !shopItem) {
      dispatch({
        type: ShopItemTypes.SET_INITIAL_FETCH_ERROR,
        payload: "Failed to get the data",
      });
    } else {
      dispatch({
        type: ShopItemTypes.SET_INITIAL_FETCH_DONE,
        payload: {
          shopItemSizes: shopItemSizes,
          shopItem: shopItem,
        },
      });
    }
  };
}

export function handleAddToCart(
  cartDispatch,
  cartTypes,
  isAuthenticated,
  userToken,
  selectedItemSize,
  shopItemID,
) {
  return async function thunk(dispatch) {
    let responseType;

    if (selectedItemSize) {
      dispatch({ type: ShopItemTypes.ADD_TO_CART_START });

      const data = JSON.stringify({
        item: shopItemID,
        size: selectedItemSize,
        quantity: 1,
      });

      const res = await axios({
        url: "http://localhost:4000/api/cart",
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            isAuthenticated && userToken ? `Bearer ${userToken}` : "",
        },
        data,
        validateStatus: (status) => {
          if (status === 200) {
            responseType = RESPONSE_TYPES.updated;
          }

          if (status === 201) {
            responseType = RESPONSE_TYPES.created;
          }

          if (status > 400) {
            return false;
          }

          return true;
        },
      }).catch((error) => {
        dispatch({
          type: ShopItemTypes.ADD_TO_CART_ERROR,
          payload: error.message,
        });
      });

      const { data: { data: cartItem } = {} } = res || {};

      if (cartItem && responseType === RESPONSE_TYPES.created) {
        cartDispatch({ type: cartTypes.ADD_CART_ITEM, payload: cartItem });
      }

      if (cartItem && responseType === RESPONSE_TYPES.updated) {
        cartDispatch({
          type: cartTypes.UPDATE_CART_ITEM,
          payload: {
            id: cartItem.id,
            quantity: cartItem.quantity,
          },
        });
      }

      if (cartItem && responseType) {
        dispatch({
          type: ShopItemTypes.ADD_TO_CART_DONE,
        });
      }
    }
  };
}
