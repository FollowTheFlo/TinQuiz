import {qwantEpic} from './qwantEpics';
import {locationEpic, endLocationEpic} from './geoEpics';
import {quizEpic,questionEpic, runQuestionListEpic} from './quizEpics';
import { combineEpics } from 'redux-observable';

  const AllEpics = combineEpics(
    qwantEpic,
    locationEpic,
    endLocationEpic,
    quizEpic,
    questionEpic,
    runQuestionListEpic,
    
  );

  export default AllEpics;