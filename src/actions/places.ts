import { Store } from "use-global-hook";
import { MyState, MyAssociatedActions} from './../store'
import { Place } from "../data/places-context";



export const addPlace = (store: Store<MyState, MyAssociatedActions>,
    place: Place
    ) => {
        console.log('ADD_PLACE', place);
        const currentPlaces = [...store.state.places];
       const updatedPlaces = currentPlaces.concat(place);
       console.log('ADD_PLACE2', updatedPlaces);
       store.setState({places: updatedPlaces});
        return { places: updatedPlaces };
    }