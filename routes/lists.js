const express = require("express");
const router = express.Router();
let lists = { default: [] };

router.get("/:customlistName", (req, res) => {
  const listName = req.params.customlistName;

  if (!lists[listName]) lists[listName] = [];
  res.render("index", { listTitle: listName , todos: lists[listName] });
});

router.post("/add/:customlistName", (req, res) => {
  const listName = req.params.customlistName;
  const newTask = req.body.todo;

  if (!lists[listName]) {
    lists[listName] = [];
  }
  lists[listName].push(newTask);

  // ✅ FIXED redirect
  res.redirect(`/lists/${listName}`);
});

router.delete("/:customlistName", (req, res) => {
  // handle deletion
});

module.exports = router;

