import React, { useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Quizes.css';
import PlaceItem from './../components/PlaceItem';
import PlaceContext, { Place } from './../data/places-context';
import { useStore } from '../hooks-store/store';

import useGlobal from '../store';
import { MyState, MyAssociatedActions} from './../store'


import  ActionCreators  from './../redux/actions'

const Quizes: React.FC = () => {

    // @ts-ignore
    // const [state, actions] = useGlobal<MyState, MyAssociatedActions>();
    // console.log('Quizes state:', state );

    // const mapState = (state: IState) => ({
    //   lastUpdated: state.lastUpdated,
    //   places: state.places
    // });
    // const { places } = useMappedState(mapState);

  // const placeCtx = useContext(PlaceContext);
  // const places = [...placeCtx.places];

  // const state = useStore()[0];
//console.log('Quizes', state);
  const contentNull = <p>No Places</p>;

  //  const content =   places.map((place: Place) => {
  //   // console.log('Quizes2',place)
  //   return (<PlaceItem key={place.id} place={place} />)
  // });
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Quizes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* {
          // @ts-ignore
          places.length > 0 ? content : contentNull
          
        } */}
        
      </IonContent>
    </IonPage>
  );
};

export default Quizes;
