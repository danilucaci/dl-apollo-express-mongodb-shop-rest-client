import { useContext, useEffect, useRef } from "react";
import axios from "axios";

import { LocalAuthContext } from "../context/localAuth";
import useOrdersReducer from "./useOrdersReducer";

function useOrders() {
  const { localAuth: { isAuthenticated, userToken } = {} } = useContext(
    LocalAuthContext,
  );
  const [state, dispatch, types] = useOrdersReducer();
  const { dataFetched } = state;
  const mounted = useRef();

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  });

  useEffect(() => {
    let source = axios.CancelToken.source();

    async function fetchData() {
      dispatch({ type: types.FETCH_START });

      const { data: { data, error } = {} } =
        (await axios
          .get("http://localhost:4000/api/orders", {
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
              console.warn("Cancelled orders axios request");
            }

            console.warn(error.message);

            if (mounted.current) {
              dispatch({ type: types.SET_ERROR, payload: error.message });
            }
          })) || {};

      if (mounted.current && error) {
        dispatch({ type: types.SET_ERROR, payload: error.message });
      }

      if (mounted.current && data && !error) {
        dispatch({ type: types.FETCH_DONE, payload: data });
      }
    }

    if (mounted.current && !dataFetched && isAuthenticated && userToken) {
      fetchData();
    }

    return () => source.cancel();
  }, [
    dataFetched,
    dispatch,
    isAuthenticated,
    types.FETCH_DONE,
    types.FETCH_START,
    types.SET_ERROR,
    userToken,
  ]);

  return [state, dispatch, types];
}

export default useOrders;
