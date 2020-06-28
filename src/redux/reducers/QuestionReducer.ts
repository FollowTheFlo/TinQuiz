import { Choice } from './ChoiceReducer';

export interface Question {
    id: string;
    type: string;
    phrase: string;
    subPhrase: string;
    choices: Choice[];
}

const initialState = {
    id:'0',
    type:'Yo',
    phrase: 'a?',
    subPhrase: 'b?',
    choices: null
}