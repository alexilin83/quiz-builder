const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const db = mysql.createPool({
    host: 'mysql_db',
    user: 'MYSQL_USER',
    password: 'MYSQL_PASSWORD',
    database: 'quizes'
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hi there');
});

app.get('/get', (req, res) => {
    const SelectQuery = "SELECT * FROM quizes-items";
    db.query(SelectQuery, (err, result) => {
        console.log('res: ', result);
        res.send(result);
    });
});

app.post('/insert', (req, res) => {
    const title = req.body.title;
    const lead = req.body.lead;
    const InsertQuery = "INSERT INTO quizes-items (title, lead) VALUES (?, ?)";
    db.query(InsertQuery, [title, lead], (err, result) => {
        console.log(result);
    });
});

app.delete('/delete/:quizId', (req, res) => {
    const quizId = req.params.quizId;
    const DeleteQuery = "DELETE FROM quizes-items WHERE id = ?";
    db.query(DeleteQuery, quizId, (err, result) => {
        if (err) console.log(err);
    });
});

app.put('/update/:quizId', (req, res) => {
    const quizId = req.params.quizId;
    const title = req.body.title;
    const lead = req.body.lead;
    const UpdateQuery = "UPDATE quizes-items SET title = ? lead = ? WHERE id = ?";
    db.query(UpdateQuery, [title, lead, quizId], (err, result) => {
        if (err) console.log(err);
    });
});

app.listen('3001', () => {});