const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const helper = require("../helpers/helper");
const users = require("../data/users.json");

require("dotenv").config();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const id = { id: helper.getNewId(users) };
  try {
    const user = helper.userExists(username);
    if (user) {
      console.log("user already exists");
      return res.redirect("signup");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { ...id, username, password: hashedPassword };

    users.push(newUser);
    helper.writeJSONFile(process.env.USERS_PATH, users);
    res.redirect("signin");
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "signin",
    successRedirect: "profile",
  })
);

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/signin", (req, res, next) => {
  res.render("signin");
});

router.get("/profile", (req, res) => {
  const user = req.user || "Guest";
  console.log(`user: ${req.user}`);
  res.render("profile", { user });
});
module.exports = router;
