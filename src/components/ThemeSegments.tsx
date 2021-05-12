import React from 'react';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import { Theme } from '../redux/constants';

const ThemeSegments: React.FC<{ 
    key:string,
    onSegmentValueChange:any
    selectedTheme:string
}> = props => {

  return (
    <IonSegment 
    id="flagsSegment"
    scrollable = {true}
    value= {props.selectedTheme}
    onIonChange={e => props.onSegmentValueChange(e.detail.value)}>
    <IonSegmentButton value={Theme.ALL.toString()} >
      <IonLabel>All</IonLabel>
    </IonSegmentButton>
    <IonSegmentButton value={Theme.CINEMA.toString()}>
      <IonLabel>Cinema</IonLabel>
    </IonSegmentButton>
    <IonSegmentButton value={Theme.GEO.toString()}>
      <IonLabel>Geography</IonLabel>
    </IonSegmentButton>
    <IonSegmentButton value={Theme.CELEBRITIES.toString()}>
      <IonLabel>Celebrities</IonLabel>
    </IonSegmentButton>
    <IonSegmentButton value={Theme.FOOD.toString()}>
      <IonLabel>Food</IonLabel>
    </IonSegmentButton>
    <IonSegmentButton value={Theme.ENTERPRISES.toString()}>
      <IonLabel>Enterprises</IonLabel>
    </IonSegmentButton>
   </IonSegment>          
  );
};

export default ThemeSegments;