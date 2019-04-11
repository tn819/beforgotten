app.get("/login", (req, res) => {
    console.log("GET login route");
    res.render("login", { layout: "main" });
});

app.post("/login", (req, res) => {
    console.log("POST login route");

    db.getUser(req.body.email)
        .then(result => {
            const { userid, email, firstname, lastname } = result.rows[0];
            Object.apply(req.session, { userid, email, firstname, lastname });
            return db.checkPassword(req.body.password, result.rows[0].password);
        })
        .then(result => {
            console.log("password check result", result);
            return db.existProfile(req.session.userid);
        })
        .then(exists => {
            console.log("profile exists", exists);
            return db.getProfile(req.session.userid);
        })
        .then(result => {
            console.log("profile result after login", result);
            if (!req.session.profileid) {
                res.redirect("/profile");
            }
            req.session.profileid = result.rows[0].profileid;
            res.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
            res.render("login", { layout: "main", error: err });
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
