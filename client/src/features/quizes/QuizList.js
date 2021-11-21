import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import Loader from '../loader/Loader';
import { selectQuizes } from './quizesSlice';

const QuizList = () => {
    const quizes = useSelector(selectQuizes);
    const loadingStatus = useSelector(state => state.quizes.status);

    if (loadingStatus === 'loading') {
        return <Loader />
    }

    return (
        <div className="flex gap-4">
            {quizes.map(quiz => {
                return (
                    <div className="w-1/5" key={quiz.id}>
                        <Link to={`/quiz/${quiz.id}`} className="block p-4 bg-green-400 hover:bg-green-500 rounded-lg text-white font-bold">{quiz.title}</Link>
                    </div>
                )
            })}
        </div>
    )
}

export default QuizList;