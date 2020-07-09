export const START_LOCATION = 'START_LOCATION';
export const END_LOCATION = 'END_LOCATION';
export const SHOW_GEO_ERROR = 'SHOW_GEO_ERROR';
export const CLEAR_GEO_ERROR = 'CLEAR_GEO_ERROR';

export const START_QWANT_SEARCH = 'START_QWANT_SEARCH';
export const END_QWANT_SEARCH = 'END_QWANT_SEARCH';
export const QWANT_DELETE = 'QWANT_DELETE';
export const QWANT_SELECT = 'QWANT_SELECT';
export const CHANGE_PROXY = 'CHANGE_PROXY';
export const SHOW_QWANT_ERROR = 'SHOW_QWANT_ERROR';
export const CLEAR_QWANT_ERROR = 'CLEAR_QWANT_ERROR';

export const FILL_QUIZ = 'FILL_QUIZ';
export const SET_QUIZ_ID = 'SET_QUIZ_ID';
export const RUN_DISTRACTOR = 'RUN_DISTRACTOR';
export const FILL_DISTRACTOR = 'FILL_DISTRACTOR';
export const FILL_QUESTION = 'FILL_QUESTION';
export const IGNORE_QUESTION = 'IGNORE_QUESTION';
export const RUN_QUESTION = 'RUN_QUESTION';
export const RUN_QUESTIONS_LIST = 'RUN_QUESTIONS_LIST';
export const END_QUESTIONS_LIST = 'END_QUESTIONS_LIST';
export const CLEAR_QUESTIONS_LIST = 'CLEAR_QUESTIONS_LIST';

export const GO_NEXT_QUESTION = 'GO_NEXT_QUESTION';
export const START_QUIZ = 'START_QUIZ';
export const END_QUIZ = 'END_QUIZ';
////////////Quiz Queries///////

export const musicianByCountry = 'musicianByCountry';
export const personByRegion = 'personByRegion';
export const animalByCountry = 'animalByCountry';
export const filmByCountry = 'filmByCountry';
export const personByCountry = 'personByCountry';
export const riverByCountry = 'riverByCountry';
export const footballerByCountry = 'footballerByCountry';
export const actorByCountry = 'actorByCountry';
export const bandByCountry = 'bandByCountry';
export const location = 'location';
export const dishByCountry = 'dishByCountry';

export const QUESTIONS_MAP:any = {
    'musicianByCountry' : 'Musician from',
    'personByRegion' : 'Person from',
    'filmByCountry' : 'Film from a Director of',
    'personByCountry' : 'Person from',
    'animalByCountry' : 'Animal from ',
    'riverByCountry' : 'River from',
    'footballerByCountry' : 'Footballer born in',
    'actorByCountry' : 'Actor from',
    'bandByCountry' : 'Music band from',
    'location' : 'Is it',
    'dishByCountry' : 'Food from',
}

//filmByCountry as optional as handle separately,see filmSPARQL.ts
export interface QUERIES_MAP {
    'musicianByCountry' : (code:string) => string,
    'personByRegion' : (code:string) => string,
    'filmByCountry'? : (code:string) => string,
    'personByCountry' : (code:string) => string,
    'animalByCountry' : (code:string) => string,
    'riverByCountry' : (code:string) => string,
    'footballerByCountry' : (code:string) => string,
    'actorByCountry' : (code:string) => string,
    'bandByCountry' : (code:string) => string,
    'location' : (code:string) => string,
    'dishByCountry' : (code:string) => string,
}