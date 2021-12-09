import { createStore, compose, applyMiddleware } from "redux";
import AllEpics from "./epics";
import { createEpicMiddleware } from "redux-observable";
import reducers, { RootState } from "./reducers";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export function makeStore(initialState?: RootState) {
  console.log("initialState", initialState);
  const epics = AllEpics;

  const observableMiddleware = createEpicMiddleware();
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(observableMiddleware))
  );
  observableMiddleware.run(epics);
  return store;
}
