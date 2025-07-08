const express = require("express");
const router = express.Router();

//dummy user
const USER = {username: "admin", password:"1234"};

//login page 
router.get("/login",(req, res) => {
    res.render("login", {error: null });
});

//handle login POST
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.loggedIn = true;
    req.session.user = username;
    res.redirect("/lists/Work");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

// 🔓 Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});


router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.user = username; // ✅ Correct
    res.redirect("/lists/Today");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

module.exports = router;
