import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonImg } from '@ionic/react';
import { QwantArticle } from './../redux/store';
import { Question } from '../redux/reducers/QuizReducer';
import { historyItem } from '../redux/reducers/UquizReducer';


const HistoryItem: React.FC<{ historyItem: historyItem, key:string}> = props => {
  return (
    <IonCard 
    >
      <IonCardHeader >
        <IonCardTitle>{props.historyItem.country} - Theme: {props.historyItem.theme}</IonCardTitle>
        <IonCardSubtitle>{props.historyItem.score}%</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default HistoryItem;