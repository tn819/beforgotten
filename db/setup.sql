DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS profiles;

CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE signatures (
    sigid SERIAL PRIMARY KEY,
    signature VARCHAR NOT NULL,
    sigtime TIMESTAMP NOT NULL,
    userid INTEGER UNIQUE references users(userid) ON DELETE CASCADE
);

CREATE TABLE profiles (
    profileid SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(150),
    url VARCHAR,
    userid INTEGER UNIQUE references users(userid) ON DELETE CASCADE
);
