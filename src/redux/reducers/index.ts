import { combineReducers } from "redux";

import { locationReducer, GeoState } from "./GeoReducer";
import { qwantReducer, QwantState } from "./QwantReducer";
import { quizReducer, QuizState } from "./QuizReducer";

export type RootState = {
  qwant: QwantState;
  geo: GeoState;
  quiz: QuizState;
};

const reducers = combineReducers({
  qwant:qwantReducer,
  geo:locationReducer,
  quiz:quizReducer,
});

export default reducers;
