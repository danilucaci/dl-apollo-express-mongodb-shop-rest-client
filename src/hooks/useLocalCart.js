import useLocalCartReducer from "./useLocalCartReducer";

/**
 * Local cart items state hook.
 *
 * @returns [state, dispatch, actions, types]
 */
function useLocalCart() {
  const [state, dispatch, actions, types] = useLocalCartReducer();

  return [state, dispatch, actions, types];
}

export default useLocalCart;
