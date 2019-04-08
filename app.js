const express = require("express");
const hb = require("express-handlebars");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const csurf = require("csurf");
const moment = require("moment");

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
app.use(csurf());
app.use((req, res, next) => {
    res.set("x-frame-options", "DENY");
    //res.locals merged to handlebars transmitted template
    res.locals.csrfToken = req.csrfToken();
    //include name of signers, res.locals.signerName
    next();
});

app.get("/login", (req, res) => {
    console.log("GET login route");
    res.render("login", { layout: "main" });
});

app.post("/login", (req, res) => {
    console.log("POST login route");

    db.getUser(req.body.email)
        .then(result => {
            req.session.sigID = result.rows[0].email;
            req.session.firstname = result.rows[0].firstname;
            req.session.lastname = result.rows[0].lastname;
            db.checkPassword(req.body.password, result.rows[0].password);
        })
        .then(result => {
            if (result === true) {
                res.redirect("/petition");
            } else {
                res.send("Incorrect password");
                res.redirect("/");
            }
        })
        .catch(err => res.redirect("/"));
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
            db.addUser(
                inputs.firstname,
                inputs.lastname,
                inputs.email,
                inputs.password
            );
        })
        .then(result => {
            req.session.sessionID = result.rows[0].email;
            req.session.firstname = result.rows[0].firstname;
            req.session.lastname = result.rows[0].lastname;
            res.redirect("/login");
        })
        .catch(err => {
            console.log(err);
        });
});

//initial GET from site - load home page
app.get("/petition", (req, res) => {
    console.log("GET petition route");
    res.render("forms");
});

// first name/last name/ hidden input: canvas element
app.post("/petition", (req, res) => {
    db.addSigner(req.body.firstname, req.body.lastname, req.body.signatureURL)
        .then(queryResult => {
            req.session.signed = req.body.signatureURL;
            res.redirect("/thanks");
        })
        .catch(err => {
            res.redirect("/invalid");
        });
});

//if req.session.sigID exists
app.get("/thanks", (req, res) => {
    db.listSigners()
        .then(signerList => {
            let { signature } = signerList.rows.filter(
                signee => signee.email == req.session.sessionID
            )[0];
            res.render("thanks", {
                layout: "main",
                signatureURL: signature,
                signersList: signerList.rowCount
            });
        })
        .catch(err => console.log(err));
});

app.get("/signatures", (req, res) => {
    db.listFullSigners()
        .then(results => {
            let signers = [];
            results.rows.map(result =>
                signers.push({
                    sigtime: moment(result.sigtime).format(
                        "dddd, MMMM Do YYYY"
                    ),
                    firstname: result.firstname,
                    lastname: result.lastname
                })
            );
            res.render("signatures", { layout: "main", signers: signers });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/invalid", (req, res) => {
    res.render("invalid", { layout: "main" });
});

app.get("/", (req, res) => {
    if (req.session.signed) {
        res.redirect("/thanks");
    } else if (req.session.email) {
        res.redirect("/petition");
    } else {
        res.redirect("/login");
    }
});

app.listen(8080, () => console.log("listening.."));
