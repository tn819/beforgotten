const express = require("express");
const router = (module.exports = express.Router());
const db = require("../utils/db");
const register = require("../utils/register");

router
    .route("/login")
    .get((req, res) => {
        console.log("GET login route");
        res.render("login", { layout: "main" });
    })
    .post((req, res) => {
        console.log("POST login route");

        db.getUser(req.body.email)
            .then(result => {
                const { userid, email, firstname, lastname } = result.rows[0];
                console.log("initial get user", {
                    userid,
                    email,
                    firstname,
                    lastname
                });
                Object.assign(req.session, {
                    userid,
                    email,
                    firstname,
                    lastname
                });
                console.log("initial login cookies", req.session);
                return db.checkPassword(
                    req.body.password,
                    result.rows[0].password
                );
            })
            .then(result => {
                console.log("password check result", result);
                return db.existProfile(req.session.userid);
            })
            .then(result => {
                console.log("profile exists", !result.rows[0].exists);
                if (!result.rows[0].exists) {
                    return res.redirect("/profile");
                }
                return db.getProfile(req.session.userid);
            })
            .then(result => {
                console.log("profile result after login", result);
                req.session.profileid = result.rows[0].profileid;
                res.redirect("/petition");
            })
            .catch(err => {
                console.log(err);
                return res.render("login", { layout: "main", error: err });
            });
    });

router
    .route("/register")
    .get((req, res) => {
        console.log("GET register route");
        res.render("register", { layout: "main" });
    })
    .post((req, res) => {
        console.log("POST register route");
        register
            .checkValidRegistration(
                req.body.firstname,
                req.body.lastname,
                req.body.email,
                req.body.password
            )
            .then(inputs => {
                console.log("registration inputs:", inputs);
                return db.addUser(
                    inputs.firstname,
                    inputs.lastname,
                    inputs.email,
                    inputs.password
                );
            })
            .then(result => {
                console.log("db registration inputs:", result);
                const { userid, firstname, lastname } = result.rows[0];
                Object.assign(req.session, { userid, firstname, lastname });
                res.redirect("/login");
            })
            .catch(err => {
                res.render("register", {
                    layout: "main",
                    error: err
                });
            });
    });
