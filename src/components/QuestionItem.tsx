import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonImg } from '@ionic/react';
import { QwantArticle } from './../redux/store';
import { Question } from '../redux/reducers/QuizReducer';


const QuestionItem: React.FC<{ question: Question, key:string, clickYes:any, clickNo:any}> = props => {
  return (
    <IonCard 
    >
      <IonCardHeader >
        <IonCardTitle>{props.question.phrase}</IonCardTitle>
  <IonCardSubtitle>{props.question.label}</IonCardSubtitle>
        <IonImg src={props.question.image} />
      </IonCardHeader>
        <IonCardContent>         
         <IonButton onClick={props.clickYes.bind(null, props.question)}>Yes</IonButton>
         <IonButton onClick={props.clickNo.bind(null, props.question)}>No</IonButton>
        </IonCardContent>
    </IonCard>
  );
};

export default QuestionItem;