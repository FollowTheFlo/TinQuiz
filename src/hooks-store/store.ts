import { useState, useEffect } from 'react';

let globalState = {
};
let listeners:any[] = [];
let actions:any = {};

//adding setState fct to our listener for a component that use customHook useStore
// when componnet mount, and removing it when unmount
export const useStore = (shouldListen = true) => {
  const setState = useState(globalState)[1];

  //to change our state, be able to dispatch action in our compmnet
  const dispatch = (actionIdentifier:any, payload:any) => {
    //actions is obj wher we have key, wher value has concrete function
    //fct take global state and return newState
    const newState = actions[actionIdentifier](globalState, payload);

    //update state globally, merge with newState
    globalState = { ...globalState, ...newState };

    //pass new global state to all listeners
    for (const listener of listeners) {
      listener(globalState);
    }
  };

  useEffect(() => {
    //register list of listener for a cpnt when it mounts
    if (shouldListen) {
      listeners.push(setState);
    }

    return () => {
      //remove list of lsitener when cpnt unmount
      if (shouldListen) {
        listeners = listeners.filter(li => li !== setState);
      }
    };
  }, [setState, shouldListen]);

  //
  return [globalState, dispatch];
};

// get some actions and state
export const initStore = (userActions:any, initialState:any) => {
  if (initialState) {
    globalState = { ...globalState, ...initialState };
  }
  actions = { ...actions, ...userActions };
};
