const express = require("express");
const router = (module.exports = express.Router());
const db = require("../utils/db");
const register = require("../utils/register");

router
    .route("/petition")
    .get((req, res) => {
        return db.getFullUser(req.session.userid);
    })
    .then((req, res) => {
        console.log("GET petition route");
        if (!result.rows[0].sigid) {
            const { profileid, age, url } = result.rows[0];
            Object.assign(req.session, { profileid, age, url });
            return res.render("forms", {
                firstname: req.session.firstname,
                lastname: req.session.lastname
            });
        } else if (result.rows[0].sigid) {
            const { profileid, age, url, sigid, sigtime } = result.rows[0];
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
    .post((req, res) => {
        db.addSigner(req.body.signatureURL, req.session.userid)
            .then(result => {
                req.session.sigid = result.rows[0].sigid;
                res.redirect("/thanks");
            })
            .catch(err => {
                console.log(err);
                res.redirect("/invalid");
            });
    });

router
    .route("/update")
    .get((req, res) => {
        db.getFullUser(req.session.userid)
            .then(result => {
                let userInfo = {};
                const {
                    email,
                    firstname,
                    lastname,
                    age,
                    url,
                    city
                } = result.rows[0];
                Object.assign(userInfo, {
                    email,
                    firstname,
                    lastname,
                    age,
                    url,
                    city
                });
                console.log(userInfo);
                res.render("update", { layout: "main", userInfo: userInfo });
            })
            .catch(err => {
                let userInfo = {};
                const {
                    email,
                    firstname,
                    lastname,
                    age,
                    url,
                    city
                } = result.rows[0];
                Object.assign(userInfo, {
                    email,
                    firstname,
                    lastname,
                    age,
                    url,
                    city
                });
                res.render("update", {
                    layout: "main",
                    userInfo: userInfo,
                    error: err
                });
            });
    })
    .post((req, res) => {
        var checkValidProfile = register.checkValidProfile(
            req.body.age,
            req.body.url,
            req.body.city
        );
        if (req.body.password === "" || req.body.password == null) {
            Promise.all([
                register.checkValidRegistrationNoPW(
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email
                ),
                checkValidProfile
            ])
                .then(sanitizedInputs => {
                    console.log("empty pw inputs", sanitizedInputs);
                    let user = sanitizedInputs[0];
                    let profile = sanitizedInputs[1];
                    return Promise.all([
                        db.updateUserNoPW(
                            req.session.userid,
                            user.firstname,
                            user.lastname,
                            user.email
                        ),
                        db.updateProfile(
                            req.session.userid,
                            profile.age,
                            profile.url,
                            profile.city
                        )
                    ]);
                })
                .then(results => {
                    const { firstname, lastname, email } = results[0].rows[0];
                    const { age, url, city } = results[1].rows[0];
                    Object.assign(req.session, { firstname, lastname, email });
                    Object.assign(req.session, { age, url, city });
                    res.redirect("/petition");
                })
                .catch(err => {
                    res.render("update", {
                        layout: "main",
                        userInfo: req.session,
                        error: err
                    });
                });
        } else {
            Promise.all([
                register.checkValidRegistration(
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email,
                    req.body.password
                ),
                checkValidProfile
            ])
                .then(sanitizedInputs => {
                    console.log("with pw inputs", sanitizedInputs);

                    let user = sanitizedInputs[0];
                    let profile = sanitizedInputs[1];
                    return Promise.all([
                        db.updateUserPW(
                            req.session.userid,
                            user.firstname,
                            user.lastname,
                            user.email,
                            user.password
                        ),
                        db.updateProfile(
                            req.session.userid,
                            profile.age,
                            profile.url,
                            profile.city
                        )
                    ]);
                })
                .then(results => {
                    const { firstname, lastname, email } = results[0].rows[0];
                    const { age, url, city } = results[1].rows[0];
                    Object.assign(req.session, { firstname, lastname, email });
                    Object.assign(req.session, { age, url, city });
                    res.redirect("/petition");
                })
                .catch(err => {
                    console.log(err);
                    res.render("update", {
                        layout: "main",
                        userInfo: req.session,
                        error: err
                    });
                });
        }
    });
