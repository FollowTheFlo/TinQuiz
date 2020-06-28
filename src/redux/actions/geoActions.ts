import { Location } from './../reducers/GeoReducer';
import{
  START_LOCATION,
  END_LOCATION,
  SHOW_GEO_ERROR,
  CLEAR_GEO_ERROR,
  FILL_QUIZ,
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


  //------------EndLocationAction
  export interface EndLocationAction extends Action {
      payload: EndLocationPayload
  }
  export interface EndLocationPayload{
          location: Location;
  }

  const ActionCreators = {
    startLocation: () => ({ type: START_LOCATION}),   
    endLocation: (payload: EndLocationPayload) => ({ type: END_LOCATION,payload: payload}),
    showGeoErrorMessage: (payload: string ) => ({ type: SHOW_GEO_ERROR, payload: payload }),
    clearGeoErrorMessage: () => ({ type: CLEAR_GEO_ERROR}),
    fillQuiz: (payload: Location) => ({ type: FILL_QUIZ, payload: payload}),
  }

  export default ActionCreators;