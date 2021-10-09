import { createStore } from 'redux';
import rootReducer from './reducer';

let preloadedState;
const persistedQuizesString = localStorage.getItem('quizes');

if (persistedQuizesString) {
    preloadedState = {
        quizes: JSON.parse(persistedQuizesString)
    }
}

const store = createStore(rootReducer, preloadedState);

export default store;