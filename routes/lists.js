const express = require("express");
const router = express.Router();

// ⬅️ Initialize your lists with object-based tasks
let lists = { Default: [] };

// 🟢 GET: Render custom list
router.get("/:customlistName", (req, res) => {
  const listName = req.params.customlistName;

  if (!lists[listName]) lists[listName] = [];

  res.render("index", {
    listTitle: listName,
    todos: lists[listName],
    allLists: Object.keys(lists)
  });
});

// 🟢 POST: Add a new task to a list
router.post("/add/:customlistName", (req, res) => {
  const listName = req.params.customlistName;
  const newTaskText = req.body.todo;

  if (!lists[listName]) lists[listName] = [];
  // ✅ Save task as object with completion flag
  const taskObject = { name: newTaskText, completed: false };
  lists[listName].push(taskObject);

  res.redirect(`/lists/${listName}`);
});


// ✅ 2. Create New List Route (🚨 should NOT be inside another route)
router.post("/create", (req, res) => {
  const newListName = req.body.newList.trim();

  if (newListName.length > 0) {
    const formatted = newListName.charAt(0).toUpperCase() + newListName.slice(1);
    if (!lists[formatted]) {
      lists[formatted] = [];
    }
    res.redirect(`/lists/${formatted}`);
  } else {
    res.redirect("/"); // fallback
  }
});


// ✅ POST: Mark task as completed
router.post("/complete/:customlistName", (req, res) => {
  const listName = req.params.customlistName;
  const taskIndex = parseInt(req.body.taskIndex);

  if (lists[listName] && lists[listName][taskIndex]) {
    lists[listName][taskIndex].completed = true;
  }

  res.redirect(`/lists/${listName}`);
});

// ✅ POST: Mark task as incompleted
router.post("/incomplete/:customlistName", (req, res) => {
  const listName = req.params.customlistName;
  const taskIndex = req.body.taskIndex;

  if (lists[listName] && lists[listName][taskIndex]) {
    lists[listName][taskIndex].completed = false;
  }

  res.redirect(`/lists/${listName}`);
});


// 🗑️ POST: Delete a task from the list
router.post("/delete/:customlistName", (req, res) => {
  const listName = req.params.customlistName;
  const indexToDelete = parseInt(req.body.taskIndex);

  if (lists[listName] && indexToDelete >= 0) {
    lists[listName].splice(indexToDelete, 1);
  }

  res.redirect(`/lists/${listName}`);
});

// Unused route — safe to delete or build out later
router.delete("/:customlistName", (req, res) => {
  // Could be used to delete entire list if needed
});

module.exports = router;


