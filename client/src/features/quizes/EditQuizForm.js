import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import Spinner from '../../app/components/Spinner';
import Question from '../questions/Question';
import { selectQuizById, quizUpdated } from './quizesSlice';

const EditQuizForm = () => {
    let { id } = useParams();
    const loadingStatus = useSelector(state => state.quizes.status);
    const quiz = useSelector(state => selectQuizById(state, id));

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [questions, setQuestions] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (quiz) {
            setTitle(quiz.title);
            setDescription(quiz.description);
            setImage(quiz.image);
            setImageSource(quiz.imageSource);
            setQuestions(quiz.questions);
        }
    }, [quiz]);

    function onQuizTitleChanged(e) {
        setTitle(e.target.value);
    }

    function onQuizDescriptionChanged(e) {
        setDescription(e.target.value);
    }

    function onQuizImageChanged(e) {
        setImage(e.target.value);
    }

    function onQuizImageSourceChanged(e) {
        setImageSource(e.target.value);
    }

    function onQuestionAdded() {
        setQuestions([...questions, {
            pos: questions.length,
            title: 'Новый вопрос',
            image: '',
            answers: []
        }]);
    }

    function onQuestionTitleChanged(id, e) {
        let newQuestions = questions.map(question => {
            if (question.id === id) {
                question.title = e.target.value;
            }
            return question;
        });
        setQuestions(newQuestions);
    }

    function onQuestionImageChanged(id, e) {
        
    }

    function onQuestionDeleted(id, e) {
        e.stopPropagation();
        let newQuestions = questions.filter(question => {
            if (question.id !== id) {
                return true;
            }
            return false;
        });
        setQuestions(newQuestions);
    }

    function onAnswerChanged(id, questionId, e) {
        
    }

    function onSaveQuizClicked() {
        dispatch(quizUpdated({id, title, description, image, imageSource, questions}));
    }

    if (loadingStatus === 'loading' && id) {
        return <Spinner />
    } else if (!quiz && id) {
        return <h2 className="text-center">Quiz not found!</h2>
    }

    return (
        <form className="shadow rounded-md overflow-hidden">
            <div className="px-10 py-8 bg-white">
                <h2>Параметры</h2>
                <div className="grid grid-cols-6 gap-6 mb-12">
                    <div className="col-span-3">
                        <label className="label">Заголовок</label>
                        <input type="text" className="input-text mb-5" value={title} onChange={onQuizTitleChanged} />
                        <label className="label">Описание</label>
                        <textarea className="input-textarea h-40" value={description} onChange={onQuizDescriptionChanged} />
                    </div>
                    <div className="col-span-3">
                        <label className="label">Главное изображение</label>
                        <input type="text" className="input-text mb-2" value={image} onChange={onQuizImageChanged} />
                        <div className="thumb mb-5">
                            <img className="thumb__img" src={image} alt="" />
                        </div>
                        <label className="label">Источник изображения</label>
                        <input type="text" className="input-text" value={imageSource} onChange={onQuizImageSourceChanged} />
                    </div>
                </div>
                <h2>Вопросы</h2>
                <div>
                    {questions.map((question, i) =>
                        <Question key={question.id} question={question} index={i + 1} onTitleChanged={onQuestionTitleChanged} onImageChanged={onQuestionImageChanged} onAnswerChanged={onAnswerChanged} onDeleted={onQuestionDeleted} />
                    )}
                    <button type="button" className="btn btn_secondary mt-5" onClick={onQuestionAdded}>Добавить</button>
                </div>
            </div>
            <div className="px-10 py-5 bg-gray-50">
                <button type="button" className="btn" onClick={onSaveQuizClicked}>Сохранить</button>
            </div>
        </form>
    )
}

export default EditQuizForm;