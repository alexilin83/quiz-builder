import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import "./index.css";

console.log("Initial state: ", store.getState());

store.dispatch({type: 'quizes/quizAdded', payload: {title: 'Quiz new', lead: "letsa go", questions: ["whatsup"]}})

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);