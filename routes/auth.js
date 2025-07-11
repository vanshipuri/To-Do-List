const express = require("express");
const router = express.Router();
const Repository = require("../db");
const bcrypt = require("bcrypt");

const repository = new Repository();

//dummy user
//const USER = {username: "admin", password:"1234"};

//login page
router.get("/login", async (req, res) => {
  res.render("login", { error: null });
});

//handle login POST & create user if not exists
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await repository.findUser(username);
    // create new if not found
    if (!user) {
      user = await repository.createUser(username, password);
    } else {
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.render("login", { error: "Invalid password" });
      }
    }

    //save user in session
    req.session.loggedIn = true;
    req.session.user = { id: user.id, username: user.username };
    res.redirect("/lists/My List");
  } catch (err) {
    console.log("Login Error", err);
    res.render("login", { error: "Something went wrong" });
  }
});

// 🔓 Logout
router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
