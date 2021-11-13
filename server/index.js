const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
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

app.get('/get', (req, res) => {
    const SelectQuery = "SELECT * FROM quizes_items";
    db.query(SelectQuery, (err, result) => {
        res.send(result);
    });
});

app.post('/insert', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const imageSource = req.body.imageSource;
    const InsertQuery = "INSERT INTO quizes_items (title, description, image, imageSource) VALUES (?, ?, ?, ?)";
    db.query(InsertQuery, [title, description, image, imageSource], (err, result) => {
        res.send(result);
    });
});

app.delete('/delete/:quizId', (req, res) => {
    const quizId = req.params.quizId;
    const DeleteQuery = "DELETE FROM quizes_items WHERE id = ?";
    db.query(DeleteQuery, quizId, (err, result) => {
        if (err) console.log(err);
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

app.listen('3001', () => {});