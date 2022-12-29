const express = require("express");
const passport = require("passport");
const session = require("express-session");
const engine = require("ejs-mate");
const morgan = require("morgan");
const path = require("path");

const app = express();
require("./config/passport");

//settings
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.set("view engine", "ejs");

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "FallEnDev",
    cookie: { maxAge: 36800000 },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(require("./routes/index.routes"));

app.get("/", (req, res) => {
  res.redirect('users/signin')
});
app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT} `);
});
