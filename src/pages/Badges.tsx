import React, { useCallback, useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
} from "@ionic/react";
import "./Badges.css";
import { RootState } from "../redux/reducers";
import { useSelector, useDispatch } from "react-redux";
import ActionCreators from "../redux/actions";
import { Theme } from "../redux/constants";
import BadgesSegments from "../components/BadgesSegment";
import BadgesList from "../components/BadgesList";

const Badges: React.FC = () => {
  //const categories = [Theme.ALL,Theme.CINEMA,Theme.FOOD,Theme.CELEBRITIES,Theme.GEO,Theme.ENTERPRISES];
  const categories = Object.values(Theme);
  const uQuizState = (state: RootState) => ({
    badgesItems: state.uQuiz.badges,
    flags: state.quiz.flags,
  });

  const { badgesItems, flags } = useSelector(uQuizState);
  const dispatch = useDispatch();

  const [scope, setScope] = useState("USER");

  useEffect(() => {
    console.log("Badges UseEffect once");
    dispatch(ActionCreators.quizActions.runFlags());
  }, []);

  // avoid re-evaluation at every state change with useCallback.
  // does not recreate a ref everytime, keeps very first ref, focus only on 'scope' param changes
  const segmentChangeHandler = useCallback((newScope: string) => {
    console.log("segmentChangeHandler", newScope);
    setScope(newScope);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="badgesToolbar">
          <IonTitle>Badges</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="backGroundStyle">
        <BadgesSegments
          key="BadgesSegment"
          onSegmentValueChange={segmentChangeHandler}
          selectedScope={scope}
        />
        <IonGrid>
          {flags && flags.length > 0 && (
            <BadgesList badges={badgesItems} filter={scope} flags={flags} />
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Badges;
