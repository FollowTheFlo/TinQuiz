import React, { useRef } from 'react';
import { createGesture, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonImg,Gesture, GestureConfig } from '@ionic/react';
import { Question } from '../redux/reducers/QuizReducer';
import { key } from 'ionicons/icons';

const QuestionItem: React.FC<{ 
  question: Question,
  key:string,
  clickYes:any,
  clickNo:any}
  > = props => {
    const drawerRef = useRef<any>();

    React.useEffect(() => {
      let c = drawerRef.current;
      const style = c.style;
      const windowWidth = window.innerWidth;
      console.log('windowWidth QuestionItem', windowWidth);
      const gesture = createGesture({
       
        el: c,
        gestureName: "my-swipe",
       // direction: "x"|"y",
        onStart: ()=>{
          style.transition = "none";
         // style.transform = `translateX(100px) rotate(30deg)`
        },
        onMove : (ev)=> {
          console.log('onMove');
          style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX/20}deg)`
     
        },
        onEnd : (ev)=> {
    
          style.transition = "0.3s ease-out";
    
          if(ev.deltaX > windowWidth/3){
            style.transform = `translateX(${windowWidth * 1.5}px)`;
            console.log('on right');
          const sendYes =() => props.clickYes(props.question);
          setTimeout(() => sendYes(), 300);
           // this.match.emit(true);
          } else if (ev.deltaX < -windowWidth/3){
            style.transform = `translateX(-${windowWidth * 1.5}px)`;
           // this.match.emit(false);
           const sendNo = () => props.clickNo(props.question);
           setTimeout(() => sendNo(), 300); 
           
            console.log('on left');
          } else {
            style.transform = ''
          }
        }
    })
    // enable the gesture for the item
    gesture.enable(true);

      return () => {
        console.log('gesture.destroy()');
      gesture.destroy();
    };
    }, []);

    const clickNo = (question:Question) => {
      console.log('local clickNo');
      const sendNo = () => props.clickNo(question);
      let c = drawerRef.current;
      const windowWidth = window.innerWidth;
      c.style.transition = ".3s ease-in";
      c.style.transform = `translateX(-${windowWidth * 1.5}px) rotate(-30deg)`;
      setTimeout(() => sendNo(), 300);      
    }

    const clickYes = (question:Question) => {
      console.log('local clickNo');
      const sendYes = () => props.clickYes(question);
      let c = drawerRef.current;
      const windowWidth = window.innerWidth;
      c.style.transition = ".5s ease-in";
      c.style.transform = `translateX(${windowWidth * 1.5}px) rotate(30deg)`;
      setTimeout(() => sendYes(), 500);
    }

  return (
    <IonCard 
    ref={drawerRef}
    >
      <IonCardHeader>
        <div id='questionHeader'>
        <IonCardTitle>{props.question.phrase}</IonCardTitle>
        <br/>
        <IonButton class='falseButton' size='default' onClick={()=>clickNo(props.question)}>False</IonButton>
        <IonButton class='trueButton' size='default' onClick={() =>clickYes(props.question)}>True</IonButton>
       <br/><br/>
  <IonCardSubtitle>{props.question.label}</IonCardSubtitle>
  </div>
      </IonCardHeader>
      <IonCardContent>
      <IonImg src={props.question.image} />
      </IonCardContent>
    </IonCard>
  );
};

export default QuestionItem;