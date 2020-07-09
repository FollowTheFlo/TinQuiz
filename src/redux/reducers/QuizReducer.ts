import {
    Action,
  } from "../actions";
import { Location } from "./GeoReducer";

import{
    FILL_QUIZ,
    FILL_DISTRACTOR,
    RUN_DISTRACTOR,
    IGNORE_QUESTION,
    RUN_QUESTION,
    END_QUESTIONS_LIST,
    CLEAR_QUESTIONS_LIST,
    FILL_QUESTION,
    SET_QUIZ_ID
    } from "./../constants";
import { FillQuizAction, FillDistractorAction, FillQuestionAction, RunDistractorAction, SetQuizIdAction } from "../actions/quizActions";

export interface Quiz {
    id: string;
    subject: string;
    locale: string;
    questions: Question[];
    distractor: Distractor;
    location: Location;
  };

export interface Distractor {
    place: string;
    placeWD: string;
    region: string;
    regionWD: string;
    country: string;
    countryWD: string;
}

  export interface Question {
      id: string;
      geoType: string;
      theme: string
      phrase: string;
      subPhrase: string;
      correct: boolean;
      correctArea: string;
      image: string;
      label: string;
  }

  export interface QuizState {
    quiz: Quiz,
    errorMessage: string,
    loading: boolean,
  }

  const initialState = {
      quiz: {
        id: '0',
        subject: 'yo',
        locale: 'en',
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
            place: 'Montreal',
            placeWD: 'Q340',
            region: 'Quebec',
            regionWD: 'Q176',
            country: 'United Kingdom',
            countryWD: 'Q145',
        },
    },
      errorMessage:'',
      loading:false,
  }

  export const quizReducer =  (state:QuizState = initialState, action: Action): QuizState => {

    switch (action.type) {
        case FILL_QUIZ: {
            console.log('REDUCER - FILL_QUIZ: ');

            const fillQuizAction = action as FillQuizAction;
            return {              
                  ...state, loading:true, quiz: {
                    ...state.quiz,
                    location: fillQuizAction.payload.location,
                    subject: `${fillQuizAction.payload.location.place} - ${fillQuizAction.payload.location.region} - ${fillQuizAction.payload.location.country}`
                  }
            };
          }
          case SET_QUIZ_ID: {
            console.log('REDUCER - SET_QUIZ_ID: ');
            const setQuizIdAction = action as SetQuizIdAction;
            return {              
                  ...state, quiz: {
                    ...state.quiz,
                    id:setQuizIdAction.payload.quizId
                  }
            };
          }
          case RUN_DISTRACTOR: {
            console.log('REDUCER - RUN_DISTRACTOR: ');

            const runDistractorAction = action as RunDistractorAction;
            return {              
                  ...state, loading:true, quiz: {
                    ...state.quiz,
                    location: runDistractorAction.payload.location,
                    subject: `${runDistractorAction.payload.location.place} - ${runDistractorAction.payload.location.region} - ${runDistractorAction.payload.location.country}`
                  }
            };
          }
        case FILL_DISTRACTOR: {
          console.log('REDUCER - FILL_DISTRACTOR: ');
          const fillDistractorAction = action as FillDistractorAction;
          return {  
              ...state, loading: false, quiz: {
                ...state.quiz,
                location: {...state.quiz.location},
                distractor: fillDistractorAction.payload.distractor,
              }
          };
          }
        case RUN_QUESTION: {
          console.log('REDUCER - IGNORE_QUESTION: ');
          
          return {  
              ...state, loading:true
          };
        }
        case END_QUESTIONS_LIST: {
          console.log('REDUCER - END_QUESTIONS_LIST: ');
          
          return {  
              ...state, loading:false
          };
        }
        case CLEAR_QUESTIONS_LIST: {
          console.log('REDUCER - CLEAR_QUESTIONS_LIST: ');
          
          return {  
              ...state, loading:false, quiz: {
                ...state.quiz,
                location: {...state.quiz.location},
                distractor: {...state.quiz.distractor},
                questions: []
              }
          };
        }
        case FILL_QUESTION: {
        console.log('REDUCER - FILL_QUESTIONS: ');
        const fillDistractorAction = action as FillQuestionAction;
        //copy of existing question
        const questions = state.quiz.questions.map(q =>{ 
         return {...q}
        });
        const updatedQuestions = questions.concat(fillDistractorAction.payload.question);
        return {  
            ...state, loading: false, quiz: {
              ...state.quiz,
              location: {...state.quiz.location},
              distractor: {...state.quiz.distractor},
              questions: updatedQuestions
            }
        };
        }
        case IGNORE_QUESTION: {
          console.log('REDUCER - IGNORE_QUESTION: ');
         
          return {  
              ...state
          };
          }
        default:
            return state;
    }
  }