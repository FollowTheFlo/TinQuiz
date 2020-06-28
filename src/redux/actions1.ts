import { QwantArticle } from './store';
import { Location } from './reducers/GeoReducer';
import{
  START_LOCATION,
  END_LOCATION,
  START_QWANT_SEARCH,
  END_QWANT_SEARCH,
  QWANT_SELECT,
  QWANT_DELETE,
  CHANGE_PROXY,
  SHOW_QWANT_ERROR,
  CLEAR_QWANT_ERROR,
  SHOW_GEO_ERROR,
  CLEAR_GEO_ERROR,
  FILL_QUIZ,
  } from "./constants";


  export interface Coordinates {
    lat: string;
    lng: string;
  }

  //---------Generic Action
  export interface Action {
    type: string;
    payload?: {};
    params?: {};
  }

  //----------StartQwantSearchAction
  export interface StartQwantSearchAction extends Action {
      params: StartQwantSearchParams
    }
    export interface StartQwantSearchParams {
      target: string;
      locale: string
  }

  //-----------EndQwantSearchAction
  export interface EndQwantSearchAction extends Action {
      payload: EndQwantSearchPayload;
  }
  export interface EndQwantSearchPayload{
      qwantArticles: QwantArticle[];
  }

  //------------EndLocationAction
  export interface EndLocationAction extends Action {
      payload: EndLocationPayload
  }
  export interface EndLocationPayload{
          location: Location;
  }

  export const ActionCreators = {
    endQwantSearch: (payload: EndQwantSearchPayload) => ({ type: END_QWANT_SEARCH, payload: payload}),
    startQwantSearch: (params: StartQwantSearchParams ) => ({ type: START_QWANT_SEARCH, params: params }),
    deleteQwantArticle: (payload: string ) => ({ type: QWANT_DELETE, payload: payload }),
    selectQwantArticle: (payload: string ) => ({ type: QWANT_SELECT, payload: payload }),
    startLocation: () => ({ type: START_LOCATION}),   
    endLocation: (payload: EndLocationPayload) => ({ type: END_LOCATION,payload: payload}),
    showQwantErrorMessage: (payload: string ) => ({ type: SHOW_QWANT_ERROR, payload: payload }),
    clearQwantErrorMessage: () => ({ type: CLEAR_QWANT_ERROR}),
    showGeoErrorMessage: (payload: string ) => ({ type: SHOW_GEO_ERROR, payload: payload }),
    clearGeoErrorMessage: () => ({ type: CLEAR_GEO_ERROR}),
    changeProxyActivation: (payload: boolean) => ({ type: CHANGE_PROXY, payload: payload}),
    fillQuiz: (payload: Location) => ({ type: FILL_QUIZ, payload: payload}),
  }
