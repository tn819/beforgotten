const express = require("express");
const hb = require("express-handlebars");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
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

//initial GET from site - load home page
// /petition route greeting users
app.get("/petition", (req, res) => {
    console.log("GET petition route");
    res.render("forms");
});

// first name/last name/ hidden input: canvas element
//toDataUrl response of hidden input
app.post("/petition", (req, res) => {
    console.log(
        "POST petition route with:",
        req.params.firstname,
        req.params.lastname,
        req.params.signatureURL
    );
    db.addSigner(req.firstname, req.lastname, req.signatureURL)
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
    var signerCount = db.countSigners();
    var sigPic = db.pullSigner(req.session.sigID);
    res.render("thanks", {
        layout: "main",
        signatureURL: sigPic,
        signersList: signerCount
    });
});

app.get("/signatures", (req, res) => {
    db.listSigners()
        .then(signers => {
            res.render("signatures", { layout: "main" });
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

//create table for signatures > first name, last name, signature

// GET /petition
// POST /petition > push to db, redirect to thank you after setting cookie, render error;
// GET /thanks > render thanks template
// GET /signers > renders signers template

//Templates: petition, thank you page, signers, layout, partials
