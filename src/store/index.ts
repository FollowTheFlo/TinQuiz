import React from "react";
//import useGlobalHook from "use-global-hook";
import globalHook, { Store } from 'use-global-hook';
import { Place } from './../data/places-context'
import * as actions from "../actions/places";

   export type MyState = {
        places: Place[];
    }; 

  export type MyAssociatedActions = {
    addPlace: (payload: Place) => void;
    otherAction: (other: boolean) => void;
  };

  

const initialState: MyState = {
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
};

const useGlobal = globalHook<MyState, MyAssociatedActions>(React, initialState, actions);

export default useGlobal;
