const express = require("express");
const router = express.Router();
const Repository = require("../db");

const repository = new Repository();

// 🟢 GET: Render custom list
router.get("/:listId", async (req, res) => {
  let list = await repository.findList(req.params.listId);
  if (!list) {
    list = await repository.createList("My List");
  }

  const tasks = await repository.getListTasks(list.id);

  const allLists = await repository.getLists();

  res.render("index", {
    selectedList: list,
    tasks: tasks,
    allLists: allLists,
  });
});

// 🟢 POST: Add a new task to a list
router.post("/add/:listId", (req, res) => {
  const list = repository.findList(req.params.listId);
  if (list && req.body.todo) {
    repository.createTask(list, req.body.todo);
  }

  res.redirect(`/lists/${req.params.listId}`);
});

// ✅ 2. Create New List Route (🚨 should NOT be inside another route)
router.post("/create", (req, res) => {
  const newListName = req.body.newList.trim();

  if (newListName.length > 0) {
    const formatted =
      newListName.charAt(0).toUpperCase() + newListName.slice(1);
    const newList = repository.createList(formatted);
    res.redirect(`/lists/${newList.id}`);
  } else {
    res.redirect("/"); // fallback
  }
});

// ✅ POST: Mark task as completed
router.post("/complete/:listId", (req, res) => {
  const taskId = req.body.taskId;
  const task = repository.findTask(taskId);
  if (task) {
    task.completed = true;
    repository.updateTask(task);
  }
  res.redirect(`/lists/${req.params.listId}`);
});

// ✅ POST: Mark task as incompleted
router.post("/incomplete/:listId", (req, res) => {
  const taskId = req.body.taskId;
  const task = repository.findTask(taskId);
  if (task) {
    task.completed = false;
    repository.updateTask(task);
  }

  res.redirect(`/lists/${req.params.listId}`);
});

// 🗑️ POST: Delete a task from the list
router.post("/delete/:listId", (req, res) => {
  const taskId = req.body.taskId;
  repository.deleteTask(taskId);

  res.redirect(`/lists/${req.params.listId}`);
});

// Unused route — safe to delete or build out later
router.delete("/:listId", (req, res) => {
  // Could be used to delete entire list if needed
});

module.exports = router;
