import { useContext, useEffect } from "react";
import axios from "axios";

import { LocalAuthContext } from "../context/localAuth";
import useOrdersReducer from "./useOrdersReducer";

/**
 * Orders state hook.
 *
 * @returns [state, dispatch, actions, types]
 */
function useOrders() {
  const { localAuth: { isAuthenticated, userToken } = {} } = useContext(
    LocalAuthContext,
  );
  const [state, dispatch, actions, types] = useOrdersReducer();
  const { dataFetched } = state;

  const { fetchData } = actions;

  useEffect(() => {
    let source = axios.CancelToken.source();
    let mounted = true;

    if (mounted && !dataFetched && isAuthenticated && userToken) {
      dispatch(fetchData(isAuthenticated, userToken));
    }

    return () => {
      mounted = false;
      source.cancel();
    };
  }, [dataFetched, dispatch, fetchData, isAuthenticated, userToken]);

  return [state, dispatch, actions, types];
}

export default useOrders;
