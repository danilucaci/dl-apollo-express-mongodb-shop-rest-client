import axios from "axios";
import { LocalCartTypes } from "../reducers/localCart";

export function deleteCartItem(
  id,
  cartDispatch,
  deleteLocalCartItem,
  isAuthenticated,
  userToken,
) {
  return async function thunk(dispatch) {
    dispatch({ type: LocalCartTypes.DELETE_CART_ITEM_LOADING });

    await axios({
      url: `http://localhost:4000/api/cart/${id}`,
      method: "delete",
      headers:
        isAuthenticated && userToken
          ? {
              Authorization: `Bearer ${userToken}`,
            }
          : null,
      validateStatus: (_status) => {
        // Fix for Axios not returning response for POST on 500 error
        // @see https://github.com/axios/axios#request-config
        return true;
      },
    }).catch((error) => {
      if (axios.isCancel(error)) {
        console.warn("Cancelled axios request");
      }

      console.warn(error.message);

      dispatch({
        type: LocalCartTypes.DELETE_CART_ITEM_ERROR,
        payload: error.message,
      });
    });

    dispatch({ type: LocalCartTypes.DELETE_CART_ITEM_DELETED });

    cartDispatch(deleteLocalCartItem(id));
  };
}

export function addOrder(
  currentLocalUserID,
  cartDispatch,
  resetCart,
  isAuthenticated,
  userToken,
) {
  return async function thunk(dispatch) {
    if (currentLocalUserID) {
      dispatch({ type: LocalCartTypes.ADD_ORDER_LOADING });

      await axios({
        url: `http://localhost:4000/api/orders`,
        method: "post",
        headers:
          isAuthenticated && userToken
            ? {
                Authorization: `Bearer ${userToken}`,
              }
            : null,
        validateStatus: (status) => {
          // @see https://github.com/axios/axios#request-config
          if (status === 201) {
            return true;
          }
          if (status > 400) {
            return false;
          }
        },
      }).catch((error) => {
        if (axios.isCancel(error)) {
          console.warn("Cancelled axios request");
        }

        console.warn(error.message);

        dispatch({
          type: LocalCartTypes.ADD_ORDER_ERROR,
          payload: error.message,
        });
      });

      cartDispatch(resetCart());

      dispatch({ type: LocalCartTypes.ADD_ORDER_ADDED });
    }
  };
}

export function updateCartItem(
  id,
  quantity,
  cartDispatch,
  updateLocalCartItem,
  isAuthenticated,
  userToken,
) {
  return async function thunk(dispatch) {
    dispatch({ type: LocalCartTypes.UPDATE_CART_ITEM_LOADING });

    await axios({
      url: `http://localhost:4000/api/cart/${id}`,
      method: "patch",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          isAuthenticated && userToken ? `Bearer ${userToken}` : ``,
      },
      data: JSON.stringify({
        quantity: quantity,
      }),
      validateStatus: (_status) => {
        // Fix for Axios not returning response for POST on 500 error
        // @see https://github.com/axios/axios#request-config
        return true;
      },
    }).catch((error) => {
      if (axios.isCancel(error)) {
        console.warn("Cancelled axios request");
      }

      console.warn(error.message);

      dispatch({
        type: LocalCartTypes.UPDATE_CART_ITEM_ERROR,
        payload: error.message,
      });
    });

    dispatch({ type: LocalCartTypes.UPDATE_CART_ITEM_UPDATED });

    cartDispatch(updateLocalCartItem(id, quantity));
  };
}
