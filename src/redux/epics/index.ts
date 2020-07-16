import {qwantEpic} from './qwantEpics';
import {locationEpic} from './geoEpics';
import {quizEpic,questionEpic, runQuestionListEpic, FillQuizEpic, RunFlagsEpic, launchQuizEpic, fillDistractorEpic} from './quizEpics';
import { combineEpics } from 'redux-observable';

  const AllEpics = combineEpics(
    qwantEpic,
    locationEpic,
    quizEpic,
    questionEpic,
    runQuestionListEpic,
    FillQuizEpic,
    RunFlagsEpic,
    launchQuizEpic,
    fillDistractorEpic,
    
  );

  export default AllEpics;