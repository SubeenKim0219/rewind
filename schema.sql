CREATE TABLE Users (
    id INT PRIMARY KEY auto_increment,
    username text not null,
    password text not null
);

CREATE TABLE Posts (
    id INT PRIMARY KEY auto_increment,
    user_id INT not null,
    title text not null,
    content text not null,
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_path TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Comments(
    id INT PRIMARY KEY auto_increment,
    user_id INT not null,
    post_id INT not null,
    content text not null,
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
