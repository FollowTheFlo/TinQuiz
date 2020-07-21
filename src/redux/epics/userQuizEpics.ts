import { ofType, Epic } from 'redux-observable';
import { Plugins } from '@capacitor/core';
import { of, from } from 'rxjs';
import { mapTo, catchError, filter, tap, delay, mergeMap, switchMap, map } from 'rxjs/operators';
import{
  START_LOCATION,
  SHOW_GEO_ERROR,
  END_LOCATION,
  SET_LOCATION_FROM_FLAG,
  GO_NEXT_QUESTION,
  END_QUIZ,
  START_APP,
  } from "./../constants";
import ActionCreators, { Action } from "./../actions";

export const goNextQuestionEpic: Epic<Action> = (
    action$, state$
    ) =>
    action$.pipe(
        ofType<Action>(GO_NEXT_QUESTION),
        tap(() => console.log('EPIC - GO_NEXT_QUESTION')),
        map((action:Action) => {
            console.log('EPIC - GO_NEXT_QUESTION Length',state$.value.quiz.quiz.questions.length);
            console.log('EPIC - GO_NEXT_QUESTION index',state$.value.uQuiz.questionIndex);
            if(state$.value.uQuiz.questionIndex ===state$.value.quiz.quiz.questions.length) {
                return ActionCreators.userQuizActions.endQuiz({quiz:state$.value.quiz.quiz, countryImg:state$.value.quiz.selectedFlag.image});

            }
            return ActionCreators.userQuizActions.emptyAction();
        }),)

export const endQuizEpic: Epic<Action> = (
    action$, state$
    ) =>
    action$.pipe(
        ofType<Action>(END_QUIZ),
        tap(() => console.log('EPIC - END_QUIZ')),
        map((action:Action) => {
      
            const { Storage } = Plugins;
            const badges = [...state$.value.uQuiz.badges];
            Storage.set({key: 'badges', value: JSON.stringify(badges)}).then( () =>{
                console.log('succesfully store in cache');}
            )
            
            return ActionCreators.userQuizActions.showResultPanel(true);
        }),)

        export const startAppEpic: Epic<Action> = (
            action$, state$
            ) =>
            
            action$.pipe(
                ofType<Action>(START_APP),
                tap(() => console.log('EPIC - START_APP')),
                switchMap((action:Action) => {
              
                    const { Storage } = Plugins;
                   // const badges = [...state$.value.uQuiz.badges];
                    return from(Storage.get({key: 'badges'}))
                
                    },
                   
                    ),
                map((JsonBadges:any) => {
                         console.log('succesfully fetch from cache', JsonBadges);
                        if(!JsonBadges || !JsonBadges.value) {
                            return ActionCreators.userQuizActions.emptyAction();
                        }
                        const badges = JSON.parse(JsonBadges.value);
                        return ActionCreators.userQuizActions.fillbadges({
                            badges
                        })

                }
                
                )
                    
                   // return ActionCreators.userQuizActions.emptyAction();
                )