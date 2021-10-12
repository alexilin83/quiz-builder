import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";

const Quiz = () => {
    let { id } = useParams();
    const quizes = useSelector(state => state.quizes);
    const quiz = quizes.find(quiz => quiz.id == id);

    const [title, setTitle] = useState(quiz.title);
    const [lead, setLead] = useState(quiz.lead);
    const [photo, setPhoto] = useState(quiz.photo);
    const dispatch = useDispatch();

    return (
        <React.Fragment>
            <div className="control">
                <div className="control__label">
                    <label className="label">Название</label>
                </div>
                <div className="control__input">
                    <input type="text" className="input-text" value={title} />
                </div>
            </div>
            <div className="control">
                <div className="control__label">
                    <label className="label">Описание</label>
                </div>
                <div className="control__input">
                    <textarea className="input-textarea" value={lead} />
                </div>
            </div>
            <div className="control">
                <div className="control__label">
                    <label className="label">Главное изображение</label>
                </div>
                <div className="control__input">
                    <div className="thumb">
                        <img className="thumb__img" src={photo} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Quiz;