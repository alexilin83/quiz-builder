import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducer';

const middlewareEnhancer = applyMiddleware(thunkMiddleware);

const store = createStore(rootReducer, middlewareEnhancer);

export default store;