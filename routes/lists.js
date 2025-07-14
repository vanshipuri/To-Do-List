const express = require("express");
//const router = express.Router();
//const Repository = require("../db");
module.exports = (repository) => {
  const router = express.Router();
  //const repository = new Repository();

  // 🟢 GET: Render custom list
  router.get("/:listId", async (req, res) => {
    let list = await repository.findList(req.params.listId);
    if (!list) {
      list = (await repository.getLists())[0];
    }
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
  router.post("/add/:listId", async (req, res) => {
    const list = await repository.findList(req.params.listId);
    console.log(list, req.params.listId, req.body);
    if (list && req.body.todo) {
      await repository.createTask(list, req.body.todo);
      console.log(repository);
    }

    res.redirect(`/lists/${req.params.listId}`);
  });

  // ✅ 2. Create New List Route (🚨 should NOT be inside another route)
  router.post("/create", async (req, res) => {
    const newListName = req.body.newList.trim();

    if (newListName.length > 0) {
      const formatted =
        newListName.charAt(0).toUpperCase() + newListName.slice(1);
      const newList = await repository.createList(formatted);
      res.redirect(`/lists/${newList.id}`);
    } else {
      res.redirect("/"); // fallback
    }
  });

  // Delete list + its tasks
  router.post("/delete-list/:listId", async (req, res) => {
    await repository.deleteList(req.params.listId);
    res.redirect("/lists/Today");
  });

  //  Rename a list
  router.post("/rename/:listId", async (req, res) => {
    const list = await repository.findList(req.params.listId);
    if (list && req.body.newName.trim() !== "") {
      list.name = req.body.newName.trim();
      await repository.updateList(list);
    }
    res.redirect(`/lists/${req.params.listId}`);
  });

  // ✅ POST: Mark task as completed
  router.post("/complete/:listId", async (req, res) => {
    const taskId = req.body.taskId;
    const task = await repository.findTask(taskId);
    if (task) {
      task.completed = true;
      await repository.updateTask(task);
    }
    res.redirect(`/lists/${req.params.listId}`);
  });

  // ✅ POST: Mark task as incompleted
  router.post("/incomplete/:listId", async (req, res) => {
    const taskId = req.body.taskId;
    const task = await repository.findTask(taskId);
    if (task) {
      task.completed = false;
      await repository.updateTask(task);
    }

    res.redirect(`/lists/${req.params.listId}`);
  });

  // ✏️ Rename / Edit a task
  router.post("/edit-task/:taskId", async (req, res) => {
    const task = await repository.findTask(req.params.taskId);

    if (task && req.body.newTaskText.trim() !== "") {
      task.text = req.body.newTaskText.trim();
      await repository.updateTask(task);
    }

    // Redirect back to the list that task belongs to
    res.redirect(`/lists/${task.listId}`);
  });

  // 🗑️ POST: Delete a task from the list
  router.post("/delete/:listId", async (req, res) => {
    const taskId = req.body.taskId;
    await repository.deleteTask(taskId);

    res.redirect(`/lists/${req.params.listId}`);
  });

  // Unused route — safe to delete or build out later
  router.delete("/:listId", async (req, res) => {
    // Could be used to delete entire list if needed
  });

  return router;
};
