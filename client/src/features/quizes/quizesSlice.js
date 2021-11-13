const initialState = {
    status: 'idle',
    entities: []
};

export default function quizesReducer(state = initialState, action) {
    switch (action.type) {
        case "quizes/quizesLoading": {
            return {
                ...state,
                status: 'loading'
            }
        }
        case "quizes/quizesLoaded": {
            return {
                ...state,
                status: 'idle',
                entities: action.payload
            };
        }
        case "quizes/quizAdded": {
            return {
                ...state,
                entities: [...state.entities, action.payload]
            }
        }
        case "quizes/quizChanged": {
            return {
                ...state,
                entities: state.entities.map(quiz => {
                    if (quiz.id !== action.payload.id) {
                        return quiz;
                    }
                    return {
                        ...quiz,
                        title: action.payload.title,
                        description: action.payload.description,
                        image: action.payload.image,
                        imageSource: action.payload.imageSource,
                        questions: action.payload.questions
                    }
                })
            }
        }
        default:
            return state
    }
}


export const quizesLoading = () => {
    return {
        type: 'quizes/quizesLoading'
    }
}

export const quizesLoaded = quizes => {
    return {
        type: 'quizes/quizesLoaded',
        payload: quizes
    }
}

export function fetchQuizes() {
    return async function fetchQuizesthunk(dispatch, getState) {
        dispatch(quizesLoading());
        await fetch('/api/get')
            .then(response => {
                return response.json();
            })
            .then(data => {
                dispatch(quizesLoaded(data))
            });
    }
}

export const quizAdded = quiz => {
    return {
        type: 'quizes/quizAdded',
        payload: quiz
    }
}

export function saveNewQuiz(quiz) {
    return async function saveNewQuizthunk(dispatch, getState) {
        await fetch('/api/insert', {
            body: JSON.stringify(quiz)
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                dispatch(quizAdded(data))
            });
    }
}

export function selectQuizes(state) {
    return state.quizes.entities;
}

export function selectQuizById(state, quizId) {
    return selectQuizes(state).find(quiz => quiz.id === quizId);
}