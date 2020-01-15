import useShopItemsReducer from "./useShopItemsReducer";
import { useEffect } from "react";

/**
 * Shop items state hook.
 *
 * @returns [state, dispatch, actions, types]
 */
function useShopItems() {
  const [state, dispatch, actions, types] = useShopItemsReducer();

  const { dataFetched } = state;
  const { fetchShopItems } = actions;

  useEffect(() => {
    let mounted = true;

    if (!dataFetched && mounted) {
      dispatch(fetchShopItems());
    }

    return () => (mounted = false);
  }, [dataFetched, dispatch, fetchShopItems]);

  return [state, dispatch, actions, types];
}

export default useShopItems;
