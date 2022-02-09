CREATE TABLE IF NOT EXISTS quizes_items (
    id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(255) NOT NULL DEFAULT '',
    image VARCHAR(100) NOT NULL DEFAULT '',
    imageSource VARCHAR(50) NOT NULL DEFAULT '',
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS quizes_questions (
    id INT(11) NOT NULL AUTO_INCREMENT,
    quiz_id INT(11) NOT NULL,
    position INT(11) NOT NULL,
    title VARCHAR(100) NOT NULL DEFAULT '',
    image VARCHAR(100) NOT NULL DEFAULT '',
    imageSource VARCHAR(50) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    FOREIGN KEY (quiz_id) REFERENCES quizes_items(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS quizes_answers (
    id INT(11) NOT NULL AUTO_INCREMENT,
    question_id INT(11) NOT NULL,
    position INT(11) NOT NULL,
    title VARCHAR(100) NOT NULL DEFAULT '',
    isCorrect BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (question_id) REFERENCES quizes_questions(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_general_ci;

CREATE TABLE IF NOT EXISTS quizes_results (
    id INT(11) NOT NULL AUTO_INCREMENT,
    quiz_id INT(11) NOT NULL,
    position INT(11) NOT NULL,
    title VARCHAR(100) NOT NULL DEFAULT '',
    min INT(11) NOT NULL,
    max INT(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (quiz_id) REFERENCES quizes_items(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_general_ci;