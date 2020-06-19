import { ofType, Epic } from 'redux-observable';
import { of } from 'rxjs';
import { mapTo, catchError, filter, tap, delay, mergeMap, switchMap, map } from 'rxjs/operators';
import{
  START_LOCATION,
  START_QWANT_SEARCH,
  SHOW_GEO_ERROR,
  SHOW_QWANT_ERROR
  } from "./constants";
import {
    Action,
    StartQwantSearchAction,
    ActionCreators,
    Coordinates
  } from "./actions";
import { getQwantSearchResult, getUserLatLng, getPlacefromlatLng } from './shared/services/api';


  export const qwantEpic: Epic<Action> = (
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
                return of(ActionCreators.showQwantErrorMessage("START_QWANT_SEARCH ERROR: "+  error.message));
            }),
         )
       
        
        } ),
     map((response:any) => {
         console.log('ajax', response);

         //check if errors occured
         if(response && response.type && response.type === SHOW_QWANT_ERROR) {
           return ActionCreators.showQwantErrorMessage(response.payload);
            
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
        return ActionCreators.endQwantSearch({qwantArticles:qArticles})
        //return qArticles;
        })
      
    )

export const locationEpic: Epic<Action> = (
    action$, state$
    ) =>
    action$.pipe(
        ofType<Action>(START_LOCATION),
        tap(() => console.log('EPIC - START_LOCATION')),
        switchMap((action:Action) => {
            return getUserLatLng()
            .pipe(
                catchError( error => {
                   console.log("getUserLatLng",error.message);
                   return of(ActionCreators.showGeoErrorMessage("getUserLatLng Error"));
                 }),
                )
        
        }),
        //response either Action Type whnen error occurs or {lat,lng} when no error
        switchMap((response:any) => {
            //if error was thrown from previous obs, response is type Action
            if(response && response.type && response.type === SHOW_GEO_ERROR) {
                return of(ActionCreators.showGeoErrorMessage(response.payload));
                 
              }
             //if no error, get coordinate with MapBox fct, response type Coordinates 
            return getPlacefromlatLng(response.lat, response.lng)
            .pipe(
                catchError( error => {
                   console.log("getPlacefromlatLng",error);
                   return of(ActionCreators.showGeoErrorMessage("getPlacefromlatLng Error"));
                 }),
                )
           
        
        }),
        map(result => { 
          //if error was thrown from previous obs, response is type Action
            if(result && result.type && result.type === SHOW_GEO_ERROR) {
                return ActionCreators.showGeoErrorMessage(result.payload);
                 
              }
             //if no error, we get response from MapBox which is a list of feature with places details
             //we are interested to first one: features[0]
            console.log('result1', result);
            const place = result.features[0].context[2].text;
            const region = result.features[0].context[3].text;
            const country = result.features[0].context[4].text;
            const lat = result.features[0].geometry.coordinates[0];
            const lng = result.features[0].geometry.coordinates[1];
            console.log(place,region,country,lat,lng);
            return  ActionCreators.endLocation({location: {id: Date.now().toString(), place, country, lat, lng}});
             }        
         )
       
        
    )



