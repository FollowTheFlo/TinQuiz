import {QwantArticle} from './../store';

import{
START_QWANT_SEARCH,
END_QWANT_SEARCH,
QWANT_SELECT,
QWANT_DELETE,
CHANGE_PROXY,
SHOW_QWANT_ERROR,
CLEAR_QWANT_ERROR,
} from "./../constants";

import {
    StartQwantSearchAction,
    EndQwantSearchAction
  } from "./../actions/qwantActions";

import { Action } from './../actions';

  export interface QwantState {
    qwantArticles: QwantArticle[];
    qwantLoad?: boolean;
    target:string;
    proxyActivated:boolean;
    errorMessage:string
  }
  
  const initialState = {
    qwantLoad: false,
    qwantArticles:[],
    target: 'Quebec',
    proxyActivated:true,
    errorMessage:'',
  };

export const qwantReducer = (state:QwantState = initialState, action: Action):QwantState => {


  switch (action.type) {
    
      case START_QWANT_SEARCH: {
        const startQwantSearchAction = action as StartQwantSearchAction;
        console.log('REDUCER - START_QWANT_SEARCH: ', action.params);
        return {
            
          ...state, qwantLoad: true, target: startQwantSearchAction.params.target
        };
      }
      case END_QWANT_SEARCH: {        
        const endQwantSearchAction = action as EndQwantSearchAction;
        console.log('REDUCER - END_QWANT_SEARCH: ', action.payload);     
        return {
          ...state, qwantLoad: false, qwantArticles : endQwantSearchAction.payload.qwantArticles
        };
      }
      case QWANT_DELETE: {        
        console.log('REDUCER - QWANT_DELETE: ', action.payload);
        const updatedArray = state.qwantArticles.filter( article => {
            return article.id !== action.payload;
            } );
            
        return {
          ...state, qwantArticles: updatedArray
        };
      }
      case QWANT_SELECT: {        
        console.log('REDUCER - QWANT_SELECT: ', action.payload);
        const selectedArticleIndex = state.qwantArticles.findIndex( article => {
            return article.id === action.payload;
            } );
            
        //if articleID not found, return existing state    
        if(selectedArticleIndex === -1) {
            console.log('could not find selected article');
            return {
                ...state
              };
        }
        const updatedArticles = [...state.qwantArticles] ;
        //unselect all, mutate updatedArticles as it is a copy
        updatedArticles.forEach(article => article.selected = false);
        //select target article
        updatedArticles[selectedArticleIndex].selected = true;
            
        return {
          ...state, qwantArticles: updatedArticles
        };
      }
      case CHANGE_PROXY: {        
        console.log('REDUCER - CHANGE_PROXY: ', action.payload);
             
        return {
          // @ts-ignore
          ...state, proxyActivated: action.payload
        };
      }
      case SHOW_QWANT_ERROR: {
        console.log('REDUCER - SHOW_QWANT_ERROR: ', action.payload);
        return {
            // @ts-ignore
          ...state, errorMessage: action.payload, loading:false
        };
      }
      case CLEAR_QWANT_ERROR: {
        console.log('REDUCER - CLEAR_QWANT_ERROR ');
        return {
            // @ts-ignore
          ...state, errorMessage: "", qwantLoad:false
        };
      }
     

    

    default:
      return state;
  }
}
