import React, { useContext, useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSlides, IonSlide, IonCol, IonRow, IonGrid, IonIcon } from '@ionic/react';
import './Badges.css';
import { RootState } from '../redux/reducers';
import { useSelector, useDispatch } from 'react-redux';
import HistoryElement from '../components/HistoryElement';
import { HistoryItem, Badge } from '../redux/reducers/UquizReducer';
import FlagSlide from '../components/FlagSlide';
import { Flag } from '../redux/reducers/QuizReducer';
import  ActionCreators  from "../redux/actions";
import BadgeElement from '../components/BadgeElement';
import { trophy, film, ribbon, restaurantOutline, peopleCircleOutline } from 'ionicons/icons';
import { Theme } from '../redux/constants';
import BadgesSegments from '../components/BadgesSegment';

const Badges: React.FC = () => {

//const categories = [Theme.ALL,Theme.CINEMA,Theme.FOOD,Theme.CELEBRITIES,Theme.GEO,Theme.ENTERPRISES];
const categories = Object.values(Theme);
  const uQuizState = (state:RootState) => ({ 
    badgesItems: state.uQuiz.badges,
    flags: state.quiz.flags,
  });

  const { badgesItems, flags } = useSelector(uQuizState);
  const dispatch = useDispatch(); 

  const [scope, setScope] = useState('ALL');

  useEffect(() => {
    console.log('Badges UseEffect');
    dispatch(ActionCreators.quizActions.runFlags());
    
   },[])

  const badgesList = (badges:Badge[], filter:string) => {
  
  return flags
  .filter(flag => {
    if(filter=== 'USER') {
      return badges.findIndex(b => b.countryWD === flag.WdCode ) != -1;
    }
    return true;
  })
  .map(flag => {
    return (<IonCol>
      {
      categories
      .filter(cat => {
        if(filter=== 'USER') {
          return badges.findIndex(b => b.theme === cat && b.countryWD === flag.WdCode ) != -1;
        }
        return true;
      })
      .map(cat => {
       // return stylingBadges(badges,flag, cat);
       return <BadgeElement 
        key= {flag.WdCode + cat + flag.label}
        flag = {flag}
        badges = {badges}
        theme = {cat}
        selectBadge = {() => {}}
       />
      })
      }
    </IonCol>)
  })}

  const segmentChangeHandler = (scope:string) => {
    console.log('segmentChangeHandler',scope);
    setScope(scope);
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar id="badgesToolbar">
          <IonTitle>Badges</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="backGroundStyle">
        <BadgesSegments
        
        key='BadgesSegment'
        onSegmentValueChange= {segmentChangeHandler}
        selectedScope= {scope}/>
        <IonGrid>
          {
            flags && flags.length>0 && badgesList(badgesItems, scope)
          }
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Badges;
