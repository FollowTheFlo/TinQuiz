import { Choice } from './ChoiceReducer';
import { Action } from '../actions/quizActions';
import { GoNextQuestionAction, StartQuizPayload, StartQuizAction, EndQuizAction, ShowQuizAction } from '../actions/userQuizActions';
import { GO_NEXT_QUESTION, START_QUIZ, END_QUIZ, SHOW_QUIZ, EMPTY_ACTION } from '../constants';
import { Question, Quiz } from './QuizReducer';

export interface Uanswer {
  question: Question;
  answer: boolean;
  isCorrect: boolean;
}

export interface historyItem {
  id: string;
  subject: string;
  country: string;
  countryWD: string;
  theme: string;
  score: number;
  questionsCount: number;
  correctAnswersCount: number;
}

export interface UquizState {
  quiz:Quiz;
  questionIndex:number;
  isOpened:boolean;
  uAnswers:Uanswer[];
  isFinished:boolean;
  score:number;
  userId:string;
  historyItems:historyItem[];
}

const initialState = {
  quiz: {
    id: '0',
    subject: 'yo',
    locale: 'en',
    theme: 'ALL',
    questions: [],
    location: {id:'0',
        place:'Saint-James',
        region:'Manche',
        country:'France',
        placeWD:'Q478259',
        regionWD:'Q12589',
        countryWD:'Q142',
        lat:-1.325183,
        lng:48.523252},
    distractor: {
        place: ['Montreal'],
        placeWD: ['Q340'],
        region: ['Quebec'],
        regionWD: ['Q176'],
        country: ['United Kingdom'],
        countryWD: ['Q145'],
    },
},
    questionIndex:0,
    uAnswers:[],
    isFinished:false,
    isOpened:false,
    score:0,
    userId:'Flo',
    historyItems:[],
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
          case EMPTY_ACTION: {
              console.log('REDUCER - EMPTY_ACTION: '); 
              return {              
                    ...state
              };
            }
        
        case START_QUIZ: {
          
            console.log('REDUCER - START_QUIZ: '); 
            return {              
                  ...state, questionIndex: 0,
                  uAnswers: [],
                  isOpened:true,
                  isFinished:false,
                 
            };
          }
          case END_QUIZ: {
            const endQuizPayload = action as EndQuizAction;
            console.log('REDUCER - END_QUIZ: '); 
            const correctAnswersCount = state.uAnswers.filter(answer => answer.isCorrect === true).length;
            const totalAnswers = state.uAnswers.length;
            const totalScore = (Math.trunc (10000 * (correctAnswersCount / totalAnswers )))/100;
            return {              
                  ...state,
                  isFinished:true,
                  isOpened:false,
                  quiz: endQuizPayload.payload.quiz,
                  //truncate after 2 decimals
                  score: totalScore,
                  historyItems: [{
                    id: endQuizPayload.payload.quiz.id,
                    subject: endQuizPayload.payload.quiz.subject,
                    score: totalScore,
                    questionsCount: totalAnswers ,
                    correctAnswersCount: correctAnswersCount,
                    country: endQuizPayload.payload.quiz.location.country,
                    countryWD: endQuizPayload.payload.quiz.location.countryWD,
                    theme: endQuizPayload.payload.quiz.theme,
                  }].concat(state.historyItems)
            };
          }
          case SHOW_QUIZ: {
            const showQuizAction = action as ShowQuizAction;
            console.log('REDUCER - SHOW_QUIZ: ',showQuizAction.payload); 
            return {              
                  ...state, 
                  isOpened:showQuizAction.payload,
                
                 
            };
          }
        
        default:
         return state;
        }
    }