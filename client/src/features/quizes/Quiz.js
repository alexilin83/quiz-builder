import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import Question from '../questions/Question';

const Quiz = () => {
    let { id } = useParams();
    const quizes = useSelector(state => state.quizes);
    const quiz = quizes.find(quiz => quiz.id == id);

    const [title, setTitle] = useState(quiz.title);
    const [lead, setLead] = useState(quiz.lead);
    const [photo, setPhoto] = useState(quiz.photo);
    const [photoAuthor, setPhotoAuthor] = useState(quiz.photoAuthor);
    const [questions, setQuestions] = useState(quiz.questions);
    const dispatch = useDispatch();

    function handleTitleChange(e) {
        setTitle(e.target.value);
    }

    function handleLeadChange(e) {
        setLead(e.target.value);
    }

    function handlePhotoAuthorChange(e) {
        setPhotoAuthor(e.target.value);
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
                        <textarea className="input-textarea h-40" value={lead} onChange={handleLeadChange} />
                    </div>
                    <div className="col-span-3">
                        <label className="label">Главное изображение</label>
                        <div className="thumb mb-5">
                            <img className="thumb__img" src={photo} />
                        </div>
                        <label className="label">Источник изображения</label>
                        <input type="text" className="input-text" value={photoAuthor} onChange={handlePhotoAuthorChange} />
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