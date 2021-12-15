import { ofType, Epic } from "redux-observable";
import { map, tap, concatMap } from "rxjs/operators";
import ActionCreators, { Action } from "../actions";
import {
  RUN_QUESTION,
  RUN_DISTRACTOR,
  RUN_QUESTIONS_LIST,
  QUESTIONS_MAP,
  FILL_QUIZ,
  RUN_FLAGS,
  Theme,
  LAUNCH_QUIZ,
  FILL_DISTRACTOR,
  COUNT_EXPECTED_QUESTIONS_LIST,
} from "../constants";
import {
  RunQuestionAction,
  QuestionParams,
  RunDistractorAction,
  RunQuestionsListAction,
  LaunchQuizAction,
} from "../actions/quizActions";
import {
  getSparqlCountryList,
  getSparqlPlaceList,
  getSparqlRegionList,
} from "../shared/services/distractorSPARQL";
import { questionAllList } from "../shared/config/queriesLists";
import { from, of } from "rxjs";
import { getSparqlChoice, Article } from "../shared/services/questionSPARQL";
import { getSparqlFilmChoice } from "../shared/services/filmSPARQL";
import { Question } from "../reducers/QuizReducer";
import { Location } from "../reducers/GeoReducer";
import {
  randomIntFromInterval,
  randomizeChoices,
} from "../shared/services/utilitySPARQL";
import { questionCinemaList } from "../shared/config/queriesCinemaList";
import { questionGeoList } from "../shared/config/queriesGeoList";
import { questionCelebList } from "../shared/config/queriesCelebList";
import { questionFoodList } from "../shared/config/queriesFoodList";
import { questionEnterpriseList } from "../shared/config/queriesEnterpriseList";
import { localFlagsList } from "../shared/config/flagsList";

// fetch distractors from selected country
// return list of distractor with their country / countryWD pairs(eg: Canada / Q16)
export const quizEpic: Epic<Action> = (action$, state$) => {
  let location: Location;
  let distractors = {
    place: [""],
    placeWD: [""],
    region: [""],
    regionWD: [""],
    country: [""],
    countryWD: [""],
  };
  return action$.pipe(
    ofType<any>(RUN_DISTRACTOR),
    tap(() => console.log("EPIC - RUN_DISTRACTOR")),
    concatMap((action: RunDistractorAction) => {
      console.log("FillQuizAction switchMap", state$);
      location = { ...action.payload.location };
      if (!location.countryWD) {
        console.log("empty country code");
        return of({});
      }
      // get distratctor countries from WikiData eg:target is france, distractor: Germany, Belgium, Spain
      // we take 5 random countries from same continent, at least 1 millions population,
      // if country too small -> not enough articles -> end up with empty questions
      return getSparqlCountryList(location.countryWD);
    }),
    // concatMap((response: any) => {
    //   console.log("countryWD test empty");
    //   if (response) {
    //     console.log("ajax1", response);
    //     //receiving list of dsitractor countries {label,code} from getSparqlCountryList
    //     distractors.country = response.map((obj: any) => obj.label);
    //     distractors.countryWD = response.map((obj: any) => obj.code);
    //     console.log("distractor1", distractors);
    //   } else {
    //     console.log("countryWD was empty");
    //   }

    //   if (!location.regionWD) {
    //     console.log("empty regionWD");
    //     return of({});
    //   }
    //   return getSparqlRegionList(location.regionWD);
    // }),
    // concatMap((response: any) => {
    //   console.log("ajax2", response);
    //   if (response[0]) {
    //     distractors.region[0] = response[0].label;
    //     distractors.regionWD[0] = response[0].code;
    //   }

    //   console.log("distractor1", distractors);
    //   if (!location.placeWD) {
    //     console.log("empty3");
    //     return of({});
    //   }
    //   return getSparqlPlaceList(location.placeWD);
    // }),
    map((response: any) => {
      if (response) {
        console.log("ajax1", response);
        //receiving list of dsitractor countries {label,code} from getSparqlCountryList
        distractors.country = response.map((obj: any) => obj.label);
        distractors.countryWD = response.map((obj: any) => obj.code);
        console.log("distractor1", distractors);
      } else {
        console.log("countryWD was empty");
      }
      // distractors countries have been fetcehd, fill the state
      return ActionCreators.quizActions.fillDistractors({
        distractor: distractors,
      });
    })
  );
};

interface localQuestionParams extends QuestionParams {
  code: string;
  area: string;
  correctArea: string;
}

export const questionEpic: Epic<Action> = (action$, state$) => {
  let inputEl: any;
  let actionParams: localQuestionParams;

  // from question template -> pick one random distractor -> fill with data from WikiData server -> add in on Question List state
  return action$.pipe(
    ofType<any>(RUN_QUESTION),
    tap(() => console.log("EPIC - RUN_QUESTION")),

    concatMap((action: RunQuestionAction) => {
      const randomIndex = randomIntFromInterval(
        0, //list of distractor countries in  quiz.distractor.country[]
        state$.value.quiz.quiz.distractor[action.params.type].length - 1
      );
      console.log("randomIndex", randomIndex);
      console.log(
        "randomIndex Length",
        state$.value.quiz.quiz.distractor[action.params.type].length - 1
      ); // eg {code:Q790,area:canada,correctArea:Haiti,}
      actionParams = {
        ...action.params,
        code: action.params.isDistractor
          ? state$.value.quiz.quiz.distractor[action.params.type + "WD"][
              randomIndex
            ]
          : state$.value.quiz.quiz.location[action.params.type + "WD"],
        area: state$.value.quiz.quiz.location[action.params.type],
        correctArea: action.params.isDistractor
          ? state$.value.quiz.quiz.distractor[action.params.type][randomIndex]
          : state$.value.quiz.quiz.location[action.params.type],
      };
      console.log("actionParams.theme", actionParams.topic);
      if (actionParams.topic === "filmByCountry") {
        console.log("in condition FilmByCountry");
        return getSparqlFilmChoice(actionParams.topic, actionParams.code);
      }

      // query Wikidata based on topic (eg:Food) and countryCode: eg:Q16 which is Canada
      // 50max articles on country/topic are fetched and cached , if same country/topic needed later, pick from cache
      return getSparqlChoice(actionParams.topic, actionParams.code);
    }),

    map((response: Article) => {
      // erronated article with empty image or label, ignore question
      if (response.image === "" || response.label === "") {
        return ActionCreators.quizActions.ignoreQuestion();
      }

      const question: Question = {
        id: Date.now().toString(), // unique Id
        geoType: actionParams.type,
        topic: actionParams.topic,
        phrase: `${QUESTIONS_MAP[actionParams.topic]} ${actionParams.area} ?`, // title, eg: Food from Canada
        subPhrase: state$.value.quiz.quiz.location[actionParams.type], // type 'country': eg: country, type 'place': eg: Montreal
        correct: actionParams.isDistractor ? false : true, // correct answer is yes or no
        correctArea: actionParams.correctArea,
        image: response.image,
        label: response.label,
      }; // new question added to quiz questions list using FILL_QUESTION action
      return ActionCreators.quizActions.fillQuestion({ question: question });
    })
  );
};

// 1st step of launch quiz is to fetch distractors country that will give us false answer's
export const launchQuizEpic: Epic<Action> = (action$, state$) =>
  action$.pipe(
    ofType<any>(LAUNCH_QUIZ),
    tap(() => console.log("EPIC - LAUNCH_QUIZ")),
    map((action: LaunchQuizAction) => {
      console.log("action.params.theme", action.params.theme);
      let questionsCount = 0;
      switch (action.params.theme) {
        case Theme.ALL: {
          questionsCount = questionAllList.length;
          break;
        }
        case Theme.CINEMA: {
          questionsCount = questionCinemaList.length;
          break;
        }
        case Theme.GEO: {
          questionsCount = questionGeoList.length;
          break;
        }
        case Theme.CELEBRITIES: {
          questionsCount = questionCelebList.length;
          break;
        }
        case Theme.FOOD: {
          questionsCount = questionFoodList.length;
          break;
        }
        case Theme.ENTERPRISES: {
          questionsCount = questionEnterpriseList.length;
          break;
        }
        default: {
          questionsCount = questionAllList.length;
        }
      }
      return ActionCreators.quizActions.runDistractor({
        location: state$.value.geo.location,
        templateQuestionsCount: questionsCount,
      });
    })
  );

// confirmation distractors are present, we can now run questions list that will fetch articles from wikidata
export const fillDistractorEpic: Epic<Action> = (action$, state$) =>
  action$.pipe(
    ofType<Action>(FILL_DISTRACTOR),
    tap(() => console.log("EPIC - FILL_DISTRACTOR")),
    map(() => {
      return ActionCreators.quizActions.runQuestionsList({
        theme: state$.value.quiz.quiz.theme,
      });
    })
  );

//1. form theme (eg:Food) -> get questions template of this theme, templates defined number of true/false questions.
//2. for each question template run question one by one
export const runQuestionListEpic: Epic<Action> = (action$, state$) => {
  return action$.pipe(
    ofType<any>(RUN_QUESTIONS_LIST),
    tap(() => console.log("EPIC - RUN_QUESTIONS_LIST")),
    concatMap((action: RunQuestionsListAction) => {
      console.log(action.params.theme);
      let questionListwithTheme: any[];
      switch (action.params.theme) {
        case Theme.ALL: {
          questionListwithTheme = randomizeChoices(questionAllList);
          break;
        }
        case Theme.CINEMA: {
          questionListwithTheme = randomizeChoices(questionCinemaList);
          break;
        }
        case Theme.GEO: {
          questionListwithTheme = randomizeChoices(questionGeoList);
          break;
        }
        case Theme.CELEBRITIES: {
          questionListwithTheme = randomizeChoices(questionCelebList);
          break;
        }
        case Theme.FOOD: {
          questionListwithTheme = randomizeChoices(questionFoodList);
          break;
        }
        case Theme.ENTERPRISES: {
          questionListwithTheme = randomizeChoices(questionEnterpriseList);
          break;
        }
        default: {
          questionListwithTheme = randomizeChoices(questionAllList);
        }
      }
      // we stringify to take advantage of rxJS opeator 'from' which accept string only (not objects like QuestionParams)
      const questionsJSON: string[] = questionListwithTheme.map((q) =>
        JSON.stringify(q)
      );
      console.log("questionsJSON", questionsJSON);
      return from(questionsJSON); // question stream one after the other thx to concatMap opeator
    }),
    //  delay(1000),
    map((questionJSON: any) => {
      // Parse to get the object QuestionParams from Json string
      const questionParams: QuestionParams = JSON.parse(questionJSON);
      console.log("questionParams", questionParams);
      //runQuetions action 1 by 1 (due to from()operator) until end of list
      return ActionCreators.quizActions.runQuestion(questionParams);
    })
  );
};

export const FillQuizEpic: Epic<Action> = (action$, state$) => {
  return action$.pipe(
    ofType<any>(FILL_QUIZ),
    tap(() => console.log("EPIC - FILL_QUIZ")),
    map((action: any) => {
      // create unique Id using now date
      const id = Date.now().toString();
      return ActionCreators.quizActions.setQuizId({
        quizId: id,
      });
    })
  );
};
export const RunFlagsEpic: Epic<Action> = (action$, state$) => {
  return action$.pipe(
    ofType<any>(RUN_FLAGS),
    tap(() => console.log("EPIC - RUN_FLAGS")),
    map(() => {
      return ActionCreators.quizActions.fillFlags({
        flags: localFlagsList,
      });
    })
  );
};
