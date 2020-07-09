import {qwantEpic} from './qwantEpics';
import {locationEpic, endLocationEpic} from './geoEpics';
import {quizEpic,questionEpic, runQuestionListEpic, FillQuizEpic} from './quizEpics';
import { combineEpics } from 'redux-observable';

  const AllEpics = combineEpics(
    qwantEpic,
    locationEpic,
    endLocationEpic,
    quizEpic,
    questionEpic,
    runQuestionListEpic,
    FillQuizEpic,
    
  );

  export default AllEpics;