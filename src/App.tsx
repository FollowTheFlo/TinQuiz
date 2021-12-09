import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, time, ribbon } from "ionicons/icons";
import Home from "./pages/Home";
import Quizes from "./pages/Quizes";
import Badges from "./pages/Badges";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import { makeStore } from "./redux/store";
import { Provider } from "react-redux";

const store = makeStore();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <IonApp id="ionApp">
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/home" component={Home} exact={true} />
              <Route path="/quizes" component={Quizes} exact={true} />
              <Route path="/badges" component={Badges} />
              <Route
                path="/"
                render={() => <Redirect to="/home" />}
                exact={true}
              />
            </IonRouterOutlet>
            <IonTabBar slot="top" class="foreGroundStyle" id="topBar">
              <IonTabButton tab="home" href="/home" class="tabButtonStyle">
                <IonIcon icon={home} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="quizes" href="/quizes" class="tabButtonStyle">
                <IonIcon icon={time} />
                <IonLabel>History</IonLabel>
              </IonTabButton>
              <IonTabButton tab="badges" href="/badges" class="tabButtonStyle">
                <IonIcon icon={ribbon} />
                <IonLabel>Badges</IonLabel>
              </IonTabButton>
            </IonTabBar>
            <IonTabBar slot="bottom" class="foreGroundStyle" id="bottomBar">
              <IonTabButton tab="home" href="/home" class="tabButtonStyle">
                <IonIcon icon={home} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="quizes" href="/quizes" class="tabButtonStyle">
                <IonIcon icon={time} />
                <IonLabel>History</IonLabel>
              </IonTabButton>
              <IonTabButton tab="badges" href="/badges" class="tabButtonStyle">
                <IonIcon icon={ribbon} />
                <IonLabel>Badges</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </Provider>
  );
};

export default App;
