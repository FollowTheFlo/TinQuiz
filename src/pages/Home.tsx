import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonLabel, IonItem, IonInput, IonSpinner, IonAlert, IonToggle } from '@ionic/react';
import './Home.css';
//import { useDispatch, useMappedState } from "redux-react-hook";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { QwantArticle } from "../redux/store";
import  ActionCreators  from "../redux/actions";
import QwantItem from './../components/QwantItem';
import { starOutline } from 'ionicons/icons';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { RootState } from '../redux/reducers';
import Alert from '../components/Alert';
import QuestionItem from '../components/QuestionItem';
import { Question } from '../redux/reducers/QuizReducer';


const Home: React.FC = () => {

  const qwantKeyRef = useRef<HTMLIonInputElement>(null);
  
  const qwantState = (state: RootState) => ({
    qwantLoading: state.qwant.qwantLoad,
    articles: state.qwant.qwantArticles,
    target: state.qwant.target,
    proxyActivated: state.qwant.proxyActivated,
    qwantErrorMessage:  state.qwant.errorMessage

  });
  const geoState = (state: RootState) => ({
    location: state.geo.location,
    geoErrorMessage: state.geo.errorMessage,
    geoLoading: state.geo.loading,
  });

  const quizState = (state:RootState) => ({
    distractor: state.quiz.quiz.distractor,
    quizLoading: state.quiz.loading,
    quizErrorMessage: state.quiz.errorMessage,
    questions: state.quiz.quiz.questions,
  });

 
  //global state
  const { target, qwantLoading, articles, proxyActivated, qwantErrorMessage } = useSelector(qwantState);
  const { location, geoErrorMessage, geoLoading } = useSelector(geoState);
  const { quizLoading, distractor, questions } = useSelector(quizState);
 
  //Local state
   const [searchText, setSearchText] = useState('Saint-James');
 
  const dispatch = useDispatch();


//first time, set the searchbar with location town from init state
  useEffect(() => {
    console.log('useEffect location', location);
    setSearchText(location.place + ' ' + location.region + ' ' + location.country);
  },[location.place,location.region, location.country]);

  
  const launchQwant = (text:string) => {
   
    if( text) {
      setSearchText(text);
      dispatch(ActionCreators.qwantActions.startQwantSearch( { 
        target: text,
        locale: 'fr'  
      }));
    } else {
      console.log("field empty");
    }
      
}

const locateUser = () => {
  console.log('locateUser');
  dispatch(ActionCreators.geoActions.startLocation());
  
}

const fillQuiz = () => {
  console.log('fillQuiz');
  if(location.place) {
    console.log('fillQuiz1');
    dispatch(ActionCreators.quizActions.runDistractor(
    {
      location: location,
    }
));
  }
}
const questionList = [
  {
    theme: 'personByRegion',
    type: 'region',
    isDistractor: false,
  },
  {
    theme: 'personByRegion',
    type: 'region',
    isDistractor: true,
  },
  {
    theme: 'musicianByCountry',
    type: 'region',
    isDistractor: false,
  },
  {
    theme: 'musicianByCountry',
    type: 'region',
    isDistractor: true,
  }
];
const runQuestions = () => {

    dispatch(ActionCreators.quizActions.runQuestionsList());
    
 
}

  const proxyToggleChange = 
  (isChecked:boolean) => {
    console.log('proxyToggleChange', isChecked);
    dispatch(ActionCreators.qwantActions.changeProxyActivation(isChecked));

  }

  const deleteQwantItemHandler = (index:string) => {
    console.log('deleteQwantItem', index);
    dispatch(ActionCreators.qwantActions.deleteQwantArticle(index));

  }

  const selectItemhandler = (index:string) => {
    console.log('deleteQwantItem', index);
    dispatch(ActionCreators.qwantActions.selectQwantArticle(index));

  }

  const contentNull = <p>No Questions, press 'Fill Questions'</p>;

   const articlesContent =   articles.map((article: QwantArticle) => {   
    return (<QwantItem 
      key = {article.id} 
      qwantArticle = {article} 
      deleteItem = {deleteQwantItemHandler} 
      selectItem = {selectItemhandler} 
      />)
  });

  const questionsContent =   questions.map((question: Question) => {   
    return (<QuestionItem 
      key = {question.id} 
      question = {question} 
      />)
  });

  return (
    <IonPage>
      <IonAlert
          isOpen={geoErrorMessage !== "" ? true : false}
          onDidDismiss={() => {
            dispatch(ActionCreators.geoActions.clearGeoErrorMessage());
            
          }}
          header={'Error'}
          subHeader={geoErrorMessage}
          message={geoErrorMessage}
          buttons={['OK']}
        />
      <IonAlert
        isOpen={qwantErrorMessage !== "" ? true : false}
        onDidDismiss={() => {
          dispatch(ActionCreators.qwantActions.clearQwantErrorMessage());
          
        }}
        header={'Error'}
        subHeader={qwantErrorMessage}
        message="CORS Problem: Try with ReversProxy On. or Moesif CORS add-on"
        buttons={['OK']}
      />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
        <IonRow>
            <IonCol offset="2" size="8">
              <IonItem>
                <IonLabel position="floating">Location</IonLabel>
                <IonInput type="text" value={searchText} ref={qwantKeyRef}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow className="ion-margin-top">
            <IonCol offset="4" size="3">
  
            <IonButton onClick={locateUser}>
               <IonLabel>Locate Me</IonLabel>
            </IonButton>
            {/* <IonButton onClick={fillQuiz}>
               <IonLabel>Run Distractor</IonLabel>
            </IonButton> */}
            {
              (distractor.country && distractor.countryWD) ? 
                <IonButton onClick={runQuestions}>
                  <IonLabel>Run Questions</IonLabel>
                </IonButton>
              : ''
            }
       
            
            {/* <IonButton onClick={
              
              (qwantKeyRef && qwantKeyRef.current && qwantKeyRef.current.value) ?
              // @ts-ignore
                () => launchQwant(qwantKeyRef.current.value.toString()) :
                () => launchQwant("")

              
              }>
               <IonLabel>Qwant Search</IonLabel>
            </IonButton> */}
          
           
            </IonCol>
          </IonRow>
          {/* <IonRow>
            <IonCol offset="2" size="8">
            <IonItem>
              <IonLabel>Reverse Proxy</IonLabel>
              <IonToggle 
               checked={proxyActivated} onIonChange={e => {
                 console.log('IonToggle', e);
                 proxyToggleChange(e.detail.checked);
                }}
              color="primary" />
            </IonItem>
            </IonCol>
          </IonRow> */}
          <IonRow className="ion-margin-top">
            <IonCol offset="6" size="1">
           {
            qwantLoading ? <IonSpinner name='circles'/> : ''
           }
           {
            geoLoading ? <IonSpinner name='dots'/> : ''
            }
             {
            quizLoading ? <IonSpinner name='lines'/> : ''
            }
            </IonCol>
            </IonRow>
            <IonRow className="ion-margin-top">
              
              <IonCol offset="1" size="10">
              
            {/* <IonItem>
               <IonLabel> {distractor.country} </IonLabel>
               <IonLabel> {distractor.region} </IonLabel>
               <IonLabel> {distractor.place} </IonLabel>
            </IonItem> */}
                  
                   
          
               
        
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin-top">

              <IonCol offset="1" size="10">
              {
          
                   questions.length > 0 ? questionsContent : contentNull
          
               }
        
              </IonCol>
            </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
