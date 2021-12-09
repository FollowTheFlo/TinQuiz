import { Location } from "./../reducers/GeoReducer";
import {
  START_LOCATION,
  END_LOCATION,
  SHOW_GEO_ERROR,
  CLEAR_GEO_ERROR,
  SET_LOCATION_FROM_FLAG,
} from "./../constants";
import { Flag } from "../reducers/QuizReducer";

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
  payload: EndLocationPayload;
}
export interface EndLocationPayload {
  location: Location;
}

//------------SetLocationFromFlag
export interface SetLocationFromFlagAction extends Action {
  payload: SetLocationFromFlagPayload;
}
export interface SetLocationFromFlagPayload {
  flag: Flag;
}

const ActionCreators = {
  startLocation: () => ({ type: START_LOCATION }),
  setLocationFromFlag: (payload: SetLocationFromFlagPayload) => ({
    type: SET_LOCATION_FROM_FLAG,
    payload: payload,
  }),
  endLocation: (payload: EndLocationPayload) => ({
    type: END_LOCATION,
    payload: payload,
  }),
  showGeoErrorMessage: (payload: string) => ({
    type: SHOW_GEO_ERROR,
    payload: payload,
  }),
  clearGeoErrorMessage: () => ({ type: CLEAR_GEO_ERROR }),
};

export default ActionCreators;
