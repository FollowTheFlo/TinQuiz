export const START_LOCATION = "START_LOCATION";
export const END_LOCATION = "END_LOCATION";
export const SHOW_GEO_ERROR = "SHOW_GEO_ERROR";
export const CLEAR_GEO_ERROR = "CLEAR_GEO_ERROR";
export const SET_LOCATION_FROM_FLAG = "SET_LOCATION_FROM_FLAG";

export const LAUNCH_QUIZ = "LAUNCH_QUIZ";
export const FILL_QUIZ = "FILL_QUIZ";
export const SET_QUIZ_ID = "SET_QUIZ_ID";
export const RUN_DISTRACTOR = "RUN_DISTRACTOR";
export const FILL_DISTRACTOR = "FILL_DISTRACTOR";
export const FILL_QUESTION = "FILL_QUESTION";
export const IGNORE_QUESTION = "IGNORE_QUESTION";
export const RUN_QUESTION = "RUN_QUESTION";
export const RUN_QUESTIONS_LIST = "RUN_QUESTIONS_LIST";
export const COUNT_EXPECTED_QUESTIONS_LIST = "COUNT_EXPECTED_QUESTIONS_LIST";
export const END_QUESTIONS_LIST = "END_QUESTIONS_LIST";
export const CLEAR_QUESTIONS_LIST = "CLEAR_QUESTIONS_LIST";
export const RUN_FLAGS = "RUN_FLAGS";
export const FILL_FLAGS = "FILL_FLAGS";
export const SELECT_FLAG = "SELECT_FLAG";
export const CLEAR_QUIZ_ERROR = "CLEAR_QUIZ_ERROR";

export const GO_NEXT_QUESTION = "GO_NEXT_QUESTION";
export const EMPTY_ACTION = "EMPTY_ACTION";
export const START_QUIZ = "START_QUIZ";
export const END_QUIZ = "END_QUIZ";
export const START_APP = "START_APP";
export const SHOW_QUIZ = "SHOW_QUIZ";
export const SHOW_RESULT_PANEL = "SHOW_RESULT_PANEL";
export const FILL_BADGES = "FILL_BADGES";
////////////Quiz Queries///////

export const musicianByCountry = "musicianByCountry";
export const personByRegion = "personByRegion";
export const animalByCountry = "animalByCountry";
export const filmByCountry = "filmByCountry";
export const personByCountry = "personByCountry";
export const riverByCountry = "riverByCountry";
export const footballerByCountry = "footballerByCountry";
export const actorByCountry = "actorByCountry";
export const bandByCountry = "bandByCountry";
export const location = "location";
export const dishByCountry = "dishByCountry";

export const QUESTIONS_MAP: any = {
  musicianByCountry: "Musician from",
  personByRegion: "Person from",
  filmByCountry: "Film from",
  personByCountry: "Person from",
  animalByCountry: "Animal from ",
  riverByCountry: "River from",
  footballerByCountry: "Footballer of",
  actorByCountry: "Actor from",
  bandByCountry: "Music band from",
  location: "Is it",
  dishByCountry: "Food from",
  capitalByCountry: "Capital of",
  townByCountry: "City of",
  mountainByCountry: "Mountain of",
  logoByCountry: "Company of",
};

//filmByCountry as optional as handle separately,see filmSPARQL.ts
export interface QUERIES_MAP {
  musicianByCountry: (code: string) => string;
  personByRegion: (code: string) => string;
  filmByCountry?: (code: string) => string;
  personByCountry: (code: string) => string;
  animalByCountry: (code: string) => string;
  riverByCountry: (code: string) => string;
  footballerByCountry: (code: string) => string;
  actorByCountry: (code: string) => string;
  bandByCountry: (code: string) => string;
  location: (code: string) => string;
  dishByCountry: (code: string) => string;
  capitalByCountry: (code: string) => string;
  townByCountry: (code: string) => string;
  mountainByCountry: (code: string) => string;
  logoByCountry: (code: string) => string;
}

export enum Theme {
  ALL = "ALL",
  CINEMA = "CINEMA",
  GEO = "GEOGRAPHY",
  CELEBRITIES = "CELEBRITIES",
  FOOD = "FOOD",
  ENTERPRISES = "ENTERPRISES",
}
