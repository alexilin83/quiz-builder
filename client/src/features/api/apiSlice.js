import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '/api'}),
    tagTypes: ['Quiz'],
    endpoints: builder => ({
        getQuizes: builder.query({
            query: () => '/quizes',
            providesTags: ['Quiz']
        }),
        getQuiz: builder.query({
            query: quizId => `/quizes/${quizId}`
        }),
        addNewQuiz: builder.mutation({
            query: initialQuiz => ({
                url: '/quizes/add',
                method: 'POST',
                body: initialQuiz
            }),
            invalidatesTags: ['Quiz']
        })
    })
});

export const { useGetQuizesQuery, useGetQuizQuery, useAddNewQuizMutation } = apiSlice;