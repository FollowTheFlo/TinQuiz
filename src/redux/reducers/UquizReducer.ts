import { Choice } from "./ChoiceReducer";
import { Action } from "../actions/quizActions";
import {
  GoNextQuestionAction,
  StartQuizPayload,
  StartQuizAction,
  EndQuizAction,
  ShowQuizAction,
  ShowResultPanelAction,
  FillbadgesAction,
} from "../actions/userQuizActions";
import {
  GO_NEXT_QUESTION,
  START_QUIZ,
  END_QUIZ,
  SHOW_QUIZ,
  EMPTY_ACTION,
  SHOW_RESULT_PANEL,
  FILL_BADGES,
} from "../constants";
import { Question, Quiz } from "./QuizReducer";

export interface Uanswer {
  question: Question;
  answer: boolean;
  isCorrect: boolean;
}

export interface HistoryItem {
  id: string;
  subject: string;
  country: string;
  countryWD: string;
  theme: string;
  score: number;
  questionsCount: number;
  correctAnswersCount: number;
}

export interface Badge {
  id: string;
  award: string;
  country: string;
  countryWD: string;
  countryImg: string;
  theme: string;
  score: number;
}

export interface UquizState {
  questionIndex: number;
  isOpened: boolean;
  showResultPanel: boolean;
  uAnswers: Uanswer[];
  isFinished: boolean;
  score: number;
  userId: string;
  historyItems: HistoryItem[];
  badges: Badge[];
}

const initialState = {
  questionIndex: 0,
  uAnswers: [],
  isFinished: false,
  isOpened: false,
  showResultPanel: false,
  score: 0,
  userId: "Flo",
  historyItems: [],
  badges: [],
};

export const uQuizReducer = (
  state: UquizState = initialState,
  action: Action
): UquizState => {
  switch (action.type) {
    case GO_NEXT_QUESTION: {
      const goNextQuestionAction = action as GoNextQuestionAction;
      console.log("REDUCER - GO_NEXT_QUESTION: ");
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        uAnswers: state.uAnswers.concat(goNextQuestionAction.payload.uAnswer),
      };
    }
    case EMPTY_ACTION: {
      console.log("REDUCER - EMPTY_ACTION: ");
      return {
        ...state,
      };
    }

    case START_QUIZ: {
      console.log("REDUCER - START_QUIZ: ");
      return {
        ...state,
        questionIndex: 0,
        uAnswers: [],
        isOpened: true,
        isFinished: false,
      };
    }
    case END_QUIZ: {
      const endQuizPayload = action as EndQuizAction;
      console.log("REDUCER - END_QUIZ: ");
      const correctAnswersCount = state.uAnswers.filter(
        (answer) => answer.isCorrect === true
      ).length;
      const totalAnswers = state.uAnswers.length;
      const totalScore =
        Math.trunc(10000 * (correctAnswersCount / totalAnswers)) / 100;
      let newBadgeList: Badge[] = [...state.badges];

      console.log("BADGE LIST 1", newBadgeList);

      //check if we have already have the badge, if no add it,
      // if yes add  only if score higher than existing one
      newBadgeList = newBadgeList.filter(
        (badge) =>
          badge.countryWD !== endQuizPayload.payload.quiz.location.countryWD ||
          badge.score > totalScore ||
          badge.theme !== endQuizPayload.payload.quiz.theme
      );

      console.log("BADGE LIST 2", newBadgeList);

      if (totalScore >= 60) {
        const badge: Badge = {
          id: Date.now().toString(),
          award: "Bronze",
          score: totalScore,
          country: endQuizPayload.payload.quiz.location.country,
          countryImg: endQuizPayload.payload.countryImg,
          countryWD: endQuizPayload.payload.quiz.location.countryWD,
          theme: endQuizPayload.payload.quiz.theme,
        };

        if (totalScore === 100) {
          badge.award = "Gold";
        } else if (totalScore >= 80) {
          badge.award = "Silver";
        }
        newBadgeList = newBadgeList.concat(badge);
      }

      return {
        ...state,
        //showResultPanel:true,
        isFinished: true,
        isOpened: false,
        //truncate after 2 decimals
        score: totalScore,
        historyItems: [
          {
            id: endQuizPayload.payload.quiz.id,
            subject: endQuizPayload.payload.quiz.subject,
            score: totalScore,
            questionsCount: totalAnswers,
            correctAnswersCount: correctAnswersCount,
            country: endQuizPayload.payload.quiz.location.country,
            countryWD: endQuizPayload.payload.quiz.location.countryWD,
            theme: endQuizPayload.payload.quiz.theme,
          },
        ].concat(state.historyItems),
        badges: newBadgeList,
      };
    }
    case SHOW_QUIZ: {
      const showQuizAction = action as ShowQuizAction;
      console.log("REDUCER - SHOW_QUIZ: ", showQuizAction.payload);
      return {
        ...state,
        isOpened: showQuizAction.payload,
      };
    }
    case SHOW_RESULT_PANEL: {
      const showResultPanelAction = action as ShowResultPanelAction;
      console.log("REDUCER - CLOSE_RESULT_PANEL: ");
      return {
        ...state,
        showResultPanel: showResultPanelAction.payload,
      };
    }
    case FILL_BADGES: {
      const fillbadgesAction = action as FillbadgesAction;
      console.log("REDUCER - FILL_BADGES: ", fillbadgesAction.payload);
      return {
        ...state,
        badges: fillbadgesAction.payload.badges,
      };
    }

    default:
      return state;
  }
};
