import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonImg, IonItem, IonSearchbar, IonList } from '@ionic/react';
import SearchItem from './SearchItem';
import { Flag } from '../redux/reducers/QuizReducer';



const SearchBox: React.FC<{ 
    key:string,
    searchText: string, 
    isTyping:boolean, 
    getSearchBoxValue:any, 
    countryList:Flag[],
    boxRef:any,
    selectItem:any,
    looseFocus:any
}> = props => {

//const currentList = props.countryList.map(item => <IonItem>{{ item }}</IonItem>);
console.log('countryList',props.countryList);
const countryItems = props.countryList.slice(0,5).map(flag => <SearchItem
key={flag.WdCode}
flag = {flag}
selectItem = {props.selectItem}

/>)
  return (
      <span>
    <IonItem>
               
                <IonSearchbar 
                type="text" 
                debounce={2000} 
                ref={props.boxRef}
                value={props.searchText} 
                 onIonClear = {() => props.looseFocus()}
                onIonChange={e => props.getSearchBoxValue(e.detail.value!)}
                ></IonSearchbar>
            </IonItem>
                <IonList>
                    
                {props.isTyping && props.countryList.length>0 && countryItems}
                 </IonList>
 </span>          
  );
};

export default SearchBox;