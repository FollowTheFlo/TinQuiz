import { GO_NEXT_QUESTION, START_QUIZ } from "../constants";

  //---------Generic Action
  export interface Action {
    type: string;
    payload?: {};
    params?: {};
  }

const ActionCreators = {
  goNextQuestion: () => ({ type: GO_NEXT_QUESTION}),
  startQuiz: () => ({ type: START_QUIZ}),
  }

  export default ActionCreators;