import {qwantEpic} from './qwantEpics';
import {locationEpic, endLocationEpic} from './geoEpics';
import {quizEpic, questionMusicianEpic, personByRegionEpic, questionEpic, runQuestionListEpic} from './quizEpics';
import { combineEpics } from 'redux-observable';

  const AllEpics = combineEpics(
    qwantEpic,
    locationEpic,
    endLocationEpic,
    quizEpic,
    questionMusicianEpic,
    personByRegionEpic,
    questionEpic,
    runQuestionListEpic,
    
  );

  export default AllEpics;