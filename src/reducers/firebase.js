export const FirebaseTypes = {
  SIGN_UP: "SIGN_UP",
  SIGN_OUT: "SIGN_OUT",
  UPDATE_CURRENT_USER: "UPDATE_CURRENT_USER",
};

export const FirebaseInitialState = {
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

export const FirebaseReducer = (state, { type, payload }) => {
  switch (type) {
    case FirebaseTypes.SIGN_UP: {
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
    case FirebaseTypes.UPDATE_CURRENT_USER: {
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
    case FirebaseTypes.SIGN_OUT: {
      return {
        ...FirebaseInitialState,
        localAuth: {
          isSignedOut: true,
        },
      };
    }
    default:
      return state;
  }
};
