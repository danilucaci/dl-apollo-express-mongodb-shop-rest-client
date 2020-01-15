import { ShopItemsTypes } from "../reducers/shopItems";

const BASE_URL = "http://localhost:4000/shop-items?limit=8";

export function fetchMore(hasNextPage) {
  return async function thunk(dispatch, state) {
    dispatch({ type: ShopItemsTypes.FETCH_START });

    const { shopItems } = state || {};

    if (hasNextPage) {
      const afterItem = shopItems.slice(-1)[0];

      const res = await fetch(`${BASE_URL}&after=${afterItem.id}`).catch((e) =>
        dispatch({ type: ShopItemsTypes.ERROR }),
      );

      if (res.ok) {
        const data = await res
          .json()
          .catch((e) => dispatch({ type: ShopItemsTypes.ERROR }));
        const { data: { shopItems, hasNextPage } = {}, errors } = data || {};

        if (errors) {
          dispatch({ type: ShopItemsTypes.ERROR });
        }

        dispatch({
          type: ShopItemsTypes.FETCHED_MORE,
          payload: {
            hasNextPage: hasNextPage,
            shopItems: shopItems,
          },
        });
      }
    }
  };
}

export function fetchShopItems() {
  return async function thunk(dispatch) {
    dispatch({ type: ShopItemsTypes.FETCH_START });

    const res = await fetch(BASE_URL).catch((e) =>
      dispatch({ type: ShopItemsTypes.ERROR }),
    );

    if (res.ok) {
      const data = await res
        .json()
        .catch((e) => dispatch({ type: ShopItemsTypes.ERROR }));
      const { data: { shopItems, hasNextPage } = {}, errors } = data || {};

      if (errors) {
        dispatch({ type: ShopItemsTypes.ERROR });
      }

      dispatch({
        type: ShopItemsTypes.FETCH_DONE,
        payload: {
          hasNextPage: hasNextPage,
          shopItems: shopItems,
        },
      });
    }
  };
}
