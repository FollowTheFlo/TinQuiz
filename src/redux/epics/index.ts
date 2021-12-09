import { locationEpic } from "./geoEpics";
import {
  quizEpic,
  questionEpic,
  runQuestionListEpic,
  FillQuizEpic,
  RunFlagsEpic,
  launchQuizEpic,
  fillDistractorEpic,
} from "./quizEpics";
import { combineEpics } from "redux-observable";
import { goNextQuestionEpic, endQuizEpic, startAppEpic } from "./userQuizEpics";

const AllEpics = combineEpics(
  locationEpic,
  quizEpic,
  questionEpic,
  runQuestionListEpic,
  FillQuizEpic,
  RunFlagsEpic,
  launchQuizEpic,
  fillDistractorEpic,
  goNextQuestionEpic,
  endQuizEpic,
  startAppEpic
);

export default AllEpics;
