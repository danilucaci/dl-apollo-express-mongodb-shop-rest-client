import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import { getDisplayName } from "../utils/helpers";
import { LocalAuthContext } from "../context/localAuth";

/**
 * Returns the `Route` `Component` if the user is authenticated or `<Redirect to="/" />`.
 *
 * @param {function} predicate Optional function to check against the current user object.
 * @returns {function} getComponent Function that receives a Route Component.
 * @param {React.Component} Component A Route (React Component) that should be protected.
 * @returns The `Component` if the user is authenticated or `<Redirect to="/" />`.
 * @example
 *
 * Using a predicate
 * const predicate = (user) => user.role.includes("admin");
 * export default withProtectedRoute(predicate)(Inbox);
 *
 * Without a predicate
 * export default withProtectedRoute()(Inbox);
 */
function withProtectedRoute(predicate = null) {
  return function getComponent(Component) {
    Component.displayName = `WithProtectedRoute(${getDisplayName(Component)})`;

    function WrappedComponent(props) {
      const {
        localAuth: { isAuthenticated, currentLocalUser } = {},
      } = useContext(LocalAuthContext);

      // If a predicate is passed
      if (predicate) {
        /**
         * If it passes, the predicate return the `Component`
         * Otherwise redirect because the `currentLocalUser`
         * doesn’t have the necessary permissions
         */

        if (predicate(currentLocalUser)) {
          return <Component {...props} />;
        } else return <Redirect to="/" />;
      }

      // If the user is authenticated return the `Component`.
      if (isAuthenticated) {
        return <Component {...props} />;
      }

      // If the user is not authenticated redirect home.
      return <Redirect to="/" />;
    }

    return WrappedComponent;
  };
}

export default withProtectedRoute;
