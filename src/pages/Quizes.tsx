import React, { useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Quizes.css';
import { RootState } from '../redux/reducers';
import { useSelector } from 'react-redux';
import HistoryItem from '../components/HistoryItem';
import { historyItem } from '../redux/reducers/UquizReducer';

const Quizes: React.FC = () => {

  const uQuizState = (state:RootState) => ({
    historyItems: state.uQuiz.historyItems,
  });
  const { historyItems} = useSelector(uQuizState);
 

  const contentNull = <p>No Places</p>;

  //  const content =   places.map((place: Place) => {
  //   // console.log('Quizes2',place)
  //   return (<PlaceItem key={place.id} place={place} />)
  // });
  const historyContent =   
  historyItems.map((item: historyItem) => {   
    return (<HistoryItem 
      key = {item.id} 
      historyItem = {item}
    />)
    })

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {
          historyItems && historyItems.length>0 && historyContent
        }
        
      </IonContent>
    </IonPage>
  );
};

export default Quizes;
