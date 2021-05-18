import { ofType, Epic } from 'redux-observable';
import { map, catchError, tap, switchMap, mergeMap, concatMap, delay } from 'rxjs/operators';
import ActionCreators, { Action } from '../actions';
import { RUN_QUESTION, RUN_DISTRACTOR, RUN_QUESTIONS_LIST,
    QUESTIONS_MAP,
    FILL_QUIZ,
    RUN_FLAGS,
    Theme,
    LAUNCH_QUIZ,
    FILL_DISTRACTOR
} from '../constants';
import { RunQuestionAction, QuestionParams, RunDistractorAction, RunQuestionsListAction } from '../actions/quizActions';
import { getSparqlCountryList, getSparqlRegionList, getSparqlPlaceList } from '../shared/services/distractorSPARQL';
import { questionAllList } from '../shared/config/queriesLists';
import { from, of, empty, never } from 'rxjs';
import { getSparqlChoice, Article } from '../shared/services/questionSPARQL';
import { getSparqlFilmChoice } from '../shared/services/filmSPARQL';
import { Question, Flag } from '../reducers/QuizReducer'
import { Location } from '../reducers/GeoReducer';
import { getSparqlCountryWDCodeURIs, getSparqlFlagList } from '../shared/services/flagSPARQL';
import { randomIntFromInterval, randomizeChoices } from '../shared/services/utilitySPARQL';
import { questionCinemaList } from '../shared/config/queriesCinemaList';
import { questionGeoList } from '../shared/config/queriesGeoList';
import { questionCelebList } from '../shared/config/queriesCelebList';
import { questionFoodList } from '../shared/config/queriesFoodList';
import { questionEnterpriseList } from '../shared/config/queriesEnterpriseList';
import { localFlagsList } from '../shared/config/flagsList';


export const quizEpic: Epic<Action> = (
    action$, state$
  ) =>{
    let location: Location;
    let distractor = {
        place: [''],
        placeWD: [''],
        region: [''],
        regionWD: [''],
        country: [''],
        countryWD: [''],
    }
    return action$.pipe(
     ofType<any>(RUN_DISTRACTOR),
     tap(() => console.log('EPIC - RUN_DISTRACTOR')),
     
     // mapTo({ type: 'PLACE_ADDED'})
     concatMap((action:RunDistractorAction) => { 
         
       console.log('FillQuizAction switchMap', state$);
       location = {...action.payload.location};
       if(!location.countryWD) {
        console.log('empty1')
           return of({});
       }
         return getSparqlCountryList(location.countryWD);
           
        
        } ),
     concatMap((response:any) => {
        console.log('countryWD test empty')
         if(response) {
            console.log('ajax1', response);
            //receiving list of dsitractor countries {label,code} from getSparqlCountryList
            distractor.country = response.map((obj:any) => obj.label);
            distractor.countryWD = response.map((obj:any) => obj.code);
            console.log('distractor1',distractor);
         } else {
             console.log('countryWD was empty')
         }

         if(!location.regionWD) {
            console.log('empty regionWD')
            return of({});
        }
         return getSparqlRegionList(location.regionWD);
        
        }),
    concatMap((response:any) => {
        console.log('ajax2', response);
        if(response[0]) {
            distractor.region[0] = response[0].label;
            distractor.regionWD[0] = response[0].code;
        }
       
        console.log('distractor1',distractor);
        if(!location.placeWD) {
            console.log('empty3')
            return of({});
        }
        return getSparqlPlaceList(location.placeWD);
        
        }),

    map((response:any) => {
    console.log('ajax3', response);
    if(response[0]) {
        distractor.place[0] = response[0].label;
        distractor.placeWD[0] = response[0].code;
        console.log('distractor3',distractor);
    } else {
        console.log('location.placeWD was empty');
    }

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
                    const randomIndex = randomIntFromInterval(0,state$.value.quiz.quiz.distractor[action.params.type].length - 1);
                    console.log('randomIndex', randomIndex);
                    console.log('randomIndex Length', state$.value.quiz.quiz.distractor[action.params.type].length - 1);
                    actionParams = {
                        ...action.params,
                        code: action.params.isDistractor ? state$.value.quiz.quiz.distractor[action.params.type + 'WD'][randomIndex] : state$.value.quiz.quiz.location[action.params.type + 'WD'],
                        area: state$.value.quiz.quiz.location[action.params.type],
                        correctArea: action.params.isDistractor ? state$.value.quiz.quiz.distractor[action.params.type][randomIndex] : state$.value.quiz.quiz.location[action.params.type],
 
                    };
                    console.log('actionParams.theme', actionParams.topic);    
                    if(actionParams.topic === 'filmByCountry') {
                        console.log('in condition FilmByCountry');
                        return getSparqlFilmChoice(actionParams.topic,actionParams.code);
                    }

                    return getSparqlChoice(actionParams.topic,actionParams.code);        
                }),

            map((response:Article) => {
                
                if(response.image === '' || response.label === '') {
                return ActionCreators.quizActions.ignoreQuestion();
                }
                
                console.log('FINAL EPIC',inputEl);
                const question:Question = {
                    id: Date.now().toString(),
                    geoType: actionParams.type,
                    topic: actionParams.topic,
                    phrase: `${QUESTIONS_MAP[actionParams.topic]} ${actionParams.area} ?`,
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

            export const launchQuizEpic: Epic<Action> = (
                action$, state$
                ) =>
                action$.pipe(
                    ofType<Action>(LAUNCH_QUIZ),
                    tap(() => console.log('EPIC - LAUNCH_QUIZ')),
                    map(() => {
                      return  ActionCreators.quizActions.runDistractor(
                        {
                          location: state$.value.geo.location
                        }
                      );
                    })
                )

            export const fillDistractorEpic: Epic<Action> = (
                action$, state$
                ) =>
                action$.pipe(
                    ofType<Action>(FILL_DISTRACTOR),
                    tap(() => console.log('EPIC - FILL_DISTRACTOR')),
                    map(() => {
                        return  ActionCreators.quizActions.runQuestionsList(
                        {
                            theme: state$.value.quiz.quiz.theme
                        }
                        );
                    })
                )

            export const runQuestionListEpic: Epic<Action> = (
                action$, state$
                ) =>{
  
                return action$.pipe(
                    ofType<any>(RUN_QUESTIONS_LIST),
                    tap(() => console.log('EPIC - RUN_QUESTIONS_LIST')),
                    concatMap((action:RunQuestionsListAction) => { 
                        console.log(action.params.theme);
                        let questionListwithTheme:any[];
                        switch (action.params.theme) {
                            case Theme.ALL: {
                                questionListwithTheme = randomizeChoices(questionAllList);
                                break;
                            }
                            case Theme.CINEMA: {
                                questionListwithTheme = randomizeChoices(questionCinemaList);
                                break;
                            }
                            case Theme.GEO: {
                                questionListwithTheme = randomizeChoices(questionGeoList);
                                break;
                            }
                            case Theme.CELEBRITIES: {
                                questionListwithTheme = randomizeChoices(questionCelebList);
                                break;
                            }
                            case Theme.FOOD: {
                                questionListwithTheme = randomizeChoices(questionFoodList);
                                break;
                            }
                            case Theme.ENTERPRISES: {
                                questionListwithTheme = randomizeChoices(questionEnterpriseList);
                                break;
                            }
                            default: {
                                questionListwithTheme = randomizeChoices(questionAllList);
                            }
                        }
                        // we stringify to take advantage of rxJS opeator 'from' which accept string only (not objects like QuestionParams)
                        const questionsJSON:string[] = questionListwithTheme.map(q => JSON.stringify(q));
                        console.log('questionsJSON', questionsJSON);
                        return from(questionsJSON);
                    }),
                  //  delay(1000),
                    map((questionJSON:any)=>{
                        // Parse to get the object QuestionParams from Json string
                        const questionParams:QuestionParams = JSON.parse(questionJSON);
                        console.log('questionParams', questionParams);
                        if(questionParams.topic === 'end') {
                            return  ActionCreators.quizActions.endQuestionsList();
                        }
                        return  ActionCreators.quizActions.runQuestion(questionParams);
                    })
                    
                    )
                }

                export const FillQuizEpic: Epic<Action> = (
                    action$, state$
                    ) =>{
      
                    return action$.pipe(
                        ofType<any>(FILL_QUIZ),
                        tap(() => console.log('EPIC - FILL_QUIZ')),
                        map((action:any) => { 
                            const id = Date.now().toString();
                            return  ActionCreators.quizActions.setQuizId({
                                quizId:id
                            })
                        }),
                     
                        
                        )
                    }
                export const RunFlagsEpic: Epic<Action> = (
                    action$, state$
                    ) =>{
                    
                    return action$.pipe(
                        ofType<any>(RUN_FLAGS),
                        tap(() => console.log('EPIC - RUN_FLAGS')),
                        map(() => {
                            return ActionCreators.quizActions.fillFlags({
                                flags: localFlagsList
                            });
                        })
                        // concatMap((action:Action) => { 
                        // //set any country as parameter, just use to get Hypernym in getSparqlCountryWDCodeURIs
                        //       return getSparqlCountryWDCodeURIs('Q30');
                                
                             
                        //      } ),
                        // concatMap((response:any[]) => {
                        // console.log('RUN_FLAGS response', response);
                        // if(!response) {
                        //     //return of(ActionCreators.geoActions.showGeoErrorMessage("getSparqlFlagList Error"));
                        //     console.log('response is null');
                        //     return of([]);
                        // }
                        // return getSparqlFlagList(response)
                        // .pipe(
                        //     catchError( error => {
                        //        console.log("getUserLatLng",error.message);
                        //        return of(ActionCreators.geoActions.showGeoErrorMessage("getSparqlFlagList Error"));
                        //      }),
                        //     )
                        
                        // }),
                        // map((flags:Flag[]) => {
                           
                        //     const countryWD = state$.value.quiz.quiz.location.countryWD;
                        //     console.log('Flags', flags, countryWD);
                        //     flags.forEach(f => {
                        //       f.isSelected =  f.WdCode === countryWD ? true : false;
                        //     });
                        //     return ActionCreators.quizActions.fillFlags({
                        //         flags: flags
                        //     });
                        // })
                        
                        
                        )
                    }