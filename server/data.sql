CREATE DATABASE todoapp;

CREATE TABLE todos (
    id  VARCHAR(200) PRIMARY KEY,
    user_email VARCHAR(200),
    title VARCHAR(30),
    progress INT,
    date VARCHAR(300)
);

CREATE TABLE users (
    email VARCHAR(200) PRIMARY KEY,
    hashed_password VARCHAR(255)
);