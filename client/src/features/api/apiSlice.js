import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '/api'}),
    tagTypes: ['Quiz'],
    endpoints: builder => ({
        getQuizes: builder.query({
            query: () => '/quizes',
            providesTags: (result = [], error, arg) => [
                'Quiz',
                ...result.map(({ id }) => ({type: 'Quiz', id}))
            ]
        }),
        getQuiz: builder.query({
            query: quizId => `/quizes/${quizId}`,
            providesTags: (result, error, arg) => [{type: 'Quiz', id: arg}]
        }),
        addQuiz: builder.mutation({
            query: initialQuiz => ({
                url: '/quizes',
                method: 'POST',
                body: initialQuiz
            }),
            invalidatesTags: ['Quiz']
        }),
        updateQuiz: builder.mutation({
            query: quiz => ({
                url: `/quizes/${quiz.id}`,
                method: 'PUT',
                body: quiz
            }),
            invalidatesTags: (result, error, arg) => [{type: 'Quiz', id: arg.id}]
        }),
        deleteQuiz: builder.mutation({
            query: quiz => ({
                url: `/quizes/${quiz.id}`,
                method: 'DELETE',
                body: quiz
            }),
            invalidatesTags: ['Quiz']
        })
    })
});

export const { useGetQuizesQuery, useGetQuizQuery, useAddQuizMutation, useUpdateQuizMutation, useDeleteQuizMutation } = apiSlice;