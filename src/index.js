import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import store from './store';
import "./index.css";

console.log("Initial state: ", store.getState());

const unsubscribe = store.subscribe(() => {
    console.log("State after dispatch: ", store.getState());
});

store.dispatch({type: 'quizes/quizAdded', payload: {title: 'Quiz new', lead: "letsa go", questions: ["whatsup"]}});

unsubscribe();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);