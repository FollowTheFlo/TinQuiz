import { Choice } from './ChoiceReducer';
import { Action } from '../actions/quizActions';
import { GO_NEXT_QUESTION, START_QUIZ } from '../constants';

export interface UquizState {
   questionIndex:number;
}

const initialState = {
    questionIndex:0
}

export const uQuizReducer =  (state:UquizState = initialState, action: Action): UquizState => {

    switch (action.type) {
        case GO_NEXT_QUESTION: {
            console.log('REDUCER - GO_NEXT_QUESTION: '); 
            return {              
                  ...state, questionIndex: state.questionIndex + 1
            };
          }
        
        case START_QUIZ: {
            console.log('REDUCER - START_QUIZ: '); 
            return {              
                  ...state, questionIndex: 0
            };
          }
        default:
         return state;
        }
    }