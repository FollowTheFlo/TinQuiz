import { ofType, Epic } from 'redux-observable';
import { map, catchError, tap, switchMap, mergeMap, concatMap, delay } from 'rxjs/operators';
import ActionCreators, { Action } from '../actions';
import { FILL_QUIZ, FILL_DISTRACTOR, RUN_QUESTION, RUN_DISTRACTOR, RUN_QUESTIONS_LIST } from '../constants';
import { FillQuizAction, FillDistractorAction, RunQuestionAction, QuestionParams, RunDistractorAction } from '../actions/quizActions';
import { getSparqlCountryList, getSparqlRegionList, getSparqlPlaceList } from '../shared/services/distractorSPARQL';
import { RootState } from '../reducers';
import { from, of } from 'rxjs';
import { getSparqlChoice, Article } from '../shared/services/questionSPARQL';
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
        distractor.region = response.label;
        distractor.regionWD = response.code;
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

    export const questionMusicianEpic: Epic<Action> = (
        action$, state$
      ) =>{
        let inputEl:any;     
        return action$.pipe(
         ofType<any>('FILL_DISTRACTORR'),
         tap(() => console.log('EPIC - FILL_DISTRACTOR')),
         
         // mapTo({ type: 'PLACE_ADDED'})
         switchMap((action:FillDistractorAction) => { 
           
            let inputArray = [
                JSON.stringify({question:`Music artist from ${state$.value.quiz.quiz.location.country} ?`,country:state$.value.quiz.quiz.distractor.country, code:state$.value.quiz.quiz.distractor.countryWD, correct:false, label:'',image:''}),
                JSON.stringify({question:`Music artist from ${state$.value.quiz.quiz.location.country} ?`,country:state$.value.quiz.quiz.location.country, code:state$.value.quiz.quiz.location.countryWD, correct:true, label:'',image:''})
            ];
           return from(inputArray);           
         }),
        concatMap((response:string) => {
            console.log('Stream Result before parse', response);
            inputEl = JSON.parse(response);
            console.log('Stream Result after parse', response); 
            console.log('EPIC inputArray stream', inputEl);
            return getSparqlChoice('musicianByCountry',inputEl.code);
        
        }),
        map((response:Article) => {
           
           if(response.image === '' || response.label === '') {
            return ActionCreators.quizActions.ignoreQuestion();
           }
           
            console.log('FINAL EPIC getMusician,',inputEl);
            const question:Question = {
                id: Date.now().toString(),
                geoType: 'country',
                theme: 'musician',
                phrase: inputEl.question,
                subPhrase: inputEl.label,
                correct: inputEl.correct,
                correctArea: inputEl.country,
                image: response.image,
                label: response.label,
            }
            return ActionCreators.quizActions.fillQuestion({question: question});
             }),         
        )
    
        }

    export const personByRegionEpic: Epic<Action> = (
        action$, state$
        ) =>{
        let inputEl:any;     

        return action$.pipe(
            ofType<any>('FILL_DISTRACTORR'),
            tap(() => console.log('EPIC - FILL_DISTRACTOR')),
            
            // mapTo({ type: 'PLACE_ADDED'})
            switchMap((action:FillQuizAction) => { 
            let inputArray = [
                JSON.stringify({question:`People from ${state$.value.quiz.quiz.location.region} ?`,country:state$.value.quiz.quiz.distractor.country, code:state$.value.quiz.quiz.distractor.regionWD, correct:false, label:'',image:''}),
                JSON.stringify({question:`People from ${state$.value.quiz.quiz.location.region} ?`,country:state$.value.quiz.quiz.location.country, code:state$.value.quiz.quiz.location.regionWD, correct:true, label:'',image:''})
            ];
            return from(inputArray);           
            }),
        concatMap((response:string) => {
            console.log('Stream Result before parse', response);
            inputEl = JSON.parse(response);
 
            return getSparqlChoice('personByRegionQuery',inputEl.code);
        
        }),
        map((response:Article) => {
            
            if(response.image === '' || response.label === '') {
            return ActionCreators.quizActions.ignoreQuestion();
            }
            
            console.log('FINAL EPIC getMusician,',inputEl);
            const question:Question = {
                id: Date.now().toString(),
                geoType: 'region',
                theme: 'people',
                phrase: inputEl.question,
                subPhrase: inputEl.label,
                correct: inputEl.correct,
                correctArea: inputEl.country,
                image: response.image,
                label: response.label,
            }
            return ActionCreators.quizActions.fillQuestion({question: question});
                }),         
        )
    
        }
////////////////////////

interface localQuestionParams extends QuestionParams {
    code: string;
    area: string;
    correctArea: string;
}
const questionMap:any = {
    'musicianByCountry' : 'Musician from',
    'personByRegion' : 'Person from'
}
        export const questionEpic: Epic<Action> = (
            action$, state$
            ) =>{
            let inputEl:any;     
            let actionParams:localQuestionParams;
    
            return action$.pipe(
                ofType<any>(RUN_QUESTION),
                tap(() => console.log('EPIC - RUN_QUESTION')),
                
                // mapTo({ type: 'PLACE_ADDED'})
                concatMap((action:RunQuestionAction) => { 
                    actionParams = {
                        ...action.params,
                        code: action.params.isDistractor ? state$.value.quiz.quiz.distractor[action.params.type + 'WD'] : state$.value.quiz.quiz.location[action.params.type + 'WD'],
                        area: state$.value.quiz.quiz.location[action.params.type],
                        correctArea: action.params.isDistractor ? state$.value.quiz.quiz.distractor[action.params.type] : state$.value.quiz.quiz.location[action.params.type],
 
                    };
                // let inputArray = [
                //     JSON.stringify({question:`People from ${state$.value.quiz.quiz.location[action.params.type]} ?`,country:state$.value.quiz.quiz.distractor.country, code:state$.value.quiz.quiz.distractor[action.params.type + 'WD'], correct:false, label:'',image:''}),
                //     JSON.stringify({question:`People from ${state$.value.quiz.quiz.location[action.params.type]} ?`,country:state$.value.quiz.quiz.location.country, code:state$.value.quiz.quiz.location[action.params.type + 'WD'], correct:true, label:'',image:''})
                // ];
                // return from(inputArray);   
                return getSparqlChoice(actionParams.theme,actionParams.code);        
                }),
            // concatMap((response:string) => {
            //     console.log('Stream Result before parse', response);
            //     inputEl = JSON.parse(response);
     
            //     return getSparqlChoice(actionParams.theme,inputEl.code);
            
            // }),
            map((response:Article) => {
                
                if(response.image === '' || response.label === '') {
                return ActionCreators.quizActions.ignoreQuestion();
                }
                
                console.log('FINAL EPIC getMusician,',inputEl);
                const question:Question = {
                    id: Date.now().toString(),
                    geoType: actionParams.type,
                    theme: actionParams.theme,
                    phrase: `${questionMap[actionParams.theme]} from ${actionParams.area} ?`,
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
                    const questionList = [
                        {
                          theme: 'personByRegion',
                          type: 'region',
                          isDistractor: false,
                        },
                        {
                          theme: 'personByRegion',
                          type: 'region',
                          isDistractor: true,
                        },
                        {
                          theme: 'musicianByCountry',
                          type: 'country',
                          isDistractor: false,
                        },
                        {
                          theme: 'musicianByCountry',
                          type: 'country',
                          isDistractor: true,
                        }
                      ];
                  
                   
                return action$.pipe(
                    ofType<any>(RUN_QUESTIONS_LIST),
                    tap(() => console.log('EPIC - RUN_QUESTIONS_LIST')),
                    concatMap((action:any) => { 
                        const questionsJSON:string[] = questionList.map(q => JSON.stringify(q));
                        console.log('questionsJSON', questionsJSON);
                        return from(questionsJSON);
                    }),
                    delay(1000),
                    map((questionJSON:any)=>{
                        const questionParams:QuestionParams = JSON.parse(questionJSON);
                        console.log('questionParams', questionParams);
                        return  ActionCreators.quizActions.runQuestion(questionParams);
                    })
                    
                    )
                }