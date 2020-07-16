import { GO_NEXT_QUESTION, START_QUIZ, END_QUIZ, SHOW_QUIZ } from "../constants";
import { Uanswer} from '../reducers/UquizReducer';
import { Quiz } from "../reducers/QuizReducer";

  //---------Generic Action
  export interface Action {
    type: string;
    payload?: {};
    params?: {};
  }

    /////////Start Quiz
    export interface StartQuizAction extends Action {
      payload: StartQuizPayload;
  }
    export interface StartQuizPayload{
      quiz: Quiz;
  }
    /////////End Quiz
    export interface EndQuizAction extends Action {
      payload: EndQuizPayload;
  }
    export interface EndQuizPayload{
      quiz: Quiz;
  }
    /////////GoNextQuestion
    export interface GoNextQuestionAction extends Action {
      payload: GoNextQuestionPayload;
  }
    export interface GoNextQuestionPayload{
      uAnswer: Uanswer;
  }

   /////////ShowQuiz
   export interface ShowQuizAction extends Action {
    payload: boolean;
}


const ActionCreators = {
  goNextQuestion: (payload: GoNextQuestionPayload) => ({ type: GO_NEXT_QUESTION, payload: payload}),
  startQuiz: () => ({ type: START_QUIZ }),
  endQuiz: (payload: StartQuizPayload) => ({ type: END_QUIZ, payload: payload}),
  showQuiz: (payload: boolean) => ({ type: SHOW_QUIZ, payload: payload})
  }

  export default ActionCreators;