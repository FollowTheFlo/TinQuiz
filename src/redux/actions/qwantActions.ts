import { QwantArticle } from './../store';
import{

  START_QWANT_SEARCH,
  END_QWANT_SEARCH,
  QWANT_SELECT,
  QWANT_DELETE,
  CHANGE_PROXY,
  SHOW_QWANT_ERROR,
  CLEAR_QWANT_ERROR,

  } from "./../constants";


  export interface Coordinates {
    lat: string;
    lng: string;
  }

  //---------Generic Action
  interface Action {
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

  const ActionCreators = {
    endQwantSearch: (payload: EndQwantSearchPayload) => ({ type: END_QWANT_SEARCH, payload: payload}),
    startQwantSearch: (params: StartQwantSearchParams ) => ({ type: START_QWANT_SEARCH, params: params }),
    deleteQwantArticle: (payload: string ) => ({ type: QWANT_DELETE, payload: payload }),
    selectQwantArticle: (payload: string ) => ({ type: QWANT_SELECT, payload: payload }),
    showQwantErrorMessage: (payload: string ) => ({ type: SHOW_QWANT_ERROR, payload: payload }),
    clearQwantErrorMessage: () => ({ type: CLEAR_QWANT_ERROR}),
    changeProxyActivation: (payload: boolean) => ({ type: CHANGE_PROXY, payload: payload}),

  }

  export default ActionCreators;