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
    let quizes = [];
    let questions = [];
    let answers = [];
    Promise.all([
        db.promise().query("SELECT * FROM quizes_items")
        .then(([rows]) => {
            quizes = rows;
        }),
        db.promise().query("SELECT * FROM quizes_questions")
        .then(([rows]) => {
            questions = rows;
        }),
        db.promise().query("SELECT * FROM quizes_answers")
        .then(([rows]) => {
            answers = rows;
        })
    ])
    .then(() => {
        questions = questions.map(question => {
            question.answers = [];
            answers.forEach(answer => {
                if (answer.question_id === question.id) {
                    question.answers.push(answer);
                }
            });
            return question;
        });
        quizes = quizes.map(quiz => {
            quiz.questions = [];
            questions.forEach(question => {
                if (question.quiz_id === quiz.id) {
                    quiz.questions.push(question);
                }
            });
            return quiz;
        });
        setTimeout(() => {
            res.send(quizes);
        }, 1000);
    });
});

app.get('/quizes/:quizId', async (req, res) => {
    const quizId = req.params.quizId;
    let quiz = {};
    let questions = [];
    let answers = [];

    const [quizRows, quizFields] = await db.promise().query(`SELECT * FROM quizes_items WHERE id = ${quizId}`)
    quiz = quizRows[0];
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
    res.send(quiz);
});

app.post('/quizes/add', async (req, res) => {
    const {title, description, image, imageSource, questions} = req.body;

    let lastQuizInsertId;

    await db.promise().query("INSERT INTO quizes_items (title, description, image, imageSource) VALUES (?, ?, ?, ?)", [title, description, image, imageSource])
        .then(([result, rows]) => {
            lastQuizInsertId = result.insertId;
        })
        .catch(console.log);
    
    for (const question of questions) {
        const {position, title, image, imageSource, answers} = question;
        let lastQuestionInsertId;
        await db.promise().query("INSERT INTO quizes_questions (quiz_id, postition, title, image, imageSurce) VALUES (?, ?, ?, ?, ?)", [lastQuizInsertId, position, title, image, imageSource])
            .then(result => {
                lastQuestionInsertId = result.insertId;
            })
            .catch(console.log);

        let answersArr = [];
        answers.forEach(answer => {
            const { position, title } = answer;
            answersArr.push([lastQuestionInsertId, position, title]);
        });

        await db.promise().query("INSERT INTO quizes_answers (question_id, postition, title) VALUES (?, ?, ?)", answersArr)
            .catch(console.log);
    }

    res.send({
        id: lastQuizInsertId,
        title,
        description,
        image,
        imageSource,
        questions,
        date: new Date().toISOString()
    });
});

app.put('/update/:quizId', (req, res) => {
    const quizId = req.params.quizId;
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const imageSource = req.body.imageSource;

    const UpdateQuery = "UPDATE quizes_items SET title = ? description = ? image = ? imageSource = ? WHERE id = ?";
    db.query(UpdateQuery, [title, description, image, imageSource, quizId], (err, result) => {
        if (err) console.log(err);
    });
});

app.delete('/delete/:quizId', (req, res) => {
    const quizId = req.params.quizId;

    const DeleteQuery = "DELETE FROM quizes_items WHERE id = ?";
    db.query(DeleteQuery, quizId, (err, result) => {
        if (err) console.log(err);
    });
});

app.listen('3001', () => {});