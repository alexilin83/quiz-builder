import React, { useState } from 'react';
import Spinner from '../../app/components/Spinner';
import Question from '../questions/Question';
import { useAddQuizMutation } from '../api/apiSlice';
import { nanoid } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';

const AddQuizForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    const [addQuiz, { isLoading }] = useAddQuizMutation();

    let navigate = useNavigate();

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
            id: nanoid(),
            title: 'Новый вопрос',
            image: '',
            imageSource: '',
            isDeleted: false
        }]);
    }

    function onQuestionDataChanged(id, e) {
        let newQuestions = questions.map(question => {
            if (question.id === id) {
                question[e.currentTarget.getAttribute('name')] = e.target.value;
            }
            return question;
        });
        setQuestions(newQuestions);
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

    function onAnswerAdded(questionId) {
        setAnswers([...answers, {
            question_id: questionId,
            id: nanoid(),
            title: '',
            isCorrect: false,
            isDeleted: false
        }]);
    }

    function onAnswerChanged(id, e) {
        const newAnswers = answers.map(answer => {
            if (answer.id === id) {
                answer.title = e.target.value;
            }
            return answer;
        });
        setAnswers(newAnswers);
    }

    function onCorrectAnswerChanged(questionId, answerId) {
        const newAnswers = answers.map(answer => {
            if (answer.question_id === questionId) {
                if (answer.id === answerId) {
                    answer.isCorrect = true;
                } else {
                    answer.isCorrect = false;
                }
            }
            return answer;
        });
        setAnswers(newAnswers);
    }

    function onAnswerDeleted(id) {
        let newAnswers = answers.filter(answer => {
            if (answer.id !== id) {
                return true;
            }
            return false;
        });
        setAnswers(newAnswers);
    }

    const canSave = [title, description].every(Boolean);

    async function onSaveQuizClicked() {
        if (canSave) {
            try {
                await addQuiz({title, description, image, imageSource, questions, answers}).unwrap()
                    .then(payload => {
                        navigate(`/quizes/${payload.id}`);
                    });
            } catch (error) {
                console.error('Ошибка при сохранении теста: ', error);
            }
        }
    }

    return (
        <form className="overflow-hidden border rounded-md">
            <div className="px-10 py-8 bg-white">
                <div className="grid grid-cols-6 gap-6 mb-12">
                    <div className="col-span-3">
                        <label className="label">Заголовок</label>
                        <input type="text" className="input-text mb-5" value={title} onChange={onQuizTitleChanged} />
                        <label className="label">Описание</label>
                        <textarea className="input-textarea h-40" value={description} onChange={onQuizDescriptionChanged} />
                    </div>
                    <div className="col-span-3">
                        <label className="label">Главное изображение</label>
                        <div className="flex items-center mb-5">
                            <span className="thumb mr-2">
                                { image && <img className="thumb__img" src={image} alt="" /> }
                            </span>
                            <input type="text" className="input-text" value={image} onChange={onQuizImageChanged} />
                        </div>
                        <label className="label">Источник изображения</label>
                        <input type="text" className="input-text" value={imageSource} onChange={onQuizImageSourceChanged} />
                    </div>
                </div>
                <h2>Вопросы</h2>
                <div>
                    {questions.map((question, i) => {
                        const currentAnswers = answers.filter(answer => answer.question_id === question.id);
                        return <Question key={question.id} question={question} answers={currentAnswers} index={i + 1} onDataChanged={onQuestionDataChanged} onDeleted={onQuestionDeleted} onAnswerAdded={onAnswerAdded} onAnswerChanged={onAnswerChanged} onCorrectAnswerChanged={onCorrectAnswerChanged} onAnswerDeleted={onAnswerDeleted} />
                    })}
                    <button type="button" className="btn btn_secondary" onClick={onQuestionAdded}>Добавить вопрос</button>
                </div>
            </div>
            <div className="px-10 py-5 bg-gray-50">
                <button type="button" className="btn" onClick={onSaveQuizClicked} disabled={isLoading || !canSave}>
                    {isLoading &&
                        <div className="w-5 h-5 mr-2">
                            <Spinner />
                        </div>
                    }
                    Сохранить
                </button>
            </div>
        </form>
    )
}

export default AddQuizForm;