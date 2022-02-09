import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Spinner from '../../app/components/Spinner';
import Question from '../questions/Question';
import Result from '../results/Result';
import { useGetQuizQuery, useUpdateQuizMutation, useDeleteQuizMutation } from '../api/apiSlice';
import { nanoid } from '@reduxjs/toolkit';
import { SaveIcon, CodeIcon, TrashIcon } from '@heroicons/react/outline';
import { AdjustmentsIcon, GiftIcon } from '@heroicons/react/outline';
import { PlusCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid';
import Modal from '../../app/components/Modal';

const EditQuizForm = () => {
    let { id } = useParams();

    const { data: quiz, isFetching, isSuccess, error} = useGetQuizQuery(id);
    const [updateQuiz, { isLoading }] = useUpdateQuizMutation();
    const [deleteQuiz, { isLoading: isDeleting, isSuccess: isDeletingSuccess }] = useDeleteQuizMutation();

    const [activeSection, setActiveSection] = useState(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState([]);
    const [isQuizValidated, setIsQuizValidated] = useState(false);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [quizErrors, setQuizErrors] = useState([]);
    const [isErrorsModalOpen, setIsErrorsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    let navigate = useNavigate();

    useEffect(() => {
        if (isDeletingSuccess) {
            navigate('/');
        }
    }, [isDeletingSuccess, navigate])

    useEffect(() => {
        if (quiz) {
            setTitle(quiz.title);
            setDescription(quiz.description);
            setImage(quiz.image);
            setImageSource(quiz.imageSource);

            let questionsData = [];
            let answersData = [];
            let resultsData = [];

            quiz.questions.forEach(question => {
                questionsData.push({
                    quiz_id: id,
                    id: question.id,
                    title: question.title,
                    image: question.image,
                    imageSource: question.imageSource,
                    isDeleted: false
                });

                question.answers.forEach(answer => {
                    answersData.push({
                        question_id: answer.question_id,
                        id: answer.id,
                        title: answer.title,
                        isCorrect: answer.isCorrect,
                        isDeleted: false
                    })
                });
            });
            quiz.results.forEach(result => {
                resultsData.push({
                    quiz_id: id,
                    id: result.id,
                    title: result.title,
                    min: result.min,
                    max: result.max,
                    isDeleted: false
                });
            });

            setQuestions(questionsData);
            setAnswers(answersData);
            setResults(resultsData);
        }
    }, [quiz, id]);

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
            quiz_id: id,
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
        let newQuestions = questions.map(question => {
            if (question.id === id) {
                return {...question, isDeleted: true};
            }
            return question;
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
        let newAnswers = answers.map(answer => {
            if (answer.id === id) {
                return {...answer, isDeleted: true};
            }
            return answer;
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
                return {...result, isDeleted: true};
            }
            return false;
        });
        setResults(newResults);
    }

    function isQuizReady(form) {
        const errors = [];
        let isReady = true;
        setIsQuizValidated(true);

        if (!form.checkValidity()) {
            isReady = false;
            errors.push('<b>Заполните обязательные поля</b>');
        }

        if (questions.length < 1) {
            isReady = false;
            errors.push('<b>Добавьте вопросы</b> (тест должен иметь минимум один вопрос)');
        }

        let notEnoughAnswers = false;
        let noCorrectAnswer = false;

        questions.forEach(question => {
            const currentAnswers = answers.filter(answer => answer.question_id === question.id);
            if (currentAnswers.length < 2  && !notEnoughAnswers) {
                isReady = false;
                notEnoughAnswers = true;
                errors.push('<b>Добавьте ответы</b> (вопрос должен иметь не меньше двух ответов)');
            }
            if (currentAnswers.length && !noCorrectAnswer) {
                const correct = currentAnswers.filter(answer => answer.isCorrect);
                if (!correct.length) {
                    isReady = false;
                    noCorrectAnswer = true;
                    errors.push('<b>Отметьте правильные ответы</b> (вопрос должен иметь правильный ответ)');
                }
            }
        });

        setQuizErrors(errors);

        return isReady;
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if (isQuizReady(e.currentTarget)) {
            try {
                await updateQuiz({id, title, description, image, imageSource, questions, answers, results}).unwrap();
            } catch (error) {
                console.error('Ошибка сохранения: ', error);
            }
        } else {
            setIsErrorsModalOpen(true);
        }
    }

    function onDeleteQuizClicked() {
        setIsDeleteModalOpen(true);
    }

    const handleDeleteQuiz = async () => {
        try {
            await deleteQuiz({id});
        } catch(error) {
            console.error('Ошибка при сохранении теста: ', error);
        }
    }

    function getCode() {
        setIsCodeModalOpen(true);
    }

    function handleTabsClick(e) {
        if (e.target.classList.contains('nav__btn')) {
            setActiveSection(parseInt(e.target.dataset.tab));
        }
    }

    let content;

    if (error) {
        content = <h2 className='text-center'>{error.data.message}</h2>
    } else if (isFetching) {
        content = <div className="mx-auto w-10 h-10">
                    <Spinner />
                </div>
    } else if (isSuccess) {
        content = (
            <React.Fragment>
                <form noValidate className={`overflow-hidden bg-white border rounded-md ${isQuizValidated ? 'validated' : ''}`} onSubmit={e => {handleSubmit(e)}}>
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
                                    if (!question.isDeleted) {
                                        const currentAnswers = answers.filter(answer => answer.question_id === question.id);
                                        return <Question key={question.id} question={question} answers={currentAnswers} index={i + 1} onDataChanged={onQuestionDataChanged} onDeleted={onQuestionDeleted} onAnswerAdded={onAnswerAdded} onAnswerChanged={onAnswerChanged} onCorrectAnswerChanged={onCorrectAnswerChanged} onAnswerDeleted={onAnswerDeleted} />
                                    }
                                    return false;
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
                            <button type="submit" className="btn mr-3" disabled={isLoading}>
                                {isLoading ?
                                    <div className="w-5 h-5 mr-2">
                                        <Spinner />
                                    </div>
                                    :
                                    <SaveIcon className='h-5 w-5 mr-2' />
                                }
                                Сохранить
                            </button>
                            <button type="button" className="btn btn_primary mr-3" onClick={getCode}>
                                <CodeIcon className='h-5 w-5 mr-2' />
                                Получить код
                            </button>
                            <button type="button" className="btn btn_secondary text-red-600" onClick={onDeleteQuizClicked}>
                                <TrashIcon className='h-5 w-5 mr-2' />
                                Удалить
                            </button>
                        </div>
                    </div>
                </form>
                <Modal isOpen={isCodeModalOpen} title="Код для вставки" description="Используйте этот код для отображения теста" onClose={() => setIsCodeModalOpen(false)}>
                    <code className='block whitespace-pre overflow-x-auto text-sm'>{
`[HTML]
<div data-test-id="${id}" class="m24-test"></div>
<script src="/special/m24-test/main.js"></script>;
[/HTML]`
                    }</code>
                </Modal>
                <Modal isOpen={isErrorsModalOpen} type="error" title="Ошибка сохранения" onClose={() => setIsErrorsModalOpen(false)}>
                    <ul className='list-disc pl-4'>
                        {quizErrors.map((error, i) => (
                            <li key={i} dangerouslySetInnerHTML={{ __html: error }}></li>
                        ))}
                    </ul>
                </Modal>
                <Modal isOpen={isDeleteModalOpen} type="warning" title="Внимание!" actionProcess={isDeleting} onAction={() => handleDeleteQuiz()} onClose={() => setIsDeleteModalOpen(false)}>
                    <p className='text-center'>Вы уверены что хотите удалить тест?</p>
                </Modal>
            </React.Fragment>
        )
    }

    return <div>{content}</div>;
}

export default EditQuizForm;