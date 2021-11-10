CREATE TABLE IF NOT EXISTS `quizes-items` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(50) NOT NULL default '',
    `lead` varchar(200) NOT NULL default '',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;