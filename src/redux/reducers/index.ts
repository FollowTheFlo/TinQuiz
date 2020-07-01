import { combineReducers } from "redux";

import { locationReducer, GeoState } from "./GeoReducer";
import { qwantReducer, QwantState } from "./QwantReducer";
import { quizReducer, QuizState } from "./QuizReducer";
import { uQuizReducer, UquizState} from './UquizReducer';

export type RootState = {
  qwant: QwantState;
  geo: GeoState;
  quiz: QuizState;
  uQuiz: UquizState;
};

const reducers = combineReducers({
  qwant:qwantReducer,
  geo:locationReducer,
  quiz:quizReducer,
  uQuiz:uQuizReducer,
});

export default reducers;
