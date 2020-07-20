import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonImg } from '@ionic/react';
import { QwantArticle } from '../redux/store';
import { Question } from '../redux/reducers/QuizReducer';
import { HistoryItem } from '../redux/reducers/UquizReducer';


const HistoryElement: React.FC<{ historyItem: HistoryItem, key:string}> = props => {
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

export default HistoryElement;