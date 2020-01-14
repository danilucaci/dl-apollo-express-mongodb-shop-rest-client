import { useEffect, useRef } from "react";

import { auth, signOut } from "../firebase/firebase";
import useFirebaseReducer from "./useFirebaseReducer";

function useFirebaseAuth() {
  const [
    { localAuth, localAuth: { isAuthenticated } = {} },
    dispatch,
    types,
  ] = useFirebaseReducer();

  const unsuscribeFromAuth = useRef(null);

  useEffect(() => {
    unsuscribeFromAuth.current = auth.onAuthStateChanged(
      async function handleAuthChange(user) {
        if (user) {
          if (!isAuthenticated) {
            const body = JSON.stringify({
              id: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              role: "ADMIN",
            });

            const res = await fetch("http://localhost:4000/signup", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body,
            });

            if (res.ok) {
              const { data } = await res.json();
              let userToken = null;

              if (auth.currentUser) {
                userToken = await auth.currentUser.getIdToken();
              }

              dispatch({
                type: types.SIGN_UP,
                payload: { data, userToken },
              });
            }
          }
        } else {
          if (isAuthenticated) {
            signOut().then(() => dispatch({ type: types.SIGN_OUT }));
          }
        }
      },
      function handleAuthError(error) {
        console.log(error);

        if (isAuthenticated) {
          signOut().then(() => dispatch({ type: types.SIGN_OUT }));
        }
      },
    );

    return () => {
      if (unsuscribeFromAuth.current) {
        unsuscribeFromAuth.current();
      }
    };
  }, [dispatch, isAuthenticated, types.SIGN_OUT, types.SIGN_UP]);

  return [localAuth, dispatch, types];
}

export default useFirebaseAuth;
