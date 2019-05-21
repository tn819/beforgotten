const express = require("express");
const router = (module.exports = express.Router());
const db = require("../utils/db");
const register = require("../utils/register");
const moment = require("moment");

router
    .route("/delete")
    .get((req, res) => {
        res.render("delete", { layout: "main" });
    })
    .post((req, res) => {
        if (req.body.delete === "signaturedelete") {
            db.deleteSigner(req.session.userid)
                .then(result => {
                    req.session.sigid = null;
                    req.session.signature = null;
                    req.session.sigtime = null;
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

router.route("/thanks").get((req, res) => {
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
        .catch(err => res.redirect("/petition"));
});

router.route("/signatures").get((req, res) => {
    db.getFullSigners()
        .then(results => {
            let signers = [];
            results.rows.map(result =>
                signers.push({
                    sigtime: moment(result.sigtime).format("MMMM Do YYYY"),
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
            console.log(res.redirect("/petition"));
        });
});

router.route("/signatures/:city").get((req, res) => {
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
            res.redirect("/signatures");
        });
});
