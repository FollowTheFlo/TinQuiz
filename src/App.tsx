import React, { useEffect, useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle, home } from 'ionicons/icons';
import Home from './pages/Home';
import Quizes from './pages/Quizes';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import PlaceContext from './data/places-context';
import {StoreContext} from 'redux-react-hook';
import {makeStore} from './redux/store';
import { Provider } from 'react-redux';

const store = makeStore();

const App: React.FC = () => {

  // const placeCtx = useContext(PlaceContext);
  // const { initContext } = placeCtx;

  // useEffect(() => {
  //   initContext();
  // },[initContext]);

  return (
    <Provider store={store}>
  <IonApp>
    <IonReactRouter>
      <div id="mainTabs">
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/home" component={Home} exact={true} />
          <Route path="/quizes" component={Quizes} exact={true} />
          <Route path="/tab3" component={Tab3} />
          <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom" class="foreGroundStyle" >
          <IonTabButton tab="home" href="/home" class="tabButtonStyle">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="quizes" href="/quizes" class="tabButtonStyle">
            <IonIcon icon={ellipse} />
            <IonLabel>History</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      </div>
    </IonReactRouter>
  </IonApp>
  </Provider>
  );
  };

export default App;
