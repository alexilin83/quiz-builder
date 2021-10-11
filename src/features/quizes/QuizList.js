import React from 'react';
import { useSelector } from 'react-redux';

const QuizList = () => {
    const quizes = useSelector(state => state.quizes);

    return (
        <div className="quizes">
            {quizes.map(quiz => {
                return <div className="quizes__item" key={quiz.id}>{quiz.title}</div>
            })}
        </div>
    )
}

export default QuizList;