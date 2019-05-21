const express = require("express");
const router = (module.exports = express.Router());
const auth = require("../config/auth");

router.use("/", require("./noauth"));
router.use("/", auth.userAuth, require("./user"));
router.use("/", [auth.userAuth, auth.profileAuth], require("./profile"));
router.use(
    "/",
    [auth.userAuth, auth.profileAuth, auth.sigAuth],
    require("./sig")
);

router.get("/invalid", (req, res) => {
    res.render("invalid", { layout: "main", error: err || null });
});
router.get("/", (req, res) => {
    if (req.session.sigid) {
        res.redirect("/thanks");
    } else if (req.session.profileid) {
        res.redirect("/petition");
    } else if (req.session.userid) {
        res.redirect("/profile");
    } else {
        res.redirect("/login");
    }
});
