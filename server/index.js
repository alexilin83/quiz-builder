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

app.post('/quizes', async (req, res) => {
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
        await db.promise().query("INSERT INTO quizes_questions (quiz_id, position, title, image, imageSurce) VALUES (?, ?, ?, ?, ?)", [lastQuizInsertId, position, title, image, imageSource])
            .then(result => {
                lastQuestionInsertId = result.insertId;
            })
            .catch(console.log);

        let answersArr = [];
        answers.forEach(answer => {
            const { position, title } = answer;
            answersArr.push([lastQuestionInsertId, position, title]);
        });

        await db.promise().query("INSERT INTO quizes_answers (question_id, position, title) VALUES (?, ?, ?)", answersArr)
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

app.put('/quizes/:quizId', async (req, res) => {
    const quizId = req.params.quizId;
    const { title, description, image, imageSource, questions, answers } = req.body;

    await db.promise().query("UPDATE quizes_items SET title = ?, description = ?, image = ?, imageSource = ? WHERE id = ?", [title, description, image, imageSource, quizId])
        .then(result => {
            
        })
        .catch(console.log);

    for (const [index, question] of questions.entries()) {
        const { quiz_id, title, image, imageSource, id } = question;

        if (typeof id === 'number') {
            await db.promise().query("UPDATE quizes_questions SET quiz_id = ?, position = ?, title = ?, image = ?, imageSource = ? WHERE id = ?", [quiz_id, index, title, image, imageSource, id])
                .then(result => {
                    
                })
                .catch(console.log);
        } else {
            await db.promise().query("INSERT INTO quizes_questions (quiz_id, position, title, image, imageSource) VALUES (?, ?, ?, ?, ?)", [quiz_id, index, title, image, imageSource])
                .then(result => {
                    
                })
                .catch(console.log);
        }
    }

    for (const [index, answer] of answers.entries()) {
        const { question_id, title, id } = answer;
        if (typeof id === 'number') {
            await db.promise().query("UPDATE quizes_answers SET question_id = ?, position = ?, title = ? WHERE id = ?", [question_id, index, title, id])
                .then(result => {
                    console.log(result);    
                })
                .catch(console.log);
        } else {
            await db.promise().query("INSERT INTO quizes_answers (question_id, position, title) VALUES (?, ?, ?)", [question_id, index, title])
                .then(result => {
                    console.log(result);    
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

app.delete('/delete/:quizId', (req, res) => {
    const quizId = req.params.quizId;

    const DeleteQuery = "DELETE FROM quizes_items WHERE id = ?";
    db.query(DeleteQuery, quizId, (err, result) => {
        if (err) console.log(err);
    });
});

app.listen('3001', () => {});