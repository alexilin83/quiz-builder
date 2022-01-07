import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Spinner from '../../app/components/Spinner';
import Question from '../questions/Question';
import { useGetQuizQuery, useUpdateQuizMutation } from '../api/apiSlice';
import { nanoid } from '@reduxjs/toolkit';

const EditQuizForm = () => {
    let { id } = useParams();

    const { data: quiz, isFetching, isSuccess} = useGetQuizQuery(id);
    const [updateQuiz, { isLoading }] = useUpdateQuizMutation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

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
                    imageSource: question.imageSource
                });

                question.answers.forEach(answer => {
                    answersData.push({
                        question_id: answer.question_id,
                        id: answer.id,
                        title: answer.title
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
            imageSource: ''
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
            title: ''
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

    const onSaveQuizClicked = async () => {
        if (title && description) {
            await updateQuiz({id, title, description, image, imageSource, questions, answers});
        }
    }

    let content;

    if (isFetching) {
        content = <div className="mx-auto w-10 h-10">
                    <Spinner />
                </div>
    } else if (isSuccess) {
        content = <form className="overflow-hidden border rounded-md">
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
                <button type="button" className="btn" onClick={onSaveQuizClicked} disabled={isLoading}>
                    {isLoading &&
                        <div className="w-5 h-5 mr-2">
                            <Spinner />
                        </div>
                    }
                    Сохранить
                </button>
            </div>
        </form>
    }

    return <div>{content}</div>;
}

export default EditQuizForm;