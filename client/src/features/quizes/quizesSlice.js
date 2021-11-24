import { createSlice, createAsyncThunk, createEntityAdapter, nanoid } from '@reduxjs/toolkit';

const quizesAdapter = createEntityAdapter();

const initialState = quizesAdapter.getInitialState({
    status: 'idle',
    error: null
});

export const fetchQuizes = createAsyncThunk('quizes/fetchQuizes', async () => {
    return await fetch('/api/get')
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data;
        });
});

export const addNewQuiz = createAsyncThunk('quizes/addNewQuiz', async initialQuiz => {
    return await fetch('/api/insert', {
        body: JSON.stringify(initialQuiz)
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
        quizUpdated(state, action) {
            const { id, title, description, image, imageSource, questions } = action.payload;
            const quiz = state.entities[id];
            if (quiz) {
                quiz.title = title;
                quiz.description = description;
                quiz.image = image;
                quiz.imageSource = imageSource;
                quiz.questions = questions;
            }
        },
        quizDeleted: quizesAdapter.removeOne
    },
    extraReducers: builder => {
        builder
            .addCase(fetchQuizes.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchQuizes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                quizesAdapter.setAll(state, action.payload);
            })
            .addCase(fetchQuizes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addNewQuiz.fulfilled, quizesAdapter.addOne)
    }
})

export const { quizAdded, quizUpdated, quizDeleted } = quizesSlice.actions;

export default quizesSlice.reducer;

export const { selectAll: selectQuizes, selectById: selectQuizById } = quizesAdapter.getSelectors(state => state.quizes);