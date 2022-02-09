import React, { useState } from 'react';
import Spinner from '../../app/components/Spinner';
import Question from '../questions/Question';
import Result from '../results/Result';
import { useAddQuizMutation } from '../api/apiSlice';
import { nanoid } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { SaveIcon } from '@heroicons/react/outline';
import { AdjustmentsIcon, GiftIcon } from '@heroicons/react/outline';
import { PlusCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid';
import Modal from '../../app/components/Modal';

const AddQuizForm = () => {
    const [addQuiz, { isLoading }] = useAddQuizMutation();

    const [activeSection, setActiveSection] = useState(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState([]);
    const [isQuizValidated, setIsQuizValidated] = useState(false);
    const [quizErrors, setQuizErrors] = useState([]);
    const [isErrorsModalOpen, setIsErrorsModalOpen] = useState(false);

    const form = React.createRef();

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
            title: '',
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

    function onResultAdded() {
        setResults([...results, {
            id: nanoid(),
            title: '',
            min: '',
            max: '',
            isDeleted: false
        }]);
    }

    function onResultDataChanged(id, e) {
        let newResults = results.map(result => {
            if (result.id === id) {
                result[e.currentTarget.getAttribute('name')] = e.target.value;
            }
            return result;
        });
        setResults(newResults);
    }

    function onResultDeleted(id, e) {
        e.stopPropagation();
        let newResults = results.filter(result => {
            if (result.id !== id) {
                return true;
            }
            return false;
        });
        setResults(newResults);
    }

    function isQuizReady() {
        const errors = [];
        let notEnoughAnswers = false;
        let noCorrectAnswer = false;
        let errorInResultsRange = false;
        let isReady = true;
        setIsQuizValidated(true);

        if (!form.current.checkValidity()) {
            isReady = false;
            errors.push('Заполните обязательные поля;');
        }

        if (questions.length < 1) {
            isReady = false;
            errors.push('Добавьте вопросы');
        }

        questions.forEach(question => {
            const currentAnswers = answers.filter(answer => answer.question_id === question.id);
            if (currentAnswers.length < 2  && !notEnoughAnswers) {
                isReady = false;
                notEnoughAnswers = true;
                errors.push('Добавьте ответы');
            }
            if (currentAnswers.length && !noCorrectAnswer) {
                const correct = currentAnswers.filter(answer => answer.isCorrect);
                if (!correct.length) {
                    isReady = false;
                    noCorrectAnswer = true;
                    errors.push('Отметьте правильные ответы');
                }
            }
        });

        if (results.length < 1) {
            isReady = false;
            errors.push('Добавьте результаты');
        }

        results.reduce((prev, current) => {
            if ((prev > current.max) && !errorInResultsRange) {
                errorInResultsRange = true;
                isReady = false;
                errors.push('Кол-во очков в результатах должно отличатся');
            }
            return current.max;
        }, 0);

        setQuizErrors(errors);

        return isReady;
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if (isQuizReady()) {
            try {
                await addQuiz({title, description, image, imageSource, questions, answers, results}).unwrap()
                    .then(payload => {
                        navigate(`/quizes/${payload.id}`);
                    });
            } catch (error) {
                console.error('Ошибка сохранения: ', error);
            }
        } else {
            setIsErrorsModalOpen(true);
        }
    }

    function handleTabsClick(e) {
        if (e.target.classList.contains('nav__btn')) {
            setActiveSection(parseInt(e.target.dataset.tab));
        }
    }

    return (
        <React.Fragment>
            <form ref={form} noValidate className={`overflow-hidden bg-white border rounded-lg ${isQuizValidated ? 'validated' : ''}`} onSubmit={e => {handleSubmit(e)}}>
                <div className="grid grid-cols-5 grid-rows-auto grid-flow-col">
                    <div className="row-span-2 py-6 border-r">
                        <ul onClick={e => handleTabsClick(e)}>
                            <li>
                                <button type="button" data-tab="1" className={`nav__btn ${activeSection === 1 ? 'nav__btn_active' : ''}`}>
                                    <AdjustmentsIcon className='nav__icon' />
                                    Параметры
                                </button>
                            </li>
                            <li>
                                <button type="button" data-tab="2" className={`nav__btn ${activeSection === 2 ? 'nav__btn_active' : ''}`}>
                                    <QuestionMarkCircleIcon className='nav__icon' />
                                    Вопросы
                                </button>
                            </li>
                            <li>
                                <button type="button" data-tab="3" className={`nav__btn ${activeSection === 3 ? 'nav__btn_active' : ''}`}>
                                    <GiftIcon className='nav__icon' />
                                    Результаты
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-4 p-8">
                        <fieldset className={`${activeSection === 1 ? 'block' : 'hidden'}`}>
                            <div className="form-group pt-0">
                                <div className='form-group__label'>
                                    <label>Заголовок <span className='text-red-500'>*</span></label>
                                </div>
                                <div className='form-group__inner'>
                                    <input type="text" className="input-text" value={title} onChange={onQuizTitleChanged} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className='form-group__label'>
                                    <label>Описание</label>
                                </div>
                                <div className='form-group__inner'>
                                    <textarea className="input-textarea h-40" value={description} onChange={onQuizDescriptionChanged} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className='form-group__label'>
                                    <label>Главное изображение</label>
                                </div>
                                <div className='form-group__inner'>
                                    <input type="text" className="input-text mb-2" value={image} onChange={onQuizImageChanged} />
                                    <span className="thumb">
                                        { image && <img className="thumb__img" src={image} alt="" /> }
                                    </span>
                                </div>
                            </div>
                            <div className="form-group pb-0 border-b-0">
                                <div className='form-group__label'>
                                    <label>Источник изображения</label>
                                </div>
                                <div className='form-group__inner'>
                                    <input type="text" className="input-text" value={imageSource} onChange={onQuizImageSourceChanged} />
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className={`${activeSection === 2 ? 'block' : 'hidden'}`}>
                            {questions.map((question, i) => {
                                const currentAnswers = answers.filter(answer => answer.question_id === question.id);
                                return <Question key={question.id} question={question} answers={currentAnswers} index={i + 1} onDataChanged={onQuestionDataChanged} onDeleted={onQuestionDeleted} onAnswerAdded={onAnswerAdded} onAnswerChanged={onAnswerChanged} onCorrectAnswerChanged={onCorrectAnswerChanged} onAnswerDeleted={onAnswerDeleted} />
                            })}
                            <button type="button" className="btn btn_secondary" onClick={onQuestionAdded}>
                                <PlusCircleIcon className='h-5 w-5 mr-2' />
                                Добавить вопрос
                            </button>
                        </fieldset>
                        <fieldset className={`${activeSection === 3 ? 'block' : 'hidden'}`}>
                            {results.map((result, i) => (
                                <Result key={result.id} result={result} index={i + 1} max={questions.length} onDataChanged={onResultDataChanged} onDeleted={onResultDeleted} />
                            ))}
                            <button type="button" className="btn btn_secondary" onClick={onResultAdded}>
                                <PlusCircleIcon className='h-5 w-5 mr-2' />
                                Добавить результат
                            </button>
                        </fieldset>
                    </div>
                    <div className="flex col-span-4 justify-end px-8 py-5 border-t">
                        <button type="submit" className="btn" disabled={isLoading}>
                            {isLoading ?
                                <div className="w-5 h-5 mr-2">
                                    <Spinner />
                                </div>
                                :
                                <SaveIcon className='h-5 w-5 mr-2' />
                            }
                            Сохранить
                        </button>
                    </div>
                </div>
            </form>
            <Modal isOpen={isErrorsModalOpen} type="error" title="Ошибка сохранения" onClose={() => setIsErrorsModalOpen(false)}>
                <ul className='list-disc pl-4'>
                    {quizErrors.map((error, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: error }}></li>
                    ))}
                </ul>
            </Modal>
        </React.Fragment>
    )
}

export default AddQuizForm;