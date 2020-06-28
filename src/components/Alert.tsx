import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonAlert } from '@ionic/react';
import { QwantArticle } from './../redux/store';


const Alert: React.FC<{ 
    onDidDismissHandler:any,
    isOpen:boolean,
    header:string,
    subHeader:string,
    message:string
}> = props => {
  return (
    <IonAlert
          isOpen={props.isOpen}
          onDidDismiss={props.onDidDismissHandler}
          header={props.header}
          subHeader={props.subHeader}
          message={props.message}
          buttons={['OK']}
        />
    
  );
};

export default Alert;