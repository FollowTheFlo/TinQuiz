import React from 'react';

export interface Place {
  id: string;
    town: string;
    region: string;
    country: string
    lat: number;
    lng: number;
}

const PlacesContext = React.createContext<{
  places: Place[];
  addPlace: (place: Place) => void;
  initContext: () => void;
}>({
  places: [],
  addPlace: () => {},
  initContext: () => {}
});

export default PlacesContext;
