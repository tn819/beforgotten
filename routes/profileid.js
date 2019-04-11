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
