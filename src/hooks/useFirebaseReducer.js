import { useReducer } from "react";

function useFirebaseReducer() {
  const types = {
    SIGN_UP: "SIGN_UP",
    SIGN_OUT: "SIGN_OUT",
    UPDATE_CURRENT_USER: "UPDATE_CURRENT_USER",
  };

  const initialState = {
    localAuth: {
      isAuthenticated: false,
      isSignedOut: false,
      userToken: null,
      currentLocalUser: {
        id: null,
        displayName: null,
        email: null,
        role: null,
        photoURL: null,
      },
    },
  };

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case types.SIGN_UP: {
        return {
          ...state,
          localAuth: {
            ...state.localAuth,
            isSignedOut: false,
            isAuthenticated: true,
            userToken: payload.userToken,
            currentLocalUser: {
              ...state.localAuth.currentLocalUser,
              ...payload.data,
            },
          },
        };
      }
      case types.UPDATE_CURRENT_USER: {
        return {
          ...state,
          localAuth: {
            ...state.localAuth,
            currentLocalUser: {
              ...state.localAuth.currentLocalUser,
              displayName: payload.displayName
                ? payload.displayName
                : state.localAuth.currentLocalUser.displayName,
              photoURL: payload.photoURL
                ? payload.photoURL
                : state.localAuth.currentLocalUser.photoURL,
            },
          },
        };
      }
      case types.SIGN_OUT: {
        return {
          ...initialState,
          localAuth: {
            isSignedOut: true,
          },
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return [state, dispatch, types];
}

export default useFirebaseReducer;
