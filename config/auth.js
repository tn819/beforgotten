const express = require("express");

module.exports.userAuth = (req, res, next) => {
    if (req.session.userid) {
        return next();
    }
    res.redirect("/login");
};

module.exports.profileAuth = (req, res, next) => {
    if (req.session.profileid) {
        return next();
    }
    res.redirect("/profile");
};

module.exports.sigAuth = (req, res, next) => {
    if (req.session.sigid) {
        return next();
    }
    res.redirect("/petition");
};
