import { from } from "rxjs";
import { Plugins } from "@capacitor/core";

const { Geolocation } = Plugins;

const getPlacefromlatLng = (lat: number, lng: number) => {
  const request = fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1IjoiZmxldGVuZHJlIiwiYSI6ImNrMm1yazc5YTBreW8zYm05YW1rajhyNmUifQ.cjgG6XNX--iACz0-5sp1Jg`
  ).then((response: any) => {
    console.log(response);
    return response.json();
  });
  // .catch((error:any) => {
  //   console.log('Error fetching place - MapBox ', error);
  // });
  return from(request);
};

const getUserLatLng = () => {
  console.log("locateUser");

  const request = Geolocation.getCurrentPosition({ timeout: 5000 }).then(
    (geoResponse: any) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log("location ", geoResponse);
      //getReverseGeocode(geoResponse.coords.latitude, geoResponse.coords.longitude);
      return {
        lat: geoResponse.coords.latitude,
        lng: geoResponse.coords.longitude,
      };
    },
    (error) => console.log(error)
  );
  return from(request);
};

export { getPlacefromlatLng, getUserLatLng };
