import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    status: 'idle',
    entities: [],
    questions: [],
    answers: []
};

export const fetchQuizes = createAsyncThunk('quizes/fetchQuizes', async () => {
    return await fetch('/api/get')
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data;
        });
});

export const saveNewQuiz = createAsyncThunk('quizes/saveNewQuiz', async quiz => {
    return await fetch('/api/insert', {
        body: JSON.stringify(quiz)
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data;
        });
});

const quizesSlice = createSlice({
    name: 'quizes',
    initialState,
    reducers: {
        quizesLoading(state) {
            state.status = "loading";
        },
        quizesLoaded(state, action) {
            const newEntities = {};
            action.payload.forEach(quiz => {
                newEntities[quiz.id] = quiz;
            });
            state.entities = newEntities;
            state.status = "idle";
        },
        quizAdded(state, action) {
            const quiz = action.payload;
            state.entities[quiz.id] = quiz;
        },
        quizDeleted(state, action) {
            delete state.entities[action.payload]
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchQuizes.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchQuizes.fulfilled, (state, action) => {
                const newEntities = {};
                action.payload.forEach(quiz => {
                    newEntities[quiz.id] = quiz;
                });
                state.entities = newEntities;
                state.status = 'idle';
            })
            .addCase(saveNewQuiz.fulfilled, (state, action) => {
                const quiz = action.payload;
                state.entities[quiz.id] = quiz;
            })
    }
})

const selectQuizesEntities = state => state.quizes.entities;

export const selectQuizes = createSelector(selectQuizesEntities, entities => Object.values(entities));

export function selectQuizById(state, quizId) {
    return selectQuizesEntities(state)[quizId];
}

export const { quizesLoading, quizesLoaded, quizAdded, quizDeleted } = quizesSlice.actions;

export default quizesSlice.reducer;