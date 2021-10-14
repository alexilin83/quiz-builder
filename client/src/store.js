import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer';
import { logger } from './middleware';

let preloadedState;
const persistedQuizesString = localStorage.getItem('quizes');

if (persistedQuizesString) {
    preloadedState = {
        quizes: JSON.parse(persistedQuizesString)
    }
}

const middlewareEnhancer = applyMiddleware(logger);

const store = createStore(rootReducer, preloadedState, middlewareEnhancer);

export default store;