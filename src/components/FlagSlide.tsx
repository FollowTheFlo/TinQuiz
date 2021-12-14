import React, { useEffect } from "react";
import { IonCard, IonCardHeader, IonImg, IonSlide } from "@ionic/react";
import { Flag } from "../redux/reducers/QuizReducer";

const FlagSlide: React.FC<{
  flag: Flag;
  key: string;
  selectedFlagChanged: any;
}> = (props) => {
  useEffect(() => {
    console.log("FlagSlide");
  });
  return (
    <IonSlide>
      <IonCard
        onClick={() => props.selectedFlagChanged(props.flag)}
        color={props.flag.isSelected ? "success" : ""}
      >
        <IonCardHeader>
          <IonImg src={props.flag.image} />
        </IonCardHeader>
      </IonCard>
    </IonSlide>
  );
};

export default FlagSlide;
