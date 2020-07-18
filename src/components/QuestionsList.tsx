import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonImg, IonRow, IonCol, IonIcon } from '@ionic/react';
import { QwantArticle } from '../redux/store';
import { Question } from '../redux/reducers/QuizReducer';
import { closeCircleOutline } from 'ionicons/icons';
import QuestionItem from './QuestionItem';


const QuestionsList: React.FC<{ 
        questions: Question[],
        key:string,
        currentScore:string,
        hideQuiz:any,
        questionsCount:string,
        questionIndex:number,
        clickYesHandler:any,
        clickNoHandler:any
    }> = props => {

    
  return (
      
        <div><IonRow >
    <IonCol size="10">          
    {
      props.questions.length > 0  && props.currentScore
    }
    
    </IonCol>
    <IonCol>
    <IonButton onClick={props.hideQuiz}>
            <IonIcon icon={closeCircleOutline}></IonIcon>
            </IonButton>
    </IonCol>
    </IonRow>
    <IonRow >

    <IonCol offset="0" size="12">
    { props.questions.length > 0 && props.questionsCount }
    {
        props.questions.length > 0 && props.questions[props.questionIndex] && <QuestionItem
            key = {props.questions[props.questionIndex].id} 
            question = {props.questions[props.questionIndex]}          
            clickYes = {props.clickYesHandler}
            clickNo = {props.clickNoHandler}
              /> 
    }
    </IonCol>
    </IonRow></div>
      
  );
};

export default QuestionsList;