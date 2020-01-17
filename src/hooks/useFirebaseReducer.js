import { useReducer } from "react";
import useLogger from "./useLogger";
import useThunk from "./useThunk";
import { composeReducers } from "../utils/helpers";

import {
  FirebaseTypes,
  FirebaseInitialState,
  FirebaseReducer,
} from "../reducers/firebase";

function useFirebaseReducer() {
  const [state, dispatch] = composeReducers(
    useThunk,
    useLogger,
    useReducer(FirebaseReducer, FirebaseInitialState),
  );

  return [state, dispatch, FirebaseTypes];
}

export default useFirebaseReducer;
