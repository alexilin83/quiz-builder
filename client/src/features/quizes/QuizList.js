import React, { useMemo } from 'react';
import { Link } from "react-router-dom";
import Spinner from '../../app/components/Spinner';
import { useGetQuizesQuery } from '../api/apiSlice';
import { format, parseISO } from 'date-fns'

let QuizExcerpt = ({quiz}) => {
    return (
        <div className="mb-3">
            <Link to={`/quizes/${quiz.id}`} className="flex p-4 bg-white text-current rounded-lg hover:text-current">
                <div className="overflow-hidden w-1/6 h-28 mr-3 bg-gray-300 rounded-lg">
                    {quiz.image && <img src={quiz.image} alt={quiz.imageSource} className="w-full h-full object-cover object-center" />}
                </div>
                <div className="">
                    <h3>{quiz.title}</h3>
                    <small>
                        Дата создания: {format(parseISO(quiz.date), 'dd.MM.yyyy HH:mm')}
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
        content = <div className="mx-auto w-10 h-10">
                    <Spinner />
                </div>
    } else if (isSuccess) {
        content = sortedQuizes.map(quiz => (
            <QuizExcerpt key={quiz.id} quiz={quiz} />
        ));
    } else if (isError) {
        content = <h2>{error.error}</h2>
    }

    return <div>{content}</div>;
}

export default QuizList;