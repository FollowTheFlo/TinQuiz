import { from } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const getQwantSearchResult = (proxyOn:boolean, target: string) => {
   // const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const proxyurl = "https://quiz-magnet.herokuapp.com/";
  //  const obs$ = fetch(encodeURI(`https://api.qwant.com/api/search/web?count=10&q=${target} wikipedia&t=web&device=desktop&safesearch=1&locale=en_us&uiv=4`),
 
  // )
  // .then(response => response.text())
  // .then(contents => {
    
  //   return JSON.parse(contents);
  // })
  // return from(obs$);
  // .catch(error => {
  //   console.log("Can’t access server", error)
  //   return error;
  // }
  //   )
  const qwantUrl = `https://api.qwant.com/api/search/web?count=10&q=${target} wikipedia&t=web&device=desktop&safesearch=1&locale=en_us&uiv=4`
  const url = proxyOn ? proxyurl+qwantUrl : qwantUrl;
  console.log('APi Url', url);
  const obs$ = ajax(encodeURI(url)).pipe(
    map(resp => resp.response)

   );
  //  return from(request).pipe(
  //    map(response => JSON.parse(response.text())),
  //  );
  return obs$;
  }



const getPlacefromlatLng = (lat:number, lng:number) => {
  const request = fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1IjoiZmxldGVuZHJlIiwiYSI6ImNrMm1yazc5YTBreW8zYm05YW1rajhyNmUifQ.cjgG6XNX--iACz0-5sp1Jg`)
  .then((response:any) => { 
    console.log(response)
    return response.json();
  })
  // .catch((error:any) => {
  //   console.log('Error fetching place - MapBox ', error);
  // });
  return from(request);
}

const getUserLatLng = () => {
  console.log('locateUser');

    const request = Geolocation.getCurrentPosition({ timeout: 5000})
      .then((geoResponse:any) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log('location ',geoResponse );
      //getReverseGeocode(geoResponse.coords.latitude, geoResponse.coords.longitude);
      return {lat:geoResponse.coords.latitude, lng:geoResponse.coords.longitude};
     },
     error => console.log(error)
     )
     return from(request);
}

export {
  getQwantSearchResult,
  getPlacefromlatLng,
  getUserLatLng
};