import { useReducer } from "react";
import useLoggingThunkReducer from "./useLoggingThunkReducer";

import {
  FirebaseTypes,
  FirebaseInitialState,
  FirebaseReducer,
} from "../reducers/firebase";

function useFirebaseReducer() {
  const [state, dispatch] = useLoggingThunkReducer(
    useReducer(FirebaseReducer, FirebaseInitialState),
  );

  return [state, dispatch, FirebaseTypes];
}

export default useFirebaseReducer;
