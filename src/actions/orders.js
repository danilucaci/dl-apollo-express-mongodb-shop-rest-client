import { OrdersTypes } from "../reducers/orders";
import axios from "axios";

export function fetchData(isAuthenticated, userToken) {
  return async function thunk(dispatch) {
    dispatch({ type: OrdersTypes.FETCH_START });

    const { data: { data, error } = {} } =
      (await axios
        .get("http://localhost:4000/api/orders", {
          headers:
            isAuthenticated && userToken
              ? {
                  Authorization: `Bearer ${userToken}`,
                }
              : null,
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
            console.warn("Cancelled orders axios request");
          }

          console.warn(error.message);

          dispatch({ type: OrdersTypes.SET_ERROR, payload: error.message });
        })) || {};

    if (error) {
      dispatch({ type: OrdersTypes.SET_ERROR, payload: error.message });
    }

    if (data && !error) {
      dispatch({ type: OrdersTypes.FETCH_DONE, payload: data });
    }
  };
}
