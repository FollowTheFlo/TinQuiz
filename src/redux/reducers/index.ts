import { combineReducers } from "redux";

import { locationReducer, GeoState } from "./GeoReducer";
import { qwantReducer, QwantState } from "./QwantReducer";

export type RootState = {
  qwant: QwantState;
  geo: GeoState;
};

const reducers = combineReducers({
  qwant:qwantReducer,
  geo:locationReducer, 
});

export default reducers;
