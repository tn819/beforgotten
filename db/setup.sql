/*
CREATE Tables with users, id on creation
connect tables in both
Signatures - add userID
GET /register
POST /register > store userID in cookie session
GET /login
POST /login - store userID in cookie session
*/

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS signatures;

CREATE TABLE users (
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) PRIMARY KEY,
    password TEXT NOT NULL
);


CREATE TABLE signatures (
    email VARCHAR(255) PRIMARY KEY references users(email),
    signature VARCHAR NOT NULL,
    sigtime TIMESTAMP
);
