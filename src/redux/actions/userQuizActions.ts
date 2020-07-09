import { GO_NEXT_QUESTION, START_QUIZ, END_QUIZ } from "../constants";
import { Uanswer} from '../reducers/UquizReducer';

  //---------Generic Action
  export interface Action {
    type: string;
    payload?: {};
    params?: {};
  }

    /////////GoNextQuestion
    export interface GoNextQuestionAction extends Action {
      payload: GoNextQuestionPayload;
  }
    export interface GoNextQuestionPayload{
      uAnswer: Uanswer;
  }

const ActionCreators = {
  goNextQuestion: (payload: GoNextQuestionPayload) => ({ type: GO_NEXT_QUESTION, payload: payload}),
  startQuiz: () => ({ type: START_QUIZ}),
  endQuiz: () => ({ type: END_QUIZ}),
  }

  export default ActionCreators;