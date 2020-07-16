import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonImg } from '@ionic/react';
import { QwantArticle } from './../redux/store';
import { Question } from '../redux/reducers/QuizReducer';


const QuestionItem: React.FC<{ 
  question: Question,
  key:string,
  clickYes:any,
  clickNo:any}
  > = props => {
  return (
    <IonCard 
    >
      <IonCardHeader >
        <IonCardTitle>{props.question.phrase}</IonCardTitle>
        <IonButton onClick={props.clickYes.bind(null, props.question)}>Yes</IonButton>
         <IonButton onClick={props.clickNo.bind(null, props.question)}>No</IonButton>
  <IonCardSubtitle>{props.question.label}-{props.question.correctArea}</IonCardSubtitle>
        <IonImg src={props.question.image} />
      </IonCardHeader>
    </IonCard>
  );
};

export default QuestionItem;