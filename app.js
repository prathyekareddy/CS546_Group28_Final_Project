const express = require("express");
const app = express();
const session = require("express-session");
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  partialsDir: ['views/partials/']
});

app.use("/public", static);
app.use(express.json());

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/navigation/*", (req, res, next) => {
  if (!req.session.user) {
    // alert("User needs to login first.")
    return res.redirect("/login");
  } else {
    next();
  }
});

app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebarsInstance.engine);
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
