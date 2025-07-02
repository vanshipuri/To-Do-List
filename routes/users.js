var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/:userId", function (req, res) {
  console.log(req.params);
  res.send("Hello user " + req.params.userId);
});

module.exports = router;
