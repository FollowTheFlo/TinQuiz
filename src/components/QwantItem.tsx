import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton } from '@ionic/react';
import { QwantArticle } from './../redux/store';


const PlaceItem: React.FC<{ qwantArticle: QwantArticle, key:string, deleteItem:any, selectItem:any }> = props => {
  return (
    <IonCard onClick={() => props.selectItem(props.qwantArticle.id)}
    color = { props.qwantArticle.selected ? 'success' : 'warning'}
    >
      <IonCardHeader >
        <IonCardTitle>{props.qwantArticle.title}</IonCardTitle>
        <IonCardSubtitle><a href={props.qwantArticle.link} rel="noopener noreferrer" target="_blank">{props.qwantArticle.link}</a></IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>         
          <IonButton onClick={props.deleteItem.bind(null, props.qwantArticle.id)}>Delete</IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default PlaceItem;