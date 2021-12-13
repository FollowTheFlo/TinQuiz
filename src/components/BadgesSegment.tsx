import React, { useEffect } from "react";
import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

const BadgesSegments: React.FC<{
  key: string;
  onSegmentValueChange: any;
  selectedScope: string;
}> = (props) => {
  useEffect(() => {
    console.log("in BadgesSegments");
  });
  return (
    <IonSegment
      scrollable={false}
      value={props.selectedScope}
      onIonChange={(e) => props.onSegmentValueChange(e.detail.value)}
    >
      <IonSegmentButton value={"ALL"}>
        <IonLabel>All Badges</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value={"USER"}>
        <IonLabel>My Badges</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
};

export default React.memo(BadgesSegments);
