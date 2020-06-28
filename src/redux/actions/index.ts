import geoActions from './geoActions';
import qwantActions from './qwantActions';
import quizActions from './quizActions';

//---------Generic Action
export interface Action {
    type: string;
    payload?: {};
    params?: {};
  }
  
const ActionCreators = {
    qwantActions,
    geoActions,
    quizActions,
}



export default ActionCreators;