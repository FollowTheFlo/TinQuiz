import geoActions from './geoActions';
import qwantActions from './qwantActions';
import quizActions from './quizActions';
import userQuizActions from './userQuizActions';

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
    userQuizActions,
}



export default ActionCreators;