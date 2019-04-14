const express = require("express");
const router = (module.exports = express.Router());
const db = require("../utils/db");
const register = require("../utils/register");

router
    .route("/login")
    .get((req, res) => {
        console.log("GET login route");
        res.render("login", { layout: "welcome" });
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
                return db.getFullUser(req.session.userid);
            })
            .then(result => {
                console.log(result);
                if (!result.rows[0]) {
                    res.redirect("/profile");
                } else if (!result.rows[0].sigid) {
                    const { profileid, age, url } = result.rows[0];
                    Object.assign(req.session, { profileid, age, url });
                    res.redirect("/petition");
                } else if (result.rows[0].sigid) {
                    const {
                        profileid,
                        age,
                        url,
                        sigid,
                        sigtime
                    } = result.rows[0];
                    Object.assign(req.session, {
                        profileid,
                        age,
                        url,
                        sigid,
                        sigtime
                    });
                    res.redirect("/thanks");
                }
            })
            .catch(err => {
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

router.route("/logout").get((req, res) => {
    req.session = null;
    console.log("logout route!", req.session);
    res.redirect("/");
});
