const express = require("express");
const session = require("express-session");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// ✅ Session middleware
app.use(
  session({
    secret: "mysecretkey123",
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ ⬅️ FIX: Move this here
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// ✅ Auth guard
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// ✅ Routes
const authRoutes = require("./routes/auth");
const listRoutes = require("./routes/lists");

app.use("/", authRoutes);
app.use("/lists", isAuthenticated, listRoutes);

// ✅ Default redirect
app.get("/", (req, res) => {
  res.redirect("/lists/Today");
});

module.exports = app;

