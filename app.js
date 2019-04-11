const express = require("express");
const hb = require("express-handlebars");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const csurf = require("csurf");
const moment = require("moment");
const favicon = require("express-favicon");

var bodyParser = require("body-parser");

dotenv.config();

//rendering
app.engine("handlebars", hb({ defaultLayout: "landing" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//directory work
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "utils")));
app.use(express.static(path.join(__dirname, "db")));

const db = require("./utils/db");
const register = require("./utils/register");

//cookie set up
const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        maxAge: 1000 * 60 * 60 * 24 * 14,
        secret: process.env.secret
    })
);

//headers and cookies middleware
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(csurf());
app.use((req, res, next) => {
    res.set("x-frame-options", "DENY");
    res.locals.csrfToken = req.csrfToken();
    next();
});

//route - noAuth
app.get("/login", (req, res) => {
    console.log("GET login route");
    res.render("login", { layout: "main" });
});

app.post("/login", (req, res) => {
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
            Object.assign(req.session, { userid, email, firstname, lastname });
            console.log("initial login cookies", req.session);
            return db.checkPassword(req.body.password, result.rows[0].password);
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

app.get("/register", (req, res) => {
    console.log("GET register route");
    res.render("register", { layout: "main" });
});

app.post("/register", (req, res) => {
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

//route - userid
app.get("/profile", (req, res) => {
    res.render("profile", { layout: "main" });
});

app.post("/profile", (req, res) => {
    register
        .checkValidProfile(req.body.age, req.body.url, req.body.city)
        .then(inputs => {
            console.log("profile inputs:", inputs);
            return db.addProfile(
                inputs.age,
                inputs.url,
                inputs.city,
                req.session.userid
            );
        })
        .then(result => {
            console.log(result);
            req.session.profileid = result.rows[0].profileid;
            res.redirect("/petition");
        })
        .catch(err => {
            res.render("profile", { layout: "main", error: err });
        });
});

//route - profileid
app.get("/petition", (req, res) => {
    console.log("GET petition route");
    db.getSigner(req.session.userid)
        .then(results => {
            console.log("signer exists at petition page", results.rows[0]);
            if (results.rows[0]) {
                req.session.sigid = results.rows[0].sigid;
                console.log(req.session);
                res.redirect("/thanks");
            } else {
                return res.render("forms", {
                    firstname: req.session.firstname,
                    lastname: req.session.lastname
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/petition", (req, res) => {
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

app.get("/thanks", (req, res) => {
    db.getSigners()
        .then(signerList => {
            let { signature } = signerList.rows.filter(
                signer => signer.userid === req.session.userid
            )[0];
            res.render("thanks", {
                layout: "main",
                signatureURL: signature,
                signersList: signerList.rowCount
            });
        })
        .catch(err => console.log(err));
});

app.get("/update", (req, res) => {
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
            res.render("update", {
                layout: "main",
                userInfo: {},
                error: err
            });
        });
});

app.post("/update", (req, res) => {
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

//route - sigid or user id
app.get("/delete", (req, res) => {
    res.render("delete", { layout: "main" });
});

app.post("/delete", (req, res) => {
    if (req.body.delete === "signaturedelete") {
        db.deleteSigner(req.session.userid)
            .then(result => {
                req.session.sigid = null;
                req.session.signature = null;
                res.redirect("/");
            })
            .catch(err => {
                res.render("delete", { layout: "main", error: err });
            });
    } else if (req.body.delete === "profiledelete") {
        db.deleteUser(req.session.userid)
            .then(result => {
                req.session = null;
                res.redirect("/");
            })
            .catch(err => {
                res.render("delete", { layout: "main", error: err });
            });
    }
});

//route - sigid
app.get("/signatures", (req, res) => {
    db.getFullSigners()
        .then(results => {
            let signers = [];
            results.rows.map(result =>
                signers.push({
                    sigtime: moment(result.sigtime).format(
                        "dddd, MMMM Do YYYY"
                    ),
                    url: result.url,
                    age: result.age,
                    city: result.city,
                    firstname: result.firstname,
                    lastname: result.lastname
                })
            );
            res.render("signatures", {
                layout: "main",
                signers: signers,
                city: "city",
                header: req.session.firstname
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/signatures/:city", (req, res) => {
    db.getFullSigners()
        .then(results => {
            let signers = [];
            results.rows.forEach(result => {
                if (result.city === req.params.city) {
                    signers.push({
                        sigtime: moment(result.sigtime).format(
                            "dddd, MMMM Do YYYY"
                        ),
                        url: result.url,
                        age: result.age,
                        firstname: result.firstname,
                        lastname: result.lastname
                    });
                }
            });
            res.render("signatures", {
                layout: "main",
                signers: signers,
                header: `in ${req.params.city}`
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/invalid", (req, res) => {
    res.render("invalid", { layout: "main" });
});

app.get("/", (req, res) => {
    if (req.session.signature) {
        res.redirect("/thanks");
    } else if (req.session.profileid) {
        res.redirect("/petition");
    } else if (req.session.userid) {
        res.redirect("/profile");
    } else {
        res.redirect("/login");
    }
});

app.listen(process.env.PORT || 8080, () => console.log("listening.."));
