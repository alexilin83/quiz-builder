import React, { useMemo } from 'react';
import { Link } from "react-router-dom";
import Spinner from '../../app/components/Spinner';
import { useGetQuizesQuery } from '../api/apiSlice';
import { format, parseISO } from 'date-fns'

let QuizExcerpt = ({quiz}) => {
    return (
        <div className="mb-3">
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
}

const QuizList = () => {
    const { data: quizes = [], isLoading, isSuccess, isError, error } = useGetQuizesQuery();

    const sortedQuizes = useMemo(() => {
        const sortedQuizes = quizes.slice();
        sortedQuizes.sort((a, b) => b.date.localeCompare(a.date));
        return sortedQuizes;
    }, [quizes]);

    let content;

    if (isLoading) {
        content = <Spinner />
    } else if (isSuccess) {
        content = sortedQuizes.map(quiz => (
            <QuizExcerpt key={quiz.id} quiz={quiz} />
        ));
    } else if (isError) {
        content = <h2>{error}</h2>
    }

    return <div>{content}</div>;
}

export default QuizList;