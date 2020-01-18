import useLogger from "./useLogger";
import useThunk from "./useThunk";
import { composeReducers } from "../utils/helpers";

/**
 * Runs `useLogger` and `useThunk` middleware React hooks
 *
 * @param {reducer} reducer The useReducer hook from React
 *
 * @example
 *
 * const [state, dispatch] = useLoggingThunkReducer(
 *   useReducer(CartReducer, CartInitialState),
 * );
 */
function useLoggingThunkReducer(reducer) {
  return composeReducers(useThunk, useLogger, reducer);
}

export default useLoggingThunkReducer;
