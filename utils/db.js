const dotenv = require("dotenv");
var spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");

var db = spicedPg(process.env.DATABASE_URL);

exports.addUser = (firstname, lastname, email, password) => {
    let q =
        "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING userid, firstname, lastname, email";
    let params = [firstname, lastname, email, password];
    return db.query(q, params);
};

exports.deleteUser = userid => {
    let q = "DELETE FROM users WHERE userid = $1";
    let params = [userid];
    return db.query(q, params);
};

exports.updateUserPW = (userid, firstname, lastname, email, password) => {
    let q =
        "UPDATE users SET firstname = $2, lastname = $3, email = $4, password = $5 WHERE userid = $1 RETURNING firstname, lastname, email";
    let params = [userid, firstname, lastname, email, password];
    return db.query(q, params);
};

exports.updateUserNoPW = (userid, firstname, lastname, email) => {
    let q =
        "UPDATE users SET firstname = $2, lastname = $3, email = $4 WHERE userid = $1 RETURNING firstname, lastname, email";
    let params = [userid, firstname, lastname, email];
    return db.query(q, params);
};

exports.getUser = email => {
    let q = "SELECT * FROM users WHERE email = $1";
    let params = [email];
    return db.query(q, params);
};

exports.getFullUser = userid => {
    let q =
        "SELECT users.userid, profileid, sigid, email, firstname, lastname, signature, sigtime, age, city, url FROM users JOIN signatures ON signatures.userid = users.userid JOIN profiles ON signatures.userid = profiles.userid WHERE users.userid=$1";
    let params = [userid];
    return db.query(q, params);
};

exports.addSigner = (signature, userid) => {
    let q =
        "INSERT INTO signatures (signature, userid, sigtime) VALUES ($1, $2, current_timestamp) RETURNING signature, sigid";
    let params = [signature, userid];
    return db.query(q, params);
};

exports.deleteSigner = userid => {
    let q = "DELETE FROM signatures WHERE userid = $1";
    let params = [userid];
    return db.query(q, params);
};

exports.getSigner = userid => {
    let q = "SELECT * FROM signatures WHERE userid = $1";
    let params = [userid];
    return db.query(q, params);
};

exports.getSigners = () => {
    let q = "SELECT * FROM signatures";
    return db.query(q);
};

exports.existSigner = userid => {
    let q = "SELECT EXISTS(SELECT 1 FROM signatures WHERE userid = $1)";
    let params = [userid];
    return db.query(q, params);
};

exports.getFullSigners = () => {
    let q =
        "SELECT firstname, lastname, signature, sigtime, age, city, url FROM signatures JOIN users ON signatures.userid = users.userid JOIN profiles ON signatures.userid = profiles.userid";
    return db.query(q);
};

exports.addProfile = (age, url, city, userid) => {
    let q =
        "INSERT INTO profiles (age, url, city, userid) VALUES ($1, $2, $3, $4) RETURNING profileid";
    let params = [age, url, city, userid];
    return db.query(q, params);
};

exports.getProfile = userid => {
    let q = "SELECT * FROM profiles WHERE userid = $1";
    let params = [userid];
    return db.query(q, params);
};

exports.existProfile = userid => {
    let q = "SELECT EXISTS(SELECT 1 FROM profiles WHERE userid=$1)";
    let params = [userid];
    return db.query(q, params);
};

exports.updateProfile = (userid, age, url, city) => {
    let q =
        "INSERT INTO profiles (userid, age, url, city) VALUES ($1, $2, $3, $4) ON CONFLICT (userid) DO UPDATE SET age = $2, url = $3, city = $4 RETURNING age, url, city";
    let params = [userid, age, url, city];
    return db.query(q, params);
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
