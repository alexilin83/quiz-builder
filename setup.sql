CREATE TABLE IF NOT EXISTS quizes_items (
    id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(255) NOT NULL DEFAULT '',
    image VARCHAR(100) NOT NULL DEFAULT '',
    imageSource VARCHAR(50) NOT NULL DEFAULT '',
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS quizes_questions (
    id INT(11) NOT NULL AUTO_INCREMENT,
    quiz_id INT(11) NOT NULL,
    pos INT(11) NOT NULL,
    title VARCHAR(100) NOT NULL DEFAULT '',
    image VARCHAR(100) NOT NULL DEFAULT '',
    imageSource VARCHAR(50) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    FOREIGN KEY (quiz_id) REFERENCES quizes_items(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS quizes_answers (
    id INT(11) NOT NULL AUTO_INCREMENT,
    question_id INT(11) NOT NULL,
    pos INT(11) NOT NULL,
    title VARCHAR(100) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    FOREIGN KEY (question_id) REFERENCES quizes_questions(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_general_ci;

INSERT INTO
    quizes_items (
        title,
        description,
        image,
        imageSource
    )
VALUES
    (
        "Quiz 1",
        "Quiz 1 description",
        "https://picsum.photos/600/400",
        "Quiz 1 image source"
    );

INSERT INTO
    quizes_items (
        title,
        description,
        image,
        imageSource
    )
VALUES
    (
        "Quiz 2",
        "Quiz 2 description",
        "https://picsum.photos/600/400",
        "Quiz 2 image source"
    );

INSERT INTO
    quizes_questions (
        quiz_id,
        pos,
        title,
        image,
        imageSource
    )
VALUES
    (
        "1",
        "0",
        "Question 1",
        "https://picsum.photos/600/400",
        "Question 1 image source"
    );

INSERT INTO
    quizes_questions (
        quiz_id,
        pos,
        title,
        image,
        imageSource
    )
VALUES
    (
        "1",
        "1",
        "Question 2",
        "https://picsum.photos/600/400",
        "Question 2 image source"
    );

INSERT INTO
    quizes_questions (
        quiz_id,
        pos,
        title,
        image,
        imageSource
    )
VALUES
    (
        "2",
        "1",
        "Question 3",
        "https://picsum.photos/600/400",
        "Question 3 image source"
    );


INSERT INTO
    quizes_answers (
        question_id,
        pos,
        title
    )
VALUES
    (
        "1",
        "1",
        "Answer 1"
    );