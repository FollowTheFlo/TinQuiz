import { Action } from "../actions";
import { Location } from "./GeoReducer";

import {
  FILL_QUIZ,
  FILL_DISTRACTOR,
  RUN_DISTRACTOR,
  IGNORE_QUESTION,
  RUN_QUESTION,
  END_QUESTIONS_LIST,
  CLEAR_QUESTIONS_LIST,
  FILL_QUESTION,
  SET_QUIZ_ID,
  RUN_FLAGS,
  FILL_FLAGS,
  SELECT_FLAG,
  LAUNCH_QUIZ,
  CLEAR_QUIZ_ERROR,
} from "./../constants";
import {
  FillQuizAction,
  FillDistractorAction,
  FillQuestionAction,
  RunDistractorAction,
  SetQuizIdAction,
  FillFlagsAction,
  SelectFlagAction,
  LaunchQuizAction,
} from "../actions/quizActions";
import { localFlagsList } from "../shared/config/flagsList";

export interface Quiz {
  id: string;
  subject: string;
  locale: string;
  questions: Question[];
  templateQuestionsCount: number;
  ignoredQuestionsCount: number;
  distractor: Distractor;
  location: Location;
  theme: string;
}

export interface Distractor {
  place: string[];
  placeWD: string[];
  region: string[];
  regionWD: string[];
  country: string[];
  countryWD: string[];
}

export interface Question {
  id: string;
  geoType: string;
  topic: string;
  phrase: string;
  subPhrase: string;
  correct: boolean;
  correctArea: string;
  image: string;
  label: string;
}

export interface QuizState {
  selectedFlag: Flag;
  loadingFlags: boolean;
  flags: Flag[];
  quiz: Quiz;
  errorMessage: string;
  loading: boolean;
}

export interface Flag {
  label: string;
  image: string;
  WdCode: string;
  isSelected: boolean;
}

const initialState = {
  flags: localFlagsList,
  loadingFlags: true,
  selectedFlag: {
    label: "Canada",
    image:
      "http://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Canada_(Pantone).svg?width=300",
    WdCode: "Q16",
    isSelected: true,
  },
  quiz: {
    id: "0",
    subject: "yo",
    locale: "en",
    questions: [],
    templateQuestionsCount: 5,
    ignoredQuestionsCount: 3,
    theme: "ALL",
    location: {
      id: "0",
      place: "Montreal",
      region: "Quebec",
      country: "Canada",
      placeWD: "Q340",
      regionWD: "Q12589",
      countryWD: "Q16",
      lat: -73.576815,
      lng: 45.510924,
    },
    distractor: {
      place: ["Montreal"],
      placeWD: ["Q340"],
      region: ["Quebec"],
      regionWD: ["Q176"],
      country: ["United Kingdom"],
      countryWD: ["Q145"],
    },
  },
  errorMessage: "",
  loading: false,
};

export const quizReducer = (
  state: QuizState = initialState,
  action: Action
): QuizState => {
  switch (action.type) {
    case FILL_QUIZ: {
      console.log("REDUCER - FILL_QUIZ: ");

      const fillQuizAction = action as FillQuizAction;
      return {
        ...state,
        loading: true,
        quiz: {
          ...state.quiz,
          location: fillQuizAction.payload.location,
          subject: `${fillQuizAction.payload.location.country}`,
        },
      };
    }
    case SET_QUIZ_ID: {
      console.log("REDUCER - SET_QUIZ_ID: ");
      const setQuizIdAction = action as SetQuizIdAction;
      return {
        ...state,
        quiz: {
          ...state.quiz,
          id: setQuizIdAction.payload.quizId,
        },
      };
    }
    case LAUNCH_QUIZ: {
      console.log("REDUCER - LAUNCH_QUIZ: ");
      const launchQuizAction = action as LaunchQuizAction;
      return {
        ...state,
        loading: true,
        quiz: {
          ...state.quiz,
          theme: launchQuizAction.params.theme,
        },
      };
    }
    case RUN_DISTRACTOR: {
      console.log("REDUCER - RUN_DISTRACTOR: ");

      const runDistractorAction = action as RunDistractorAction;
      return {
        ...state,
        loading: true,
        quiz: {
          ...state.quiz,
          templateQuestionsCount:
            runDistractorAction.payload.templateQuestionsCount,
          ignoredQuestionsCount: 0,
          location: runDistractorAction.payload.location,
          subject: `${runDistractorAction.payload.location.place} - ${runDistractorAction.payload.location.region} - ${runDistractorAction.payload.location.country}`,
        },
      };
    }
    case FILL_DISTRACTOR: {
      console.log("REDUCER - FILL_DISTRACTOR: ");
      const fillDistractorAction = action as FillDistractorAction;
      return {
        ...state,
        loading: false,
        quiz: {
          ...state.quiz,
          location: { ...state.quiz.location },
          distractor: fillDistractorAction.payload.distractor,
        },
      };
    }
    case RUN_QUESTION: {
      console.log("REDUCER - IGNORE_QUESTION: ");

      return {
        ...state,
        loading: true,
      };
    }
    case END_QUESTIONS_LIST: {
      console.log("REDUCER - END_QUESTIONS_LIST: ");

      return {
        ...state,
        loading: false,
      };
    }
    case CLEAR_QUESTIONS_LIST: {
      console.log("REDUCER - CLEAR_QUESTIONS_LIST: ");

      return {
        ...state,
        loading: false,
        errorMessage: "",
        quiz: {
          ...state.quiz,
          location: { ...state.quiz.location },
          distractor: { ...state.quiz.distractor },
          questions: [],
        },
      };
    }
    case FILL_QUESTION: {
      console.log("REDUCER - FILL_QUESTIONS: ");
      const fillDistractorAction = action as FillQuestionAction;
      //copy of existing question
      const questions = state.quiz.questions.map((q) => {
        return { ...q };
      });
      const updatedQuestions = questions.concat(
        fillDistractorAction.payload.question
      );
      return {
        ...state,
        loading: false,
        quiz: {
          ...state.quiz,
          location: { ...state.quiz.location },
          distractor: { ...state.quiz.distractor },
          questions: updatedQuestions,
        },
      };
    }
    case IGNORE_QUESTION: {
      console.log(
        "REDUCER - IGNORE_QUESTION: COUNT:",
        state.quiz.ignoredQuestionsCount,
        "/",
        state.quiz.templateQuestionsCount,
        " | ",
        state.quiz.ignoredQuestionsCount + state.quiz.questions.length
      );
      // if all questions are ignored, trigger error message
      // if error message, stop loading
      return {
        ...state,
        errorMessage:
          state.quiz.ignoredQuestionsCount + 1 ===
          state.quiz.templateQuestionsCount
            ? "No questions found"
            : state.errorMessage,
        quiz: {
          ...state.quiz,
          ignoredQuestionsCount: state.quiz.ignoredQuestionsCount + 1,
        },
        loading:
          state.quiz.ignoredQuestionsCount + 1 ===
          state.quiz.templateQuestionsCount
            ? false
            : state.quiz.ignoredQuestionsCount + state.quiz.questions.length ===
              state.quiz.templateQuestionsCount + 1
            ? false
            : state.loading,
      };
    }
    case RUN_FLAGS: {
      console.log("REDUCER - RUN_FLAGS: ");

      return {
        ...state,
        loadingFlags: true,
      };
    }
    case FILL_FLAGS: {
      const fillFlagsAction = action as FillFlagsAction;
      console.log("REDUCER - FILL_FLAGS: ", fillFlagsAction.payload.flags);

      return {
        ...state,
        flags: fillFlagsAction.payload.flags,
        loadingFlags: false,
      };
    }
    case CLEAR_QUIZ_ERROR: {
      console.log("REDUCER - CLEAR_QUIZ_ERROR: ");

      return {
        ...state,
        errorMessage: "",
      };
    }
    case SELECT_FLAG: {
      const selectFlagAction = action as SelectFlagAction;
      console.log("REDUCER - SELECT_FLAG: ", selectFlagAction.payload.WdCode);

      const updatedFlags = [...state.flags];
      const index = updatedFlags.findIndex(
        (f) => f.WdCode === selectFlagAction.payload.WdCode
      );
      updatedFlags.forEach((f) => (f.isSelected = false));
      if (index !== -1) {
        updatedFlags[index].isSelected = true;
      }
      console.log("all flags", updatedFlags);
      console.log("flag index", index);

      return {
        ...state,
        flags: updatedFlags,
        selectedFlag: { ...updatedFlags[index] },
      };
    }
    default:
      return state;
  }
};
