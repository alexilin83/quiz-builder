import quizesReducer from "./quizesSlice";

test('should handle a todo being added to an empty list', () => {
    const previousState = [];

    const action = {type: 'quizes/quizAdded', payload: {title: 'Quiz new', lead: "letsa go", questions: ["whatsup"]}};
    const result = quizesReducer(previousState, action);

    expect(result).toEqual([
        {id: 0, title: 'Quiz new', lead: "letsa go", questions: ["whatsup"]}
    ])
});