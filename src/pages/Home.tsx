import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonLabel, IonItem, IonInput, IonSpinner, IonAlert, IonToggle, IonSlides, IonSegment, IonSegmentButton, IonSearchbar, IonList } from '@ionic/react';
import './Home.css';
//import { useDispatch, useMappedState } from "redux-react-hook";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import  ActionCreators  from "../redux/actions";
import { locate, closeCircleOutline } from 'ionicons/icons';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { RootState } from '../redux/reducers';
import Alert from '../components/Alert';
import QuestionItem from '../components/QuestionItem';
import { Question, Quiz, Flag } from '../redux/reducers/QuizReducer';
import { Location } from '../redux/reducers/GeoReducer';
import FlagSlide from '../components/FlagSlide';
import SearchBox from '../components/SearchBox';
import QuestionsList from '../components/QuestionsList';
import SearchItem from '../components/SearchItem';
import ThemeSegments from '../components/ThemeSegments';
import { useKeyboardState } from '@ionic/react-hooks/keyboard';
import { Theme } from '../redux/constants';


const Home: React.FC = () => {

  const slidesRef = useRef<HTMLIonSlidesElement>(null);
  const boxRef = useRef<HTMLIonSearchbarElement>(null);
  //const slidesRef = useRef();
  
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
    quizLoading: state.quiz.loading,
    quizErrorMessage: state.quiz.errorMessage,
    questions: state.quiz.quiz.questions,
    currentQuiz: state.quiz.quiz,
    flags: state.quiz.flags,
    selectedFlag: state.quiz.selectedFlag,
    loadingFlags: state.quiz.loadingFlags,
  });

  const uQuizState = (state:RootState) => ({
    questionIndex: state.uQuiz.questionIndex,
    uAnswers: state.uQuiz.uAnswers,
    isFinished: state.uQuiz.isFinished,
    totalScore: state.uQuiz.score,
    isQuizOpened: state.uQuiz.isOpened,
  });

 
  //global state
  const { target, qwantLoading, articles, proxyActivated, qwantErrorMessage } = useSelector(qwantState);
  const { location, geoErrorMessage, geoLoading } = useSelector(geoState);
  const { quizLoading, questions, currentQuiz, flags, selectedFlag, loadingFlags } = useSelector(quizState);
  const { questionIndex, uAnswers, isFinished, totalScore, isQuizOpened } = useSelector(uQuizState);
 
  //Local state
   const [searchText, setSearchText] = useState('Saint-James');
   const [isFlagSelected, setIsFlagSelected] = useState(false);
   const [suggestionCountryList, setSuggestionCountryList] = useState(
   [ {label:'France',
    image:'',
    WdCode:'Q142',
    isSelected:false,}]
   );
   const [isTyping, setIsTyping] = useState(false);
   const { isOpen, keyboardHeight } = useKeyboardState();
   const [quizTheme, setQuizTheme] = useState(Theme.ALL.toString());

  //actions dispatcher
  const dispatch = useDispatch(); 

  let hasPageLoaded = false;

//first time, set the searchbar with location town from init state
  useEffect(() => {
    console.log('useEffect location', location);
    setSearchText(location.country);
    console.log('selectFlag1');
    if(location.countryWD) {
      dispatch(ActionCreators.quizActions.selectFlag({
        WdCode: location.countryWD
      }));
  }
   
  },[location]);

   useEffect(() => {
    console.log('useEffect selectedFlag',selectedFlag.WdCode);
    if(slidesRef.current?.slideTo && selectedFlag.WdCode !== undefined) {
      //find index of selected flag
      console.log('In Condition', selectedFlag.WdCode);
      let index = flags.findIndex(f => f.WdCode === selectedFlag.WdCode);
      //there are 3 flags in screen, set the selected one in the middle, so poisition index-1
      index = index === 0 ? index : index - 1
      slidesRef.current?.slideTo(index,500);

    }
   },[selectedFlag])

   useEffect(() => {
    dispatch(ActionCreators.quizActions.runFlags());
   // setPageLoaded(false);
   },[])
  
   useEffect(() => {
   
    if(!loadingFlags && slidesRef.current?.slideTo) {
    console.log('useEffect flags1');
    console.log('selectFlag2');
      dispatch(ActionCreators.quizActions.selectFlag({
        WdCode: location.countryWD
      }));
 
    }
   
   },[loadingFlags])

   useEffect(() => {
console.log('keyboardHeight',keyboardHeight);
console.log('keyboard isOpen',isOpen);
   },[isOpen,keyboardHeight])


//////////buttons handlers

   ///Locate Me
const locateUser = () => {
  console.log('locateUser');
  dispatch(ActionCreators.geoActions.startLocation());
  
    
}
  ///Run Questions
const runQuestions = (location:Location) => {
  // setIsQuizOpen(true);
   dispatch(ActionCreators.quizActions.clearQuestionsList());
   dispatch(ActionCreators.quizActions.fillQuiz(
     {
       location
     }
   ));
   dispatch(ActionCreators.userQuizActions.startQuiz());
   dispatch(ActionCreators.quizActions.launchQuiz(
     {
       theme:quizTheme
      }
     ));
    
}

////Question Card Actions: click Yes, No, Hide
const clickYesHandler = (currentQuestion:Question) => {
  console.log('clickYesHandler Question', currentQuestion);
  if(questionIndex < questions.length) {
    dispatch(ActionCreators.userQuizActions.goNextQuestion(
     { uAnswer:{
       question: currentQuestion,
        answer: true,
        isCorrect: currentQuestion.correct? true: false,
      }}
    ));
  }  
  if(questionIndex === questions.length - 1) {
    dispatch(ActionCreators.userQuizActions.endQuiz(
      {
        quiz: currentQuiz
      }
    ));
  }
}

const clickNoHandler = (currentQuestion:Question) => {
  console.log('clickYesHandler', currentQuestion.id);
  if(questionIndex < questions.length) {
    dispatch(ActionCreators.userQuizActions.goNextQuestion(
      { uAnswer:{
        question: currentQuestion,
         answer: true,
         isCorrect: currentQuestion.correct? false: true,
       }}
    ));
  }
  if(questionIndex === questions.length - 1) {
    dispatch(ActionCreators.userQuizActions.endQuiz(
      {
        quiz: currentQuiz
      }
    ));
  }
}

const hideQuiz = () => {
  console.log('hideQuiz');
  dispatch(ActionCreators.userQuizActions.showQuiz(false));
}

///////Search Box///////
const SearchBoxValueChangedHandler = (input:string) => {
  console.log('getSearchBoxValue',input);

  setSearchText(input);
  if(input==='' || (isFlagSelected && flags.findIndex(flag => flag.label === input) !== -1)) {
    setIsTyping(false);
    return;
  }
   
  const updatedList = flags.filter(flag => flag.label.toLowerCase().indexOf(input.toLowerCase()) !== -1);
  console.log('getSearchBoxValue2',updatedList);
  setSuggestionCountryList(updatedList);
  setIsFlagSelected(false);
  setIsTyping(true);
}

const selectSuggestionItem = (flag:any) => {
  console.log('selectSuggestionItem',flag);
  setIsFlagSelected(true);
  setSearchText(flag.label);
  dispatch(ActionCreators.geoActions.setLocationFromFlag({flag}));
  dispatch(ActionCreators.quizActions.selectFlag({
    WdCode: flag.WdCode
  }));
}

const onClearSearchBox = () => {
  setIsTyping(false);
}

const setFocusOnBox = async() => {
  if(boxRef.current?.setFocus) {
    console.log('setFocusOnBox', boxRef.current?.value);
   await boxRef.current?.setFocus();
   }
 }

  //////Flags
  const selectFlagHandler = (flag:Flag) => {
    console.log('selectFlag',flag);
    setIsFlagSelected(true);
    setSearchText(flag.label);
    dispatch(ActionCreators.geoActions.setLocationFromFlag({flag}));
    console.log('selectFlag3');
    dispatch(ActionCreators.quizActions.selectFlag({
      WdCode: flag.WdCode
    }));
   // setIsTyping(false);
   
  }
  
  const flagSlides = flags.map(flag => {
    return (<FlagSlide
      flag = {flag}
      key = {flag.WdCode}
      selectFlag = {selectFlagHandler}
    />)
  })

  ///flag Slides Options
  const slideOpts = {
    initialSlide: 5 ,
    speed: 500,
    direction: 'horizontal',
    height: 100,
    slidesPerView:3
  };

 //////Theme Segments///// 
 const segmentChangeHandler = (theme:string) => {
  console.log('segmentChangeHandler',theme);
  setQuizTheme(theme);
 }
  
/////////////// Question Slides JSX //////

const questionsCount =  'questions:' + (questionIndex + 1) + '/' + questions.length;
const currentScore = 'Score: ' + uAnswers.filter(answer => answer.isCorrect === true).length + '/' + questionIndex;
const resultScore = <h2>Finished with {totalScore}%</h2>;

const loadingQuestionsSpinner = (<div><IonSpinner name='lines'/> <p>Loading Questions</p></div>)

const questionsSlides = 
    (<div><IonRow >
    <IonCol size="10">          
    {
      questions.length > 0  && currentScore
    }
    
    </IonCol>
    <IonCol>
    <IonButton onClick={hideQuiz}>
            <IonIcon icon={closeCircleOutline}></IonIcon>
            </IonButton>
    </IonCol>
    </IonRow>
    <IonRow >

    <IonCol offset="0" size="12">
    { questions.length > 0 && questionsCount }
    {
        questions.length > 0 && questions[questionIndex] && <QuestionItem
            key = {questions[questionIndex].id} 
            question = {questions[questionIndex]}
            clickYes = {clickYesHandler}
            clickNo = {clickNoHandler}
              /> 
    }
    </IonCol>
    </IonRow></div>);



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
      <IonHeader>
        <IonToolbar>
          <IonTitle>TinQuiz</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>

{
  !isFinished && isQuizOpened && questionsSlides

}

 
            <IonRow>
           <IonCol offset="0" size="12">
           {
             !isQuizOpened &&
             <IonSlides pager={false} options={slideOpts} ref={slidesRef}>
              {
                flags && flags.length>0 && flagSlides
              }
           </IonSlides>
           
           }

           </IonCol> 
           </IonRow>
           <IonRow>
             
             {
              !isQuizOpened && <ThemeSegments
                key='ThemeSegments'
                onSegmentValueChange={segmentChangeHandler}
                selectedTheme={quizTheme}
              />
              
              }
           </IonRow>
          
 { !isQuizOpened &&  <IonRow className="ion-margin-top">
            <IonCol size="9">
          
                    <span>
    <IonItem>
               
                <IonSearchbar 
                type="text" 
                debounce={500} 
                ref={boxRef}
                value={searchText} 
                 onIonClear = {() => onClearSearchBox()}
                onIonChange={e => SearchBoxValueChangedHandler(e.detail.value!)}
                ></IonSearchbar>
            </IonItem>
                <IonList>
                    
                {isTyping && suggestionCountryList.length>0 && suggestionCountryList.slice(0,5).map(flag => <SearchItem
                  key={flag.WdCode}
                  flag = {flag}
                  selectItem = {selectSuggestionItem}

                  />)}
                 </IonList>
 </span> 
              
            </IonCol>
            <IonCol >
            <IonButton onClick={locateUser}>
            <IonIcon icon={locate}></IonIcon>
            </IonButton>
            </IonCol>
          </IonRow>
          }
          { !isQuizOpened &&
          <IonRow className="ion-margin-top">
            <IonCol offset="2" size="8">
                  <IonButton onClick={()=>runQuestions(location)}>
                  <IonLabel>Launch Quiz</IonLabel>
                </IonButton>
              </IonCol>
          </IonRow>
          }
          

          <IonRow className="ion-margin-top">
            <IonCol 
              class='ion-text-center'
              offset="2" size="8">
           {
            geoLoading && <IonSpinner name='dots'/> 
            }
             {
            quizLoading && loadingQuestionsSpinner
            }
          
            </IonCol>
            </IonRow>
            <IonRow >
              <IonCol offset="0" size="12">          
              {
                 isFinished && isQuizOpened && resultScore
               }
              </IonCol>
            </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
