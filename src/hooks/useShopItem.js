import { useContext, useEffect } from "react";

import { LocalAuthContext } from "../context/localAuth";
import useShopItemReducer from "./useShopItemReducer";
import { useParams } from "react-router-dom";

/**
 * Shop item state hook.
 *
 * @returns [state, dispatch, actions, types]
 */
function useShopItem() {
  const { localAuth: { isAuthenticated, userToken } = {} } = useContext(
    LocalAuthContext,
  );

  let { id: shopItemID } = useParams();

  const [state, dispatch, actions, types] = useShopItemReducer();

  const { initialFetchDone } = state;
  const { fetchData } = actions;

  useEffect(() => {
    let mounted = true;

    if (mounted && !initialFetchDone) {
      dispatch(fetchData(isAuthenticated, userToken, shopItemID));
    }

    return () => (mounted = false);
  }, [
    dispatch,
    fetchData,
    initialFetchDone,
    isAuthenticated,
    shopItemID,
    userToken,
  ]);

  return [state, dispatch, actions, types];
}

export default useShopItem;
