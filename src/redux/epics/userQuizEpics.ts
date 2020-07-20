import { ofType, Epic } from 'redux-observable';
import { of } from 'rxjs';
import { mapTo, catchError, filter, tap, delay, mergeMap, switchMap, map } from 'rxjs/operators';
import{
  START_LOCATION,
  SHOW_GEO_ERROR,
  END_LOCATION,
  SET_LOCATION_FROM_FLAG,
  GO_NEXT_QUESTION,
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