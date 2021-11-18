import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import Question from '../questions/Question';
import Loader from '../loader/Loader';
import { selectQuizById } from './quizesSlice';

const Quiz = () => {
    let { id } = useParams();
    const loadingStatus = useSelector(state => state.quizes.status);
    const quiz = useSelector(state => selectQuizById(state, id));

    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (quiz) {
            setTitle(quiz.title);
            setDescription(quiz.description);
            setImage(quiz.image);
            setImageSource(quiz.imageSource);
            setQuestions(quiz.questions);
        } else {
            setTitle('');
            setDescription('');
            setImage('');
            setImageSource('');
            setQuestions([]);
        }
    }, [quiz]);

    function handleTitleChange(e) {
        setTitle(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleImageChange(e) {
        setImage(e.target.value);
    }

    function handleImageSourceChange(e) {
        setImageSource(e.target.value);
    }

    if (loadingStatus === 'loading' && id) {
        return <Loader />
    }

    return (
        <form className="shadow rounded-md overflow-hidden">
            <div className="px-10 py-8 bg-white">
                <h2>Параметры</h2>
                <div className="grid grid-cols-6 gap-6 mb-12">
                    <div className="col-span-3">
                        <label className="label">Название</label>
                        <input type="text" className="input-text mb-5" value={title} onChange={handleTitleChange} />
                        <label className="label">Описание</label>
                        <textarea className="input-textarea h-40" value={description} onChange={handleDescriptionChange} />
                    </div>
                    <div className="col-span-3">
                        <label className="label">Главное изображение</label>
                        <input type="text" className="input-text mb-2" value={image} onChange={handleImageChange} />
                        <div className="thumb mb-5">
                            <img className="thumb__img" src={image} alt="" />
                        </div>
                        <label className="label">Источник изображения</label>
                        <input type="text" className="input-text" value={imageSource} onChange={handleImageSourceChange} />
                    </div>
                </div>
                <h2>Вопросы</h2>
                <div>
                    {questions.map((question, i) => <Question question={question} key={question.id} number={i + 1} />)}
                </div>
            </div>
            <div className="px-10 py-5 bg-gray-50 text-right">
                <button type="submit" className="btn">Сохранить</button>
            </div>
        </form>
    )
}

export default Quiz;