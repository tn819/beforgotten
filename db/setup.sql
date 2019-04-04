/* replace table */
DROP TABLE IF EXISTS signatures;
CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    signature VARCHAR NOT NULL,
    sigTime TIMESTAMP
);
