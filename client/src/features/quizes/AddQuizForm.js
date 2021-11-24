import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Question from '../questions/Question';
import { addNewQuiz } from './quizesSlice';

const AddQuizForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [questions, setQuestions] = useState([]);
    const [addRequestStatus, setAddRequestStatus] = useState('idle');

    const dispatch = useDispatch();

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

    const canSave = [title, description].every(Boolean) && addRequestStatus === 'idle';

    async function onSaveQuizClicked() {
        if (canSave) {
            try {
                setAddRequestStatus('pending');
                await dispatch(addNewQuiz({title, description, image, imageSource, questions})).unwrap();
            } catch (error) {
                console.error('Ошибка при сохранении теста: ', error)
            } finally {
                setAddRequestStatus('idle');
            }
        }
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
                <button type="button" disabled={!canSave} className="btn" onClick={onSaveQuizClicked}>Сохранить</button>
            </div>
        </form>
    )
}

export default AddQuizForm;