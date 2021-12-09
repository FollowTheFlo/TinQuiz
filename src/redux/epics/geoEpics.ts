import { ofType, Epic } from "redux-observable";
import { of } from "rxjs";
import { catchError, tap, switchMap, map } from "rxjs/operators";
import { START_LOCATION, SHOW_GEO_ERROR } from "./../constants";
import ActionCreators, { Action } from "./../actions";
import { getUserLatLng, getPlacefromlatLng } from "../shared/services/geoAPI";

export const locationEpic: Epic<Action> = (action$, state$) =>
  action$.pipe(
    ofType<Action>(START_LOCATION),
    tap(() => console.log("EPIC - START_LOCATION")),
    switchMap((action: Action) => {
      return getUserLatLng().pipe(
        catchError((error) => {
          console.log("getUserLatLng", error.message);
          return of(
            ActionCreators.geoActions.showGeoErrorMessage("getUserLatLng Error")
          );
        })
      );
    }),
    //response either Action Type whnen error occurs or {lat,lng} when no error
    switchMap((response: any) => {
      //if error was thrown from previous obs, response is type Action
      if (response && response.type && response.type === SHOW_GEO_ERROR) {
        return of(
          ActionCreators.geoActions.showGeoErrorMessage(response.payload)
        );
      }
      //if no error, get coordinate with MapBox fct, response type Coordinates
      return getPlacefromlatLng(response.lat, response.lng).pipe(
        catchError((error) => {
          console.log("getPlacefromlatLng", error);
          return of(
            ActionCreators.geoActions.showGeoErrorMessage(
              "getPlacefromlatLng Error"
            )
          );
        })
      );
    }),
    map((result) => {
      //if error was thrown from previous obs, response is type Action
      if (result && result.type && result.type === SHOW_GEO_ERROR) {
        return ActionCreators.geoActions.showGeoErrorMessage(result.payload);
      }
      //if no error, we get response from MapBox which is a list of feature with places details
      //we are interested to first one: features[0]
      if (!result.features[0] || !result.features[0].context) {
        return ActionCreators.geoActions.showGeoErrorMessage(
          "No Results from Mapbox"
        );
      }
      console.log("resultmapBox", result);
      let place = "";
      let region = "";
      let country = "";
      let placeWD = "";
      let regionWD = "";
      let countryWD = "";
      if (result.features[0].context.length > 1) {
        const placeIndex = result.features[0].context.findIndex((el: any) =>
          el.id.includes("place")
        );
        //const regionIndex = result.features[0].context.findIndex((el:any) => el.id.includes('region'));
        const countryIndex = result.features[0].context.findIndex((el: any) =>
          el.id.includes("country")
        );
        place =
          placeIndex !== -1 ? result.features[0].context[placeIndex].text : "";
        placeWD =
          placeIndex !== -1
            ? result.features[0].context[placeIndex].wikidata
            : "";
        //region = regionIndex !== -1 ? result.features[0].context[regionIndex].text : '';
        //regionWD = regionIndex !== -1 ? result.features[0].context[regionIndex].wikidata : '';
        country =
          countryIndex !== -1
            ? result.features[0].context[countryIndex].text
            : "";
        countryWD =
          countryIndex !== -1
            ? result.features[0].context[countryIndex].wikidata
            : "";

        //const countryDBP = getDBPfromWD(countryWD)
      }

      const lat = result.features[0].geometry.coordinates[0];
      const lng = result.features[0].geometry.coordinates[1];
      console.log(place, region, country, lat, lng);
      return ActionCreators.geoActions.endLocation({
        location: {
          id: Date.now().toString(),
          place,
          region,
          country,
          lat,
          lng,
          placeWD,
          regionWD,
          countryWD,
        },
      });
    })
  );

// export const endLocationEpic: Epic<Action> = (
//   action$, state$
//   ) =>
//   action$.pipe(
//       ofType<Action>(END_LOCATION),
//       tap(() => console.log('EPIC - END_LOCATION')),
//       map(() => {
//         return  ActionCreators.quizActions.runDistractor(
//           {
//             location: state$.value.geo.location
//           }
//         );
//       })
//   )

// export const setLocationFromFlagEpic: Epic<Action> = (
//   action$, state$
//   ) =>
//   action$.pipe(
//       ofType<Action>(SET_LOCATION_FROM_FLAG),
//       tap(() => console.log('EPIC - SET_LOCATION_FROM_FLAG')),
//       map(() => {
//         const location = {...state$.value.geo.location};
//         console.log('Epic SET_LOCATION_FROM_FLAG',location);
//         return  ActionCreators.quizActions.runDistractor(
//           {
//             location
//           }
//         );
//       })
//       )
