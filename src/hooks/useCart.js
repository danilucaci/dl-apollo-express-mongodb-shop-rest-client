import { useContext, useEffect } from "react";
import axios from "axios";

import { LocalAuthContext } from "../context/localAuth";
import useCartReducer from "./useCartReducer";

/**
 * Cart items state hook.
 *
 * @returns [state, dispatch, actions, types]
 */
function useCart() {
  const {
    localAuth: { isAuthenticated, userToken, isSignedOut } = {},
  } = useContext(LocalAuthContext);

  const [state, dispatch, actions, types] = useCartReducer();

  const { cartReset, dataFetched } = state;
  const { resetCart, fetchData } = actions;

  useEffect(() => {
    let mounted = true;

    if (mounted && isSignedOut && !cartReset) {
      dispatch(resetCart());
    }

    return () => (mounted = false);
  });

  useEffect(() => {
    let source = axios.CancelToken.source();

    if (!dataFetched && isAuthenticated && userToken) {
      dispatch(fetchData(isAuthenticated, userToken, source));
    }

    return () => source.cancel();
  }, [dataFetched, dispatch, fetchData, isAuthenticated, userToken]);

  return [state, dispatch, actions, types];
}

export default useCart;
