import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonLabel, IonItem, IonInput, IonSpinner, IonAlert, IonToggle } from '@ionic/react';
import './Home.css';
//import { useDispatch, useMappedState } from "redux-react-hook";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { QwantArticle } from "../redux/store";
import { ActionCreators } from "../redux/actions";
import QwantItem from './../components/QwantItem';
import { starOutline } from 'ionicons/icons';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { RootState } from '../redux/reducers';


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

 
  //global state
  const { target, qwantLoading, articles, proxyActivated, qwantErrorMessage } = useSelector(qwantState);
  const { location, geoErrorMessage, geoLoading } = useSelector(geoState);
 
  //Local state
   const [searchText, setSearchText] = useState('Saint-James');
 
  const dispatch = useDispatch();


//first time, set the searcbar with location town from init state
  useEffect(() => {
    console.log('useEffect location');
    setSearchText(location.place + ' ' + location.country);
  },[location.place, location.country]);

  
  const launchQwant = (text:string) => {
   
    if( text) {
      setSearchText(text);
      dispatch(ActionCreators.startQwantSearch( { 
        target: text,
        locale: 'fr'  
      }));
    } else {
      console.log("field empty");
    }
      
}

const locateUser = () => {
  console.log('locateUser');
  dispatch(ActionCreators.startLocation());
  
}
  const proxyToggleChange = 
  (isChecked:boolean) => {
    console.log('proxyToggleChange', isChecked);
    dispatch(ActionCreators.changeProxyActivation(isChecked));

  }

  const deleteQwantItemHandler = (index:string) => {
    console.log('deleteQwantItem', index);
    dispatch(ActionCreators.deleteQwantArticle(index));

  }

  const selectItemhandler = (index:string) => {
    console.log('deleteQwantItem', index);
    dispatch(ActionCreators.selectQwantArticle(index));

  }

  const contentNull = <p>No Articles, please search with Qwant</p>;

   const articlesContent =   articles.map((article: QwantArticle) => {   
    return (<QwantItem 
      key = {article.id} 
      qwantArticle = {article} 
      deleteItem = {deleteQwantItemHandler} 
      selectItem = {selectItemhandler} 
      />)
  });

  return (
    <IonPage>
      <IonAlert
          isOpen={geoErrorMessage !== "" ? true : false}
          onDidDismiss={() => {
            dispatch(ActionCreators.clearGeoErrorMessage());
            
          }}
          header={'Error'}
          subHeader={geoErrorMessage}
          message={geoErrorMessage}
          buttons={['OK']}
        />
      <IonAlert
        isOpen={qwantErrorMessage !== "" ? true : false}
        onDidDismiss={() => {
          dispatch(ActionCreators.clearQwantErrorMessage());
          
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
                <IonLabel position="floating">Qwant search</IonLabel>
                <IonInput type="text" value={searchText} ref={qwantKeyRef}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow className="ion-margin-top">
            <IonCol offset="4" size="3">
  
            <IonButton onClick={locateUser}>
               <IonLabel>Locate Me</IonLabel>
            </IonButton>
            
            <IonButton onClick={
              
              (qwantKeyRef && qwantKeyRef.current && qwantKeyRef.current.value) ?
              // @ts-ignore
                () => launchQwant(qwantKeyRef.current.value.toString()) :
                () => launchQwant("")

              
              }>
               <IonLabel>Qwant Search</IonLabel>
            </IonButton>
          
           
            </IonCol>
          </IonRow>
          <IonRow>
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
          </IonRow>
          <IonRow className="ion-margin-top">
            <IonCol offset="6" size="1">
           {
            qwantLoading ? <IonSpinner name='circles'/> : ''
           }
           {
            geoLoading ? <IonSpinner name='dots'/> : ''
            }
            </IonCol>
            </IonRow>
            <IonRow className="ion-margin-top">
              <IonCol offset="2" size="8">
              {
          
                   articles.length > 0 ? articlesContent : contentNull
          
               }
        
              </IonCol>
            </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
