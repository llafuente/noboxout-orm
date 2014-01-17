drop table users;
drop table tags;
drop table sessions;

CREATE TABLE tags (
    tag_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    tag_name VARCHAR(255) NOT NULL,
    tag_created_at Datetime NOT NULL,
    tag_updated_at Datetime NULL,
    PRIMARY KEY ( tag_id )
) ENGINE=INNODB;

CREATE TABLE sessions (
    sess_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    sess_start_date Datetime NOT NULL,
    sess_created_at Datetime NOT NULL,
    sess_updated_at Datetime NULL,
    PRIMARY KEY ( sess_id )
) ENGINE=INNODB;

CREATE TABLE users (
    user_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_login VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_tag_id INT UNSIGNED NULL,
    user_sess_id INT UNSIGNED NULL,
    user_created_at Datetime NOT NULL,
    user_updated_at Datetime NULL,
    PRIMARY KEY ( user_id )
) ENGINE=INNODB;

ALTER TABLE users ADD FOREIGN KEY (user_sess_id)
      REFERENCES sessions(sess_id)
      ON UPDATE CASCADE
      ON DELETE SET NULL;

ALTER TABLE users ADD FOREIGN KEY (user_tag_id)
      REFERENCES tags(tag_id)
      ON UPDATE CASCADE
      ON DELETE SET NULL,