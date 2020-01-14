import React, { createContext } from "react";

import useFirebaseAuth from "../hooks/useFirebaseAuth";

export const LocalAuthContext = createContext();

function AuthProvider({ children }) {
  const [state, dispatch, types] = useFirebaseAuth();

  return (
    <LocalAuthContext.Provider value={{ localAuth: state, dispatch, types }}>
      {children}
    </LocalAuthContext.Provider>
  );
}

export default AuthProvider;
