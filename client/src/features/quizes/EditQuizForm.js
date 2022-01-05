import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Spinner from '../../app/components/Spinner';
import Question from '../questions/Question';
import { useGetQuizQuery, useEditQuizMutation } from '../api/apiSlice';
import { nanoid } from '@reduxjs/toolkit';

const EditQuizForm = () => {
    let { id } = useParams();

    const { data: quiz, isFetching, isSuccess} = useGetQuizQuery(id);
    const [updateQuiz, { isLoading }] = useEditQuizMutation();

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
                    id: question.id,
                    title: question.title,
                    image: question.image
                });

                question.answers.forEach(answer => {
                    answersData.push({
                        id: answer.id,
                        question_id: answer.question_id,
                        title: answer.title
                    })
                });
            })

            setQuestions(questionsData);
            setAnswers(answersData);
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
            id: nanoid(),
            position: questions.length,
            title: 'Новый вопрос',
            image: '',
            answers: []
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
            id: nanoid(),
            question_id: questionId,
            position: answers.reduce(function(previousValue, currentValue, i, array) {
                if (array[i].question_id === questionId) {
                    return previousValue + 1;
                }
                return previousValue;
            }, 1),
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

    const onSaveQuizClicked = async () => {
        if (title && description) {
            await updateQuiz({id, title, description, image, imageSource, questions});
        }
    }

    let content;

    if (isFetching) {
        content = <Spinner />
    } else if (isSuccess) {
        content = <form className="shadow rounded-md overflow-hidden">
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
                    {questions.map((question, i) => {
                        const currentAnswers = answers.filter(answer => answer.question_id === question.id);
                        return <Question key={question.id} question={question} answers={currentAnswers} index={i + 1} onDataChanged={onQuestionDataChanged} onAnswerAdded={onAnswerAdded} onAnswerChanged={onAnswerChanged} onCorrectAnswerChanged={onCorrectAnswerChanged} onDeleted={onQuestionDeleted} />
                    })}
                    <button type="button" className="btn btn_secondary mt-5" onClick={onQuestionAdded}>Добавить</button>
                </div>
            </div>
            <div className="px-10 py-5 bg-gray-50">
                <button type="button" className="btn" onClick={onSaveQuizClicked}>Сохранить</button>
            </div>
        </form>
    }

    return <div>{content}</div>;
}

export default EditQuizForm;