const dotenv = require("dotenv");
var spicedPg = require("spiced-pg");

var db = spicedPg(process.env.postgres);

exports.addSigner = (firstname, lastname, signature) => {
    let q =
        "INSERT INTO signatures (firstname, lastname, signature, sigTime) VALUES ($1, $2, $3, current_timestamp) RETURNING id";
    let params = [firstname, lastname, signature];
    return db.query(q, params);
};

exports.listSigners = () => {
    let q = "SELECT * FROM signatures";
    return db.query(q);
};
