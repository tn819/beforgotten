var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:tneil:postgres@localhost:5432/tabasco-petition");

exports.addSigner = (firstname, lastname, signature) => {
    let q =
        "INSERT INTO signatures (firstname, lastname, signature, sigTime) VALUES ($1, $2, $3, current_timestamp)";
    let params = [firstname, lastname, signature];
    return db.query(q, params);
};

exports.listSigners = () => {
    let q = "SELECT * FROM signatures";
    return db.query(q);
};

exports.countSigners = () => {
    let q = "SELECT id FROM signatures";
    return db.query(q).length;
};

exports.pullSigner = id => {
    let q = "SELECT signature FROM signatures WHERE signature = $1";
    let params = [id];
    return db.query(q, params);
};
