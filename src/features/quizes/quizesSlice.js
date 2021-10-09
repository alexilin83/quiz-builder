const initialState = [
    // {
    //     id: 0,
    //     title: "Quiz 1",
    //     lead: "Let's start",
    //     questions: [
    //         {
    //             title: "Question 1",
    //             photo: "https://cdn2.thecatapi.com/images/34l.jpg",
    //             photoAuthor: "TheCatApi",
    //             variants: [
    //                 "Variant 1",
    //                 "Variant 2",
    //                 "Variant 3",
    //                 "Variant 4"
    //             ],
    //             correct: 2
    //         },
    //         {
    //             title: "Question 2",
    //             photo: "https://cdn2.thecatapi.com/images/qr.jpg",
    //             photoAuthor: "",
    //             variants: [
    //                 "Variant 1",
    //                 "Variant 2",
    //                 "Variant 3",
    //                 "Variant 4"
    //             ],
    //             correct: 3
    //         },
    //         {
    //             title: "Question 3",
    //             photo: "",
    //             photoAuthor: "",
    //             variants: [
    //                 "Variant 1",
    //                 "Variant 2",
    //                 "Variant 3",
    //                 "Variant 4"
    //             ],
    //             correct: 1
    //         }
    //     ]
    // },
    // {
    //     id: 1,
    //     title: "Quiz 2",
    //     lead: "Let's move",
    //     questions: [
    //         {
    //             title: "Question 1",
    //             photo: "https://cdn2.thecatapi.com/images/2mb.jpg",
    //             photoAuthor: "TheCatApi",
    //             variants: [
    //                 "Variant 1",
    //                 "Variant 2",
    //                 "Variant 3",
    //                 "Variant 4"
    //             ],
    //             correct: 4
    //         },
    //         {
    //             title: "Question 2",
    //             photo: "https://cdn2.thecatapi.com/images/BjXI8y9gY.jpg",
    //             photoAuthor: "",
    //             variants: [
    //                 "Variant 1",
    //                 "Variant 2",
    //                 "Variant 3",
    //                 "Variant 4"
    //             ],
    //             correct: 2
    //         }
    //     ]
    // }
]

function nextQuizId(quizes) {
    const maxId = quizes.reduce((maxId, quiz) => Math.max(quiz.id, maxId), -1);
    return maxId + 1;
}

export default function quizesReducer(state = initialState, action) {
    switch (action.type) {
        case "quizes/quizAdded": {
            return [
                ...state,
                {
                    id: nextQuizId(state),
                    title: action.payload.title,
                    lead: action.payload.lead,
                    questions: action.payload.questions
                }
            ]
        }
        case "quizes/quizChanged": {
            return state.map(quiz => {
                if (quiz.id !== action.payload.id) {
                    return quiz;
                }
                return {
                    ...quiz,
                    title: action.payload.title,
                    lead: action.payload.lead,
                    questions: action.payload.questions
                }
            })
        }
        default:
            return state
    }
}