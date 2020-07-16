import React, { useContext, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSlides, IonSlide } from '@ionic/react';
import './Quizes.css';
import { RootState } from '../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import HistoryItem from '../components/HistoryItem';
import { historyItem } from '../redux/reducers/UquizReducer';
import FlagSlide from '../components/FlagSlide';
import { Flag } from '../redux/reducers/QuizReducer';
import  ActionCreators  from "../redux/actions";

const Quizes: React.FC = () => {


  const uQuizState = (state:RootState) => ({
    historyItems: state.uQuiz.historyItems,
  });

  const { historyItems } = useSelector(uQuizState);

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
