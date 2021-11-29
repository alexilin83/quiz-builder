import { configureStore } from '@reduxjs/toolkit';
import quizesReducer from '../features/quizes/quizesSlice';
import { apiSlice } from '../features/api/apiSlice';

const store = configureStore({
    reducer: {
        quizes: quizesReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;