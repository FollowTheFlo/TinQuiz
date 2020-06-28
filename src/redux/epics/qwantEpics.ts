import { ofType, Epic } from 'redux-observable';
import { of } from 'rxjs';
import { mapTo, catchError, filter, tap, delay, mergeMap, switchMap, map } from 'rxjs/operators';
import{
  START_QWANT_SEARCH,
  SHOW_QWANT_ERROR
  } from "../constants";
import ActionCreators, { Action } from "../actions";
import {StartQwantSearchAction} from '../actions/qwantActions'
import { getQwantSearchResult} from '../shared/services/geoAPI';


  export const qwantEpic: Epic<Action|StartQwantSearchAction> = (
    action$, state$
  ) =>
    action$.pipe(
     ofType<any>(START_QWANT_SEARCH),
     tap(() => console.log('EPIC - START_QWANT_SEARCH')),
      delay(100),
     // mapTo({ type: 'PLACE_ADDED'})
     mergeMap((action:StartQwantSearchAction) => { 
       console.log('state proxy', state$.value.qwant.proxyActivated);
         return getQwantSearchResult(state$.value.qwant.proxyActivated , action.params.target)
         .pipe(
            catchError( error => {
                console.log("START_QWANT_SEARCH ERROR",error);
                return of(ActionCreators.qwantActions.showQwantErrorMessage("START_QWANT_SEARCH ERROR: "+  error.message));
            }),
         )
       
        
        } ),
     map((response:any) => {
         console.log('ajax', response);

         //check if errors occured
         if(response && response.type && response.type === SHOW_QWANT_ERROR) {
           return ActionCreators.qwantActions.showQwantErrorMessage(response.payload);
            
         }
      
        const items:any[] = response.data.result.items;
        const qArticles = items.map((res, index) => 
        {
        return  {
            id: (Date.now() + index).toString(),
            title: res.title,
            link: res.url,
            selected: false};
        }); 

        console.log('qArticles',qArticles);
        return ActionCreators.qwantActions.endQwantSearch({qwantArticles:qArticles})
        //return qArticles;
        })
      
    )


