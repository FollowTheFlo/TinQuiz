import { initStore } from './store';
import { Place } from '../data/places-context';

//concrete store
const configureStore = () => {
  const actions = {
    ADD_PLACE: (curState:any, place:Place) => {
     console.log('ADD_PLACE', place);
      const currentPlaces = [...curState.places];
     const updatedPlaces = currentPlaces.concat(place);
     console.log('ADD_PLACE2', updatedPlaces);
      return { places: updatedPlaces };
    }
  };
  initStore(actions, {
    places: [
        {
            id: '7888',
            town:'Montreal',
            region: 'Quebec',
            country: 'Canada',
            lat: 1251,
            lng: 7878
          }
    ]
  });
};

export default configureStore;