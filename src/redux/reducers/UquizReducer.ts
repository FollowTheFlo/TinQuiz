import { Choice } from './ChoiceReducer';
import { Action } from '../actions/quizActions';
import { GoNextQuestionAction } from '../actions/userQuizActions';
import { GO_NEXT_QUESTION, START_QUIZ, END_QUIZ } from '../constants';
import { Question } from './QuizReducer';

export interface Uanswer {
  question: Question;
  answer: boolean;
  isCorrect: boolean;
}

export interface UquizState {
   questionIndex:number;
   uAnswers:Uanswer[];
   isFinished:boolean;
   score:number;
}

const initialState = {
    questionIndex:0,
    uAnswers:[],
    isFinished:false,
    score:0
}

export const uQuizReducer =  (state:UquizState = initialState, action: Action): UquizState => {

    switch (action.type) {
        case GO_NEXT_QUESTION: {
          const goNextQuestionAction = action as GoNextQuestionAction;
            console.log('REDUCER - GO_NEXT_QUESTION: '); 
            return {              
                  ...state, questionIndex: state.questionIndex + 1,
                  uAnswers: state.uAnswers.concat(goNextQuestionAction.payload.uAnswer)
            };
          }
        
        case START_QUIZ: {
            console.log('REDUCER - START_QUIZ: '); 
            return {              
                  ...state, questionIndex: 0,
                  uAnswers: []
            };
          }
          case END_QUIZ: {
            console.log('REDUCER - END_QUIZ: '); 
            return {              
                  ...state, isFinished:true
            };
          }
        
        default:
         return state;
        }
    }