const express = require("express");

const app = express();
const listRoutes = require("./routes/lists");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/lists", listRoutes);

app.get("/", (req, res) => {
  res.redirect("/lists/Today"); // or any default list you want
});

module.exports = app;
