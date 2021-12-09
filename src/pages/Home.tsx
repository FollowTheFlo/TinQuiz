import React, { useState, useRef, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonLabel,
  IonItem,
  IonSpinner,
  IonAlert,
  IonSlides,
  IonSearchbar,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
} from "@ionic/react";
import "./Home.css";
//import { useDispatch, useMappedState } from "redux-react-hook";
import { useDispatch, useSelector } from "react-redux";
import ActionCreators from "../redux/actions";
import { locate, closeCircleOutline } from "ionicons/icons";
import { RootState } from "../redux/reducers";
import QuestionItem from "../components/QuestionItem";
import { Question, Flag } from "../redux/reducers/QuizReducer";
import { Location } from "../redux/reducers/GeoReducer";
import FlagSlide from "../components/FlagSlide";
import SearchItem from "../components/SearchItem";
import ThemeSegments from "../components/ThemeSegments";
import { Theme } from "../redux/constants";
import ResultPanel from "../components/ResultPanel";
import BadgeElement from "../components/BadgeElement";
import { Badge } from "../redux/reducers/UquizReducer";

const Home: React.FC = () => {
  const slidesRef = useRef<HTMLIonSlidesElement>(null);
  const boxRef = useRef<HTMLIonSearchbarElement>(null);

  const geoState = (state: RootState) => ({
    location: state.geo.location,
    geoErrorMessage: state.geo.errorMessage,
    geoLoading: state.geo.loading,
  });

  const quizState = (state: RootState) => ({
    quizLoading: state.quiz.loading,
    quizErrorMessage: state.quiz.errorMessage,
    questions: state.quiz.quiz.questions,
    flags: state.quiz.flags,
    selectedFlag: state.quiz.selectedFlag,
    loadingFlags: state.quiz.loadingFlags,
  });

  const uQuizState = (state: RootState) => ({
    historyItem: state.uQuiz.historyItems,
    questionIndex: state.uQuiz.questionIndex,
    uAnswers: state.uQuiz.uAnswers,
    isFinished: state.uQuiz.isFinished,
    totalScore: state.uQuiz.score,
    isQuizOpened: state.uQuiz.isOpened,
    showResultPanel: state.uQuiz.showResultPanel,
    badgesItems: state.uQuiz.badges,
  });

  //global state
  const { location, geoErrorMessage, geoLoading } = useSelector(geoState);
  const { quizLoading, questions, flags, selectedFlag, loadingFlags } =
    useSelector(quizState);
  const {
    questionIndex,
    uAnswers,
    isFinished,
    totalScore,
    isQuizOpened,
    showResultPanel,
    historyItem,
    badgesItems,
  } = useSelector(uQuizState);

  //Local state
  const [searchText, setSearchText] = useState("Saint-James");
  const [isFlagSelected, setIsFlagSelected] = useState(false);
  const [suggestionCountryList, setSuggestionCountryList] = useState([
    { label: "France", image: "", WdCode: "Q142", isSelected: false },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const [quizTheme, setQuizTheme] = useState(Theme.ALL.toString());

  //actions dispatcher
  const dispatch = useDispatch();

  //first time, set the searchbar with location town from init state
  useEffect(() => {
    console.log("useEffect location", location);
    setSearchText(location.country);
    console.log("selectFlag1");
    if (location.countryWD) {
      dispatch(
        ActionCreators.quizActions.selectFlag({
          WdCode: location.countryWD,
        })
      );
    }
  }, [location]);

  useEffect(() => {
    console.log("useEffect selectedFlag", selectedFlag.WdCode);
    // display flags slider with current selected flag in middle
    if (slidesRef.current?.slideTo && selectedFlag.WdCode !== undefined) {
      //find index of selected flag
      console.log("In Condition FLAGS", flags);
      let index = flags.findIndex((f) => f.WdCode === selectedFlag.WdCode);
      //there are 3 flags in screen, set the selected one in the middle, so poisition index-1
      index = index === 0 ? index : index - 1;
      slidesRef.current?.slideTo(index, 500);
    }
  }, [selectedFlag]);

  useEffect(() => {
    // first access
    dispatch(ActionCreators.quizActions.runFlags());
    dispatch(ActionCreators.userQuizActions.startApp());
  }, []);

  useEffect(() => {
    if (!loadingFlags && slidesRef.current?.slideTo) {
      console.log("useEffect flags1");
      console.log("selectFlag2");
      dispatch(
        ActionCreators.quizActions.selectFlag({
          WdCode: location.countryWD,
        })
      );
    }
  }, [loadingFlags]);

  //////////buttons handlers

  ///Locate Me
  const locateUser = () => {
    console.log("locateUser");
    dispatch(ActionCreators.geoActions.startLocation());
  };
  ///Run Questions
  const runQuestions = (location: Location, theme: string) => {
    // setIsQuizOpen(true);
    dispatch(ActionCreators.quizActions.clearQuestionsList());
    dispatch(
      ActionCreators.quizActions.fillQuiz({
        location,
      })
    );
    dispatch(ActionCreators.userQuizActions.startQuiz());
    dispatch(
      ActionCreators.quizActions.launchQuiz({
        theme,
      })
    );
  };

  ////Question Card Actions: click Yes, No, Hide
  const clickYesHandler = (currentQuestion: Question) => {
    console.log("clickYesHandler Question", currentQuestion);
    if (questionIndex < questions.length) {
      dispatch(
        ActionCreators.userQuizActions.goNextQuestion({
          uAnswer: {
            question: { ...currentQuestion },
            answer: true,
            isCorrect: currentQuestion.correct ? true : false,
          },
        })
      );
    }
  };

  const clickNoHandler = (currentQuestion: Question) => {
    console.log("clickYesHandler");
    if (questionIndex < questions.length) {
      dispatch(
        ActionCreators.userQuizActions.goNextQuestion({
          uAnswer: {
            question: { ...currentQuestion },
            answer: true,
            isCorrect: currentQuestion.correct ? false : true,
          },
        })
      );
    }
  };

  const hideQuiz = () => {
    console.log("hideQuiz");
    dispatch(ActionCreators.userQuizActions.showQuiz(false));
  };

  ///////Search Box///////
  const SearchBoxValueChangedHandler = (input: string) => {
    setSearchText(input);
    // compare flag list with tetxtbox input, if exact match with a country, change flag selection
    if (
      flags.filter((flag) => flag.label.toLowerCase() === input.toLowerCase())
        .length === 1
    ) {
      const targetFlag = flags.filter(
        (flag) => flag.label.toLowerCase() === input.toLowerCase()
      );
      dispatch(
        ActionCreators.geoActions.setLocationFromFlag({ flag: targetFlag[0] })
      );
      dispatch(
        ActionCreators.quizActions.selectFlag({
          WdCode: targetFlag[0].WdCode,
        })
      );
    }
    // hide country suggestions if no text or flag already selected
    if (
      input === "" ||
      (isFlagSelected &&
        flags.findIndex((flag) => flag.label === input) !== -1) ||
      flags.filter((flag) => flag.label.toLowerCase() === input.toLowerCase())
        .length > 0
    ) {
      setIsTyping(false);
      return;
    }
    // show country suggestion based on text box input
    const updatedList = flags.filter(
      (flag) => flag.label.toLowerCase().indexOf(input.toLowerCase()) !== -1
    );
    console.log("getSearchBoxValue2", updatedList);
    setSuggestionCountryList(updatedList);
    setIsFlagSelected(false);
    setIsTyping(true);
  };

  const selectSuggestionItem = (flag: any) => {
    console.log("selectSuggestionItem", flag);
    setIsFlagSelected(true);
    setSearchText(flag.label);
    dispatch(ActionCreators.geoActions.setLocationFromFlag({ flag }));
    dispatch(
      ActionCreators.quizActions.selectFlag({
        WdCode: flag.WdCode,
      })
    );
  };

  const onClearSearchBox = () => {
    setIsTyping(false);
  };

  //////Flags////////
  const selectFlagHandler = (flag: Flag) => {
    setIsFlagSelected(true);
    setSearchText(flag.label);
    dispatch(ActionCreators.geoActions.setLocationFromFlag({ flag }));
    dispatch(
      ActionCreators.quizActions.selectFlag({
        WdCode: flag.WdCode,
      })
    );
  };

  const flagSlides = flags.map((flag) => {
    return (
      <FlagSlide flag={flag} key={flag.WdCode} selectFlag={selectFlagHandler} />
    );
  });

  ///flag Slides Options
  const slideOpts = {
    initialSlide: 5,
    speed: 500,
    direction: "horizontal",
    height: 100,
    slidesPerView: 3,
  };

  //////Theme Segments/////
  const segmentChangeHandler = (theme: string) => {
    console.log("segmentChangeHandler", theme);
    setQuizTheme(theme);
  };

  ////////ResultPanel//////
  const closeResultPanel = () => {
    console.log("closeResultpanel");
    dispatch(ActionCreators.userQuizActions.showResultPanel(false));
  };

  ////////Badges////////////
  const selectBadgeHandler = (flag: Flag, badge: Badge, theme: string) => {
    setSearchText(flag.label);
    setQuizTheme(theme);
    dispatch(ActionCreators.geoActions.setLocationFromFlag({ flag }));
    console.log("selectFlagBadge");
    dispatch(
      ActionCreators.quizActions.selectFlag({
        WdCode: flag.WdCode,
      })
    );
    runQuestions(location, theme);
  };

  const badgesList = (badges: Badge[]) => {
    const themesList = Object.values(Theme);

    return (
      <div>
        {themesList.map((theme) => {
          // return stylingBadges(badges,flag, cat);
          return (
            <BadgeElement
              key={selectedFlag.WdCode + theme}
              flag={selectedFlag}
              badges={badges}
              theme={theme}
              selectBadge={selectBadgeHandler}
            />
          );
        })}
      </div>
    );
  };

  /////////////// Question Slides JSX //////

  const questionsCount =
    "Questions " + (questionIndex + 1) + " / " + questions.length;
  const currentScore =
    "Score: " +
    uAnswers.filter((answer) => answer.isCorrect === true).length +
    " / " +
    questionIndex;
  const loadingQuestionsSpinner = (
    <div>
      <IonSpinner name="lines" /> <p>Loading Questions</p>
    </div>
  );

  const questionsSlides = (
    <IonGrid id="questionsSlides">
      <IonRow>
        <IonCol size="10" className="mainTitle">
          {selectedFlag.label} - {quizTheme}
        </IonCol>
        <IonCol size="2">
          <IonButton onClick={hideQuiz}>
            <IonIcon icon={closeCircleOutline}></IonIcon>
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12" className="centerText">
          {questions.length > 0 && currentScore}
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol offset="0" size="12" className="centerText">
          {questions.length > 0 && questionsCount}
          {questions.length > 0 && questions[questionIndex] && (
            <QuestionItem
              key={questions[questionIndex].id}
              question={questions[questionIndex]}
              clickYes={clickYesHandler}
              clickNo={clickNoHandler}
            />
          )}
        </IonCol>
      </IonRow>
    </IonGrid>
  );

  return (
    <IonPage>
      <IonAlert
        isOpen={geoErrorMessage !== "" ? true : false}
        onDidDismiss={() => {
          dispatch(ActionCreators.geoActions.clearGeoErrorMessage());
        }}
        header={"Error"}
        subHeader={geoErrorMessage}
        message={geoErrorMessage}
        buttons={["OK"]}
      />
      <IonHeader id="tinHeader">
        <IonToolbar id="homeToolbar">
          <div className="mainTitle">TinQuiz</div>
        </IonToolbar>
      </IonHeader>

      <IonContent id="homePage">
        {showResultPanel && (
          <ResultPanel
            key={Date.now().toString()}
            historyItem={historyItem[0]}
            showResultPanel={showResultPanel}
            flag={selectedFlag}
            message={"" + totalScore}
            closeResultPanel={closeResultPanel}
          />
        )}
        <IonGrid>
          {!isFinished && isQuizOpened && questionsSlides}
          <IonRow>
            <IonCol offset="0" size="12">
              {!isQuizOpened && (
                <IonSlides
                  id="flagsSlide"
                  pager={false}
                  options={slideOpts}
                  ref={slidesRef}
                >
                  {flags && flags.length > 0 && flagSlides}
                </IonSlides>
              )}
            </IonCol>
          </IonRow>
          <IonRow class="ion-text-center">
            {!isQuizOpened && (
              <ThemeSegments
                key="ThemeSegments"
                onSegmentValueChange={segmentChangeHandler}
                selectedTheme={quizTheme}
              />
            )}
          </IonRow>

          {!isQuizOpened && (
            <IonRow class="ion-text-center">
              <IonCol offset="0" size="9">
                <IonItem lines="none" class="backGroundStyle">
                  <IonSearchbar
                    id="searchBar"
                    type="text"
                    debounce={500}
                    ref={boxRef}
                    value={searchText}
                    onIonClear={() => onClearSearchBox()}
                    onIonChange={(e) =>
                      SearchBoxValueChangedHandler(e.detail.value!)
                    }
                  ></IonSearchbar>
                </IonItem>
                {isTyping && suggestionCountryList.length > 0 && (
                  <IonList lines="none" class="backGroundStyle">
                    {suggestionCountryList.slice(0, 5).map((flag) => (
                      <SearchItem
                        key={flag.WdCode}
                        flag={flag}
                        selectItem={selectSuggestionItem}
                      />
                    ))}
                  </IonList>
                )}
              </IonCol>
              <IonCol id="locationCol">
                <IonButton id="locationButton" onClick={locateUser}>
                  <IonIcon icon={locate}></IonIcon>
                </IonButton>
              </IonCol>
            </IonRow>
          )}
          {!isQuizOpened && (
            <IonRow>
              <IonCol offset="0" size="12">
                <IonButton
                  id="launchButton"
                  size="large"
                  expand="full"
                  onClick={() => runQuestions(location, quizTheme)}
                >
                  <IonLabel>Launch Quiz</IonLabel>
                </IonButton>
              </IonCol>
            </IonRow>
          )}
          <IonRow>
            <IonCol class="ion-text-center" offset="2" size="8">
              {geoLoading && <IonSpinner name="dots" />}
              {quizLoading && loadingQuestionsSpinner}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol offset="0" size="12">
              {!isQuizOpened && selectedFlag && (
                <IonCard id="badge-card">
                  <IonCardHeader>
                    <IonCardTitle>Unlock Badges</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>{badgesList(badgesItems)}</IonCardContent>
                </IonCard>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
