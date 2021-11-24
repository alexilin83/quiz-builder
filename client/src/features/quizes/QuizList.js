import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import Spinner from '../../app/components/Spinner';
import { selectQuizes, fetchQuizes } from './quizesSlice';
import { PlusIcon } from '@heroicons/react/outline';

const QuizList = () => {
    const quizes = useSelector(selectQuizes);
    const loadingStatus = useSelector(state => state.quizes.status);
    const error = useSelector(state => state.error);

    const dispatch = useDispatch();

    useEffect(() => {
        if (loadingStatus === 'idle') {
            dispatch(fetchQuizes());
        }
    }, [loadingStatus, dispatch]);

    let content;

    if (loadingStatus === 'loading') {
        content = <Spinner />
    } else if (loadingStatus === 'succeeded') {
        content = <div className="flex gap-4">
            {quizes.map(quiz => {
                return (
                    <div className="w-1/5" key={quiz.id}>
                        <Link to={`/quiz/${quiz.id}`} className="block p-4 bg-green-400 hover:bg-green-500 rounded-lg text-white font-bold">{quiz.title}</Link>
                    </div>
                )
            })}
            <div className="w-1/5">
                <Link to="/quiz/new" className="block p-4 bg-green-400 hover:bg-green-500 rounded-lg text-white font-bold">
                    <PlusIcon className="h-6 w-6 mx-auto"/>
                </Link>
            </div>
        </div>;
    } else if (loadingStatus === 'failed') {
        content = <h2>{error}</h2>
    }

    return <div>{content}</div>;
}

export default QuizList;