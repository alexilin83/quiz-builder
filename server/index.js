const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { format } = require('mysql2');
const app = express();

const db = mysql.createPool({
    host: 'mysql_db',
    user: 'MYSQL_USER',
    password: 'MYSQL_PASSWORD',
    database: 'quizes'
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hi there');
});

app.get('/quizes', (req, res) => {
    db.promise().query("SELECT * FROM quizes_items")
    .then(([rows]) => {
        setTimeout(() => {
            res.send(rows);
        }, 1000);
    });
});

app.get('/quizes/:quizId', async (req, res) => {
    const quizId = req.params.quizId;
    let quiz = {};
    let questions = [];
    let answers = [];
    let results = [];

    const [quizRows, quizFields] = await db.promise().query(`SELECT * FROM quizes_items WHERE id = ${quizId}`);

    quiz = quizRows[0];

    if (quiz) {
        const [questionsRows, questionFields] = await db.promise().query(`SELECT * FROM quizes_questions WHERE quiz_id = ${quizId}`);
        questions = questionsRows;
        for (const question of questions) {
            const [rows, fields] = await db.promise().query(`SELECT * FROM quizes_answers WHERE question_id = ${question.id}`)
            answers = answers.concat(rows);
        }
        questions = questions.map(question => {
            question.answers = [];
            answers.forEach(answer => {
                if (answer.question_id === question.id) {
                    question.answers.push(answer);
                }
            });
            return question;
        });
        quiz.questions = questions;

        const [resultsRows, resultFields] = await db.promise().query(`SELECT * FROM quizes_results WHERE quiz_id = ${quizId}`);
        quiz.results = resultsRows;

        res.send(quiz);
    } else {
        res.status(404).send({
            message: 'Данные не найдены'
        });
    }
});

app.post('/quizes', async (req, res) => {
    const {title, description, image, imageSource, questions, answers, results} = req.body;

    let lastQuizInsertId;

    await db.promise().query("INSERT INTO quizes_items (title, description, image, imageSource) VALUES (?, ?, ?, ?)", [title, description, image, imageSource])
        .then(([result, rows]) => {
            lastQuizInsertId = result.insertId;
        })
        .catch(console.log);
    
    for (const [index, question] of questions.entries()) {
        const {id, title, image, imageSource} = question;
        let lastQuestionInsertId;
        await db.promise().query("INSERT INTO quizes_questions (quiz_id, position, title, image, imageSource) VALUES (?, ?, ?, ?, ?)", [lastQuizInsertId, index, title, image, imageSource])
            .then(([result, rows]) => {
                lastQuestionInsertId = result.insertId;
            })
            .catch(console.log);

        for (const [index, answer] of answers.entries()) {
            if (answer.question_id === question.id) {
                const { title, isCorrect } = answer;
                await db.promise().query("INSERT INTO quizes_answers (question_id, position, title, isCorrect) VALUES (?, ?, ?, ?)", [lastQuestionInsertId, index, title, isCorrect])
                    .then(result => {
                    })
                    .catch(console.log);
            }
        }
    }

    for (const [index, result] of results.entries()) {
        const {title, min, max} = result;
        await db.promise().query("INSERT INTO quizes_results (quiz_id, position, title, min, max) VALUES (?, ?, ?, ?, ?)", [lastQuizInsertId, index, title, min, max])
            .then(result => {
            })
            .catch(console.log);
    }

    res.send({
        id: lastQuizInsertId,
        message: 'Quiz created'
    });
});

app.put('/quizes/:quizId', async (req, res) => {
    const quizId = req.params.quizId;
    const { title, description, image, imageSource, questions, answers, results } = req.body;

    await db.promise().query("UPDATE quizes_items SET title = ?, description = ?, image = ?, imageSource = ? WHERE id = ?", [title, description, image, imageSource, quizId])
        .then(result => {
            
        })
        .catch(console.log);

    for (const [index, question] of questions.entries()) {
        const { quiz_id, title, image, imageSource, id } = question;

        if (typeof id === 'number') {
            if (question.isDeleted) {
                await db.promise().query("DELETE FROM quizes_questions WHERE id = ?", [id])
                    .then(result => {
                    })
                    .catch(console.log);
            } else {
                await db.promise().query("UPDATE quizes_questions SET quiz_id = ?, position = ?, title = ?, image = ?, imageSource = ? WHERE id = ?", [quiz_id, index, title, image, imageSource, id])
                    .then(result => {
                    })
                    .catch(console.log);
                for (const [index, answer] of answers.entries()) {
                    if (answer.question_id === question.id) {
                        const { question_id, title, isCorrect, id } = answer;
                        if (typeof id === 'number') {
                            if (answer.isDeleted) {
                                await db.promise().query("DELETE FROM quizes_answers WHERE id = ?", [id])
                                    .then(result => {
                                    })
                                    .catch(console.log);
                            } else {
                                await db.promise().query("UPDATE quizes_answers SET question_id = ?, position = ?, title = ?, isCorrect = ? WHERE id = ?", [question_id, index, title, isCorrect, id])
                                    .then(result => {
                                    })
                                    .catch(console.log);
                            }
                        } else {
                            await db.promise().query("INSERT INTO quizes_answers (question_id, position, title, isCorrect) VALUES (?, ?, ?, ?)", [question_id, index, title, isCorrect])
                                .then(result => {
                                })
                                .catch(console.log);
                        }
                    }
                }
            }
        } else {
            let lastQuestionInsertId;

            await db.promise().query("INSERT INTO quizes_questions (quiz_id, position, title, image, imageSource) VALUES (?, ?, ?, ?, ?)", [quiz_id, index, title, image, imageSource])
                .then(([result, rows]) => {
                    lastQuestionInsertId = result.insertId;
                })
                .catch(console.log);

            for (const [index, answer] of answers.entries()) {
                if (answer.question_id === question.id) {
                    const { title, isCorrect, id } = answer;
                    if (typeof id === 'number') {
                        await db.promise().query("UPDATE quizes_answers SET question_id = ?, position = ?, title = ?, isCorrect = ? WHERE id = ?", [lastQuestionInsertId, index, title, isCorrect, id])
                            .then(result => {
                            })
                            .catch(console.log);
                    } else {
                        await db.promise().query("INSERT INTO quizes_answers (question_id, position, title, isCorrect) VALUES (?, ?, ?, ?)", [lastQuestionInsertId, index, title, isCorrect])
                            .then(result => {
                            })
                            .catch(console.log);
                    }
                }
            }
        }
    }

    for (const [index, result] of results.entries()) {
        const { quiz_id, title, min, max, id } = result;

        if (typeof id === 'number') {
            if (result.isDeleted) {
                await db.promise().query("DELETE FROM quizes_results WHERE id = ?", [id])
                    .then(result => {
                    })
                    .catch(console.log);
            } else {
                await db.promise().query("UPDATE quizes_results SET quiz_id = ?, position = ?, title = ?, min = ?, max = ? WHERE id = ?", [quiz_id, index, title, min, max, id])
                    .then(result => {
                    })
                    .catch(console.log);
            }
        } else {
            await db.promise().query("INSERT INTO quizes_results (quiz_id, position, title, min, max) VALUES (?, ?, ?, ?, ?)", [quiz_id, index, title, min, max])
                .then(([result, rows]) => {
                })
                .catch(console.log);
        }
    }

    setTimeout(() => {
        res.send({
            status: 'success'
        });
    }, 1000);
});

app.delete('/quizes/:quizId', (req, res) => {
    const quizId = req.params.quizId;
    const DeleteQuery = "DELETE FROM quizes_items WHERE id = ?";
    db.query(DeleteQuery, quizId, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            setTimeout(() => {
                res.send({
                    status: 'success'
                });
            }, 1000);
        };
    });
});

app.listen('3001', () => {});