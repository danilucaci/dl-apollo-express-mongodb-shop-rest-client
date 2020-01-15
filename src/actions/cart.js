import { CartTypes } from "../reducers/cart";
import axios from "axios";

export function resetCart() {
  return function thunk(dispatch) {
    dispatch({ type: CartTypes.RESET_CART });
  };
}

export function fetchData(isAuthenticated, userToken, source) {
  return async function thunk(dispatch) {
    dispatch({ type: CartTypes.FETCH_START });

    const { data: { data, error } = {} } = await axios
      .get("http://localhost:4000/api/cart", {
        headers:
          isAuthenticated && userToken
            ? {
                Authorization: `Bearer ${userToken}`,
              }
            : null,
        cancelToken: source.token,
        validateStatus: (_status) => {
          /**
           * Fix for Axios not returning response for POST on 500 error
           * @see https://github.com/axios/axios#request-config
           * `validateStatus` defines whether to resolve or reject the promise for a given
           * HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
           * or `undefined`), the promise will be resolved; otherwise, the promise will be
           * rejected.
           * validateStatus: function (status) {
           *   return status >= 200 && status < 300; // default
           * },
           * */
          return true;
        },
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.warn("Cancelled axios request");
        }

        console.warn(error.message);

        dispatch({ type: CartTypes.SET_ERROR, payload: error.message });
      });

    if (error) {
      dispatch({ type: CartTypes.SET_ERROR, payload: error.message });
    }

    if (data && !error) {
      dispatch({ type: CartTypes.FETCH_DONE, payload: data });
    }
  };
}

export function updateLocalCartItem(id, quantity) {
  return function thunk(dispatch) {
    dispatch({
      type: CartTypes.UPDATE_CART_ITEM,
      payload: {
        id: id,
        quantity: quantity,
      },
    });
  };
}

export function deleteLocalCartItem(id) {
  return function thunk(dispatch) {
    dispatch({
      type: CartTypes.DELETE_CART_ITEM,
      payload: {
        id: id,
      },
    });
  };
}
