import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Spinner from '../../app/components/Spinner';
import Question from '../questions/Question';
import { useGetQuizQuery, useUpdateQuizMutation, useDeleteQuizMutation } from '../api/apiSlice';
import { nanoid } from '@reduxjs/toolkit';
import { SaveIcon, CodeIcon, TrashIcon } from '@heroicons/react/outline';
import { PlusCircleIcon } from '@heroicons/react/solid';
import Modal from '../../app/components/Modal';

const EditQuizForm = () => {
    let { id } = useParams();

    const { data: quiz, isFetching, isSuccess, error} = useGetQuizQuery(id);
    const [updateQuiz, { isLoading }] = useUpdateQuizMutation();
    const [deleteQuiz, { isLoading: isDeleting, isSuccess: isDeletingSuccess }] = useDeleteQuizMutation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

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
            })

            setQuestions(questionsData);
            setAnswers(answersData);
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

    const canSave = [title, description].every(Boolean);

    const onSaveQuizClicked = async () => {
        try {
            await updateQuiz({id, title, description, image, imageSource, questions, answers}).unwrap();
        } catch(error) {
            console.error('Ошибка при сохранении теста: ', error);
        }
    }

    const onDeleteQuizClicked = async () => {
        try {
            await deleteQuiz({id});
        } catch(error) {
            console.error('Ошибка при сохранении теста: ', error);
        }
    }

    function getCode() {
        setIsCodeModalOpen(true);
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
                                if (!question.isDeleted) {
                                    const currentAnswers = answers.filter(answer => answer.question_id === question.id);
                                    return <Question key={question.id} question={question} answers={currentAnswers} index={i + 1} onDataChanged={onQuestionDataChanged} onDeleted={onQuestionDeleted} onAnswerAdded={onAnswerAdded} onAnswerChanged={onAnswerChanged} onCorrectAnswerChanged={onCorrectAnswerChanged} onAnswerDeleted={onAnswerDeleted} />
                                }
                            })}
                            <button type="button" className="btn btn_secondary" onClick={onQuestionAdded}>
                                <PlusCircleIcon className='h-5 w-5 mr-2' />
                                Добавить вопрос
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center px-10 py-5 bg-gray-50">
                        <button type="button" className="btn mr-3" onClick={onSaveQuizClicked} disabled={isLoading || !canSave}>
                            {isLoading ?
                                <div className="w-5 h-5 mr-2">
                                    <Spinner />
                                </div>
                                :
                                <SaveIcon className='h-5 w-5 mr-2' />
                            }
                            Сохранить
                        </button>
                        <button type="button" className="btn btn_secondary mr-3" onClick={getCode}>
                            <CodeIcon className='h-5 w-5 mr-2' />
                            Получить код
                        </button>
                        <button type="button" className="btn btn_secondary text-red-600" onClick={onDeleteQuizClicked}>
                            {isDeleting ?
                                <div className="w-5 h-5 mr-2">
                                    <Spinner />
                                </div>
                                :
                                <TrashIcon className='h-5 w-5 mr-2' />
                            }
                            Удалить
                        </button>
                    </div>
                </form>
                <Modal isOpen={isCodeModalOpen} title="Код для вставки" description="Используйте этот код для отображения теста" onClose={() => setIsCodeModalOpen(false)}>
                    <code className='block whitespace-pre overflow-x-scroll'>{`
                        [HTML]
                        <div data-test-id="" class="m24-test"></div>
                        [/HTML]

                        [HTML]
                        <script src="/special/m24-test/main.js"></script>;
                        [/HTML]
                    `}</code>
                </Modal>
            </React.Fragment>
        )
    }

    return <div>{content}</div>;
}

export default EditQuizForm;