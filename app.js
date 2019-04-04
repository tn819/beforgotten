const express = require("express");
const hb = require("express-handlebars");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const atob = require("atob");
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
app.use(express.static(path.join(__dirname, "scripts")));

//cookie set up
const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        maxAge: 1000 * 60 * 60 * 24 * 14,
        secret: process.env.secret
    })
);
//request.session.sigID can be put into cookie

const db = require("./scripts/db");
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(csurf());
app.use((req, res, next) => {
    res.set("x-frame-options", "DENY");
    //res.locals merged to handlebars transmitted template
    res.locals.csrfToken = req.csrfToken();
    //include name of signers, res.locals.signerName
    next();
});

//initial GET from site - load home page
// /petition route greeting users
app.get("/petition", (req, res) => {
    console.log("GET petition route");
    res.render("forms");
});

// first name/last name/ hidden input: canvas element
//toDataUrl response of hidden input
app.post("/petition", (req, res) => {
    console.log("POST petition route with:");
    db.addSigner(req.body.firstname, req.body.lastname, req.body.signatureURL)
        .then(queryResult => {
            console.log("signature logged", queryResult);
            req.session.sigID = queryResult.rows[0].id;
            res.redirect("/thanks");
        })
        .catch(err => {
            console.log(err);
            res.redirect("/invalid");
        });
});

//if req.session.sigID exists
app.get("/thanks", (req, res) => {
    db.listSigners()
        .then(signerList => {
            let { signature } = signerList.rows.filter(
                signee => signee.id == req.session.sigID
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
    db.listSigners()
        .then(results => {
            console.log(results.rows[0].sigtime);
            let signers = [];
            results.rows.map(result =>
                signers.push({
                    sigTime: moment(result.sigtime).format(
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
    if (req.session.sigID) {
        res.redirect("/thanks");
    }
    res.redirect("/petition");
});

app.listen(8080, () => console.log("listening.."));
