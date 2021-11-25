import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import Spinner from '../../app/components/Spinner';
import { selectQuizes, fetchQuizes } from './quizesSlice';
import { format, parseISO } from 'date-fns'

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
        const renderedQuizes = quizes.slice().sort((a, b) => b.date.localeCompare(a.date));
        content = renderedQuizes.map(quiz => {
                return (
                    <div className="mb-3" key={quiz.id}>
                        <Link to={`/quiz/${quiz.id}`} className="flex p-4 bg-white rounded-lg shadow">
                            <div className="overflow-hidden w-1/6 h-28 mr-3 bg-gray-300 rounded-lg">
                                {quiz.image && <img src={quiz.image} alt={quiz.imageSource} className="w-full h-full object-cover object-center" />}
                            </div>
                            <div className="">
                                <h3>{quiz.title}</h3>
                                <small>
                                    Дата создания: {format(parseISO(quiz.date), 'dd.MM.yyyy HH:mm')}
                                    <br />
                                    Кол-во вопросов: {quiz.questions.length}
                                </small>
                            </div>
                        </Link>
                    </div>
                )
            });
    } else if (loadingStatus === 'failed') {
        content = <h2>{error}</h2>
    }

    return <div>{content}</div>;
}

export default QuizList;