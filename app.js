const express = require("express");
const app = express();
const path = require("path");

//rendering
const hb = require("express-handlebars");
app.engine("handlebars", hb({ defaultLayout: "landing" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "./views"));

//config + routes
app.use(require("./config/config"));
app.use("/", require("./routes/index"));

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () => console.log("listening.."));
}
