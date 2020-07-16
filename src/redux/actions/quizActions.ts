import { FILL_QUIZ, FILL_DISTRACTOR, FILL_QUESTION, IGNORE_QUESTION, RUN_QUESTION, RUN_DISTRACTOR, RUN_QUESTIONS_LIST, END_QUESTIONS_LIST, CLEAR_QUESTIONS_LIST, SET_QUIZ_ID, RUN_FLAGS, FILL_FLAGS, SELECT_FLAG, LAUNCH_QUIZ } from "../constants";
import { Location } from "../reducers/GeoReducer";
import { Distractor, Question, Flag } from "../reducers/QuizReducer";

  //---------Generic Action
  export interface Action {
    type: string;
    payload?: {};
    params?: {};
  }

 

  /////////FillQuiz
  export interface FillQuizAction extends Action {
    payload: FillQuizPayload;
}
  export interface FillQuizPayload{
    location: Location;
}

/////////SetQuizId
export interface SetQuizIdAction extends Action {
  payload: SetQuizIdPayload;
}
export interface SetQuizIdPayload{
  quizId: string;
}

  /////////RunDistractor
  export interface RunDistractorAction extends Action {
    payload: RunDistractorPayload;
}
  export interface RunDistractorPayload{
    location: Location;
}


 /////////FillDistractor
 export interface FillDistractorAction extends Action {
    payload: FillDistractorPayload;
}
  export interface FillDistractorPayload{
    distractor: Distractor;
}

/////////FillQuestion
export interface FillQuestionAction extends Action {
  payload: FillQuestionPayload;
}
export interface FillQuestionPayload{
  question: Question;
}
/////
export interface QuestionParams {
  topic: string;
  type: string;
  isDistractor: boolean;
}

export interface RunQuestionAction extends Action {
  params: QuestionParams
}

///fillFlags
export interface FillFlagsAction extends Action {
  payload: FillFlagsPayload
}
export interface FillFlagsPayload {
  flags:Flag[]
}

///Select Flag
export interface SelectFlagAction extends Action {
  payload: SelectFlagPayload
}
export interface SelectFlagPayload {
  WdCode:string
}

///Run Question List
export interface RunQuestionsListAction extends Action {
  params: RunQuestionsListParams
}
export interface RunQuestionsListParams {
  theme:string
}

///Launch quiz
export interface LaunchQuizAction extends Action {
  params: LaunchQuizParams
}
export interface LaunchQuizParams {
  theme:string
}


const ActionCreators = {
  runDistractor: (payload: RunDistractorPayload) => ({ type: RUN_DISTRACTOR, payload: payload}),

    fillQuiz: (payload: FillQuizPayload) => ({ type: FILL_QUIZ, payload: payload}),
    setQuizId: (payload: SetQuizIdPayload) => ({ type: SET_QUIZ_ID, payload: payload}),
    fillDistractors: (payload: FillDistractorPayload) => ({ type: FILL_DISTRACTOR, payload: payload}),
    fillQuestion: (payload: FillQuestionPayload) => ({ type: FILL_QUESTION, payload: payload}),
    ignoreQuestion: () => ({ type: IGNORE_QUESTION}),
    runQuestion: (params:QuestionParams) => ({ type: RUN_QUESTION, params: params}),
    runQuestionsList: (params:RunQuestionsListParams) => ({ type: RUN_QUESTIONS_LIST, params: params}),
    launchQuiz: (params:LaunchQuizParams) => ({ type: LAUNCH_QUIZ, params: params}),
    endQuestionsList: () => ({ type: END_QUESTIONS_LIST}),
    clearQuestionsList: () => ({ type: CLEAR_QUESTIONS_LIST}),
    runFlags: () => ({ type: RUN_FLAGS}),
    fillFlags: (payload: FillFlagsPayload) => ({ type: FILL_FLAGS, payload: payload}),
    selectFlag: (payload: SelectFlagPayload) => ({ type: SELECT_FLAG, payload: payload}),
  }

  export default ActionCreators;