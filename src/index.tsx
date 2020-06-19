import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import PlacesContextProvider from './data/PlacesContextProvider';
import * as serviceWorker from './serviceWorker';
import configurePlacesStore from './hooks-store/places-store';

//init the actions defined in product-store and run the init.
configurePlacesStore();

ReactDOM.render(

    <App />

,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
