import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle } from '@ionic/react';
import { Place } from './../data/places-context';


const PlaceItem: React.FC<{ place: Place }> = props => {
  return (
    <IonCard >
      <IonCardHeader>
        <IonCardTitle>{props.place.town}</IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default PlaceItem;