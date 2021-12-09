import geoActions from "./geoActions";
import quizActions from "./quizActions";
import userQuizActions from "./userQuizActions";

//---------Generic Action
export interface Action {
  type: string;
  payload?: {};
  params?: {};
}

const ActionCreators = {
  geoActions,
  quizActions,
  userQuizActions,
};

export default ActionCreators;
