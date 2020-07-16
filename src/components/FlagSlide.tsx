import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonImg, IonSlide } from '@ionic/react';
import { QwantArticle } from './../redux/store';
import { Question, Flag } from '../redux/reducers/QuizReducer';


const FlagSlide: React.FC<{ flag: Flag, key:string, selectFlag:any}> = props => {
  return (
      <IonSlide>
        <IonCard onClick={() => props.selectFlag(props.flag)}
        color = { props.flag.isSelected ? 'success' : ''}
        >
        <IonCardHeader >
            
            <IonImg src={props.flag.image} />
        </IonCardHeader>
        </IonCard>
    </IonSlide>
  );
};

export default FlagSlide;