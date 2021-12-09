import { combineReducers } from "redux";

import { locationReducer, GeoState } from "./GeoReducer";
import { quizReducer, QuizState } from "./QuizReducer";
import { uQuizReducer, UquizState } from "./UquizReducer";

export type RootState = {
  geo: GeoState;
  quiz: QuizState;
  uQuiz: UquizState;
};

const reducers = combineReducers({
  geo: locationReducer,
  quiz: quizReducer,
  uQuiz: uQuizReducer,
});

export default reducers;
