import React, { useState, useEffect, useCallback } from 'react';
import PlaceContext, { Place } from './places-context'

const PlacesContextProvider: React.FC = props => {

    const [places, setPlaces] = useState<Place[]>([]);

    useEffect(() => {
        console.log('useEffect places');
    },[places]);

    const addPlace = (place: Place) => {
        console.log('addPlace');
        const newplace = {...place};
        setPlaces(curPlaces => {
            return [...curPlaces, newplace];
        });
    }

    const initContext = useCallback(() => {
       addPlace(
        { id: '7888',
        town:'Montreal',
        region: 'Quebec',
        country: 'Canada',
        lat: 1251,
        lng: 7878}
      );
    },[])

return (
    <PlaceContext.Provider
        value={
            {
                places,
                addPlace,
                initContext   
            }
        }
    >
        {props.children}

    </PlaceContext.Provider>
)
};
export default PlacesContextProvider;