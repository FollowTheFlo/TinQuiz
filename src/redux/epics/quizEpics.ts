import { ofType, Epic } from 'redux-observable';
import { map, catchError, tap, switchMap, mergeMap, concatMap, delay } from 'rxjs/operators';
import ActionCreators, { Action } from '../actions';
import { RUN_QUESTION, RUN_DISTRACTOR, RUN_QUESTIONS_LIST,
    QUESTIONS_MAP
} from '../constants';
import { RunQuestionAction, QuestionParams, RunDistractorAction } from '../actions/quizActions';
import { getSparqlCountryList, getSparqlRegionList, getSparqlPlaceList } from '../shared/services/distractorSPARQL';
import { questionMainList } from '../shared/config/queriesLists';
import { from, of } from 'rxjs';
import { getSparqlChoice, Article } from '../shared/services/questionSPARQL';
import { getSparqlFilmChoice } from '../shared/services/filmSPARQL';
import { Question } from '../reducers/QuizReducer'
import { Location } from '../reducers/GeoReducer';


export const quizEpic: Epic<Action> = (
    action$, state$
  ) =>{
    let location: Location;
    let distractor = {
        place: '',
        placeWD: '',
        region: '',
        regionWD: '',
        country: '',
        countryWD: '',
    }
    return action$.pipe(
     ofType<any>(RUN_DISTRACTOR),
     tap(() => console.log('EPIC - START_QWANT_SEARCH')),
     
     // mapTo({ type: 'PLACE_ADDED'})
     concatMap((action:RunDistractorAction) => { 
         
       console.log('FillQuizAction switchMap', state$);
       location = {...action.payload.location};
         return getSparqlCountryList(location.countryWD);
           
        
        } ),
     concatMap((response:any) => {
         console.log('ajax1', response);
         distractor.country = response.label;
         distractor.countryWD = response.code;
         console.log('distractor1',distractor);
         return getSparqlRegionList(location.regionWD);
        
        }),
    concatMap((response:any) => {
        console.log('ajax2', response);
        if(response) {
            distractor.region = response.label;
            distractor.regionWD = response.code;
        }
       
        console.log('distractor1',distractor);
        return getSparqlPlaceList(location.placeWD);
        
        }),

    map((response:any) => {
    console.log('ajax3', response);
    distractor.place = response.label;
    distractor.placeWD = response.code;
    console.log('distractor3',distractor);
    return ActionCreators.quizActions.fillDistractors({
        distractor: distractor
    });
        
        //return qArticles;
        }),
      
    )

    }


interface localQuestionParams extends QuestionParams {
    code: string;
    area: string;
    correctArea: string;
}

        export const questionEpic: Epic<Action> = (
            action$, state$
            ) =>{
            let inputEl:any;     
            let actionParams:localQuestionParams;
    
            return action$.pipe(
                ofType<any>(RUN_QUESTION),
                tap(() => console.log('EPIC - RUN_QUESTION')),
                
                concatMap((action:RunQuestionAction) => { 
                    actionParams = {
                        ...action.params,
                        code: action.params.isDistractor ? state$.value.quiz.quiz.distractor[action.params.type + 'WD'] : state$.value.quiz.quiz.location[action.params.type + 'WD'],
                        area: state$.value.quiz.quiz.location[action.params.type],
                        correctArea: action.params.isDistractor ? state$.value.quiz.quiz.distractor[action.params.type] : state$.value.quiz.quiz.location[action.params.type],
 
                    };
                    console.log('actionParams.theme', actionParams.theme);    
                    if(actionParams.theme === 'filmByCountry') {
                        console.log('in condition FilmByCountry');
                        return getSparqlFilmChoice(actionParams.theme,actionParams.code);
                    }

                    return getSparqlChoice(actionParams.theme,actionParams.code);        
                }),

            map((response:Article) => {
                
                if(response.image === '' || response.label === '') {
                return ActionCreators.quizActions.ignoreQuestion();
                }
                
                console.log('FINAL EPIC getMusician,',inputEl);
                const question:Question = {
                    id: Date.now().toString(),
                    geoType: actionParams.type,
                    theme: actionParams.theme,
                    phrase: `${QUESTIONS_MAP[actionParams.theme]} ${actionParams.area} ?`,
                    subPhrase: state$.value.quiz.quiz.location[actionParams.type],
                    correct: actionParams.isDistractor ? false : true,
                    correctArea: actionParams.correctArea,
                    image: response.image,
                    label: response.label,
                }
                return ActionCreators.quizActions.fillQuestion({question: question});
                    }),
            )
        
            }

            export const runQuestionListEpic: Epic<Action> = (
                action$, state$
                ) =>{
  
                return action$.pipe(
                    ofType<any>(RUN_QUESTIONS_LIST),
                    tap(() => console.log('EPIC - RUN_QUESTIONS_LIST')),
                    concatMap((action:any) => { 
                        // we stringify to take advantage of rxJS opeator 'from' which accept string only (not objects like QuestionParams)
                        const questionsJSON:string[] = questionMainList.map(q => JSON.stringify(q));
                        console.log('questionsJSON', questionsJSON);
                        return from(questionsJSON);
                    }),
                  //  delay(1000),
                    map((questionJSON:any)=>{
                        // Parse to get the object QuestionParams from Json string
                        const questionParams:QuestionParams = JSON.parse(questionJSON);
                        console.log('questionParams', questionParams);
                        if(questionParams.theme === 'end') {
                            return  ActionCreators.quizActions.endQuestionsList();
                        }
                        return  ActionCreators.quizActions.runQuestion(questionParams);
                    })
                    
                    )
                }