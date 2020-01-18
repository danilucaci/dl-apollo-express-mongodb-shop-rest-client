export function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export function formatMoney(amount = 0) {
  const options = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  };

  if (amount % 100 === 0) options.minimumFractionDigits = 0;

  const formatted = new Intl.NumberFormat("en-US", options).format(
    amount / 100,
  );

  return formatted;
}

export function calculateCartTotal(cart = []) {
  return cart.reduce(
    (accum, curr) => curr.quantity * curr.item.price + accum,
    0,
  );
}

export function calculateItemTotal(cartItem = {}) {
  return cartItem.item.price * cartItem.quantity;
}

export function formatOrderDate(date) {
  const newDateFromDateSent = new Date(date);

  const dateOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "Europe/Madrid",
  };

  const formattedDate = newDateFromDateSent.toLocaleDateString(
    "en-US",
    dateOptions,
  );

  return formattedDate;
}

export function getCartSize(arr = []) {
  return arr.reduce((accum, curr) => accum + curr.quantity, 0);
}

/**
 * Calls the functions from right to left with the result of calling the `useReducer` hook.
 *
 * Same as calling: const [state, dispatch] = useThunk(useLogger(useReducer(reducer, initialState)));
 *
 * @param {Array} Functions The functions to call with the result of calling the `useReducer` hook
 * @param {Array} [state, dispatch] The result of calling the `useReducer` hook
 *
 * @example
 * composeReducers(useThunk, useLogger)([state, dispatch])
 *
 * @returns {function} getStateAndDispatch A new function to get the result of calling the `useReducer` hook.
 * @returns [state, dispatch] Enhanced `[state, dispatch]` after calling the middleware functions.
 */
export function composeReducers(...fns) {
  return function getStateAndDispatch([state, dispatch]) {
    return fns.reduceRight(([state, dispatch], fn) => fn([state, dispatch]), [
      state,
      dispatch,
    ]);
  };
}
