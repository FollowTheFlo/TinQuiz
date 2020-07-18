import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonImg, IonItem, IonSearchbar, IonList } from '@ionic/react';
import { Flag } from '../redux/reducers/QuizReducer';



const SearchItem: React.FC<{ 
    key:string,
    flag: Flag,
    selectItem: any
}> = props => {

//const currentList = props.countryList.map(item => <IonItem>{{ item }}</IonItem>);
console.log('country',props.flag);
  return (
    <IonItem
    class='backGroundStyle'
    onClick = {props.selectItem.bind(null, props.flag)}
    >
        {props.flag.label}       
    </IonItem>          
  );
};

export default SearchItem;