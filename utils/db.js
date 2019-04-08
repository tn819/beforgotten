const dotenv = require("dotenv");
var spicedPg = require("spiced-pg");

var db = spicedPg(process.env.postgres);

exports.addSigner = (email, signature) => {
    let q =
        "INSERT INTO signatures (email, signature, sigtime) VALUES ($1, $2, current_timestamp) RETURNING email";
    let params = [email, signature];
    return db.query(q, params);
};

exports.addUser = (firstname, lastname, email, password) => {
    let q =
        "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *";
    let params = [firstname, lastname, email, password];
    return db.query(q, params);
};
exports.getUser = email => {
    let q = "SELECT * FROM users WHERE email = $1";
    let params = [email];
    return db.query(q, params);
};

exports.listSigners = () => {
    let q = "SELECT * FROM signatures";
    return db.query(q);
};

exports.listFullSigners = () => {
    let q =
        "SELECT firstname, lastname, email, signature, sigtime FROM users JOIN signatures ON users.email = signatures.email";
    return db.query(q);
};

exports.checkPassword = (
    textEnteredInLoginForm,
    hashedPasswordFromDatabase
) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            (err, doesMatch) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
};
