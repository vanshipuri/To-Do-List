const express = require("express");

module.exports = (repository) => {
  const router = express.Router();

  // 🟢 GET: Render custom list
  router.get("/:listId", async (req, res) => {
    const userId = req.session.user.id;

    let list = await repository.findList(req.params.listId, userId);

    if (!list) {
      const lists = await repository.getLists(userId);
      list = lists[0]; //safely access first list
    }

    if (!list) {
      list = await repository.createList("My List", userId);
    }

    const tasks = await repository.getListTasks(list.id, userId);
    const allLists = await repository.getLists(userId);

    res.render("index", {
      selectedList: list,
      tasks: tasks,
      allLists: allLists,
    });
  });

  // 🟢 POST: Add a new task to a list
  router.post("/add/:listId", async (req, res) => {
    const userId = req.session.user.id;
    const list = await repository.findList(req.params.listId, userId);

    if (list && req.body.todo) {
      await repository.createTask(list, req.body.todo, userId);
    }

    res.redirect(`/lists/${req.params.listId}`);
  });

  // ✅ Create New List
  router.post("/create", async (req, res) => {
    const userId = req.session.user.id;
    const newListName = req.body.newList.trim();

    if (newListName.length > 0) {
      const formatted =
        newListName.charAt(0).toUpperCase() + newListName.slice(1);
      const newList = await repository.createList(formatted, userId);
      res.redirect(`/lists/${newList.id}`);
    } else {
      res.redirect("/"); // fallback
    }
  });

  // 🗑️ Delete list + its tasks
  router.post("/delete-list/:listId", async (req, res) => {
    const userId = req.session.user.id;
    await repository.deleteList(req.params.listId, userId);
    res.redirect("/lists/Today");
  });

  // ✏️ Rename a list
  router.post("/rename/:listId", async (req, res) => {
    const userId = req.session.user.id;
    const list = await repository.findList(req.params.listId, userId);

    if (list && req.body.newName.trim() !== "") {
      list.name = req.body.newName.trim();
      await repository.updateList(list, userId);
    }

    res.redirect(`/lists/${req.params.listId}`);
  });

  // ✅ Mark task as completed
  router.post("/complete/:listId", async (req, res) => {
    const userId = req.session.user.id;
    const taskId = req.body.taskId;
    const task = await repository.findTask(taskId, userId);

    if (task) {
      task.completed = true;
      await repository.updateTask(task);
    }

    res.redirect(`/lists/${req.params.listId}`);
  });

  // ✅ Mark task as incomplete
  router.post("/incomplete/:listId", async (req, res) => {
    const userId = req.session.user.id;
    const taskId = req.body.taskId;
    const task = await repository.findTask(taskId, userId);

    if (task) {
      task.completed = false;
      await repository.updateTask(task);
    }

    res.redirect(`/lists/${req.params.listId}`);
  });

  // ✏️ Edit task
router.post("/edit-task/:taskId", async (req, res) => {
  const task = await repository.findTask(req.params.taskId);

  if (task && req.body.newTaskText.trim() !== "") {
    task.text = req.body.newTaskText.trim();
    await repository.updateTask(task);
    // Redirect back to the list that task belongs to
    return res.redirect(`/lists/${task.listId}`);
  } else if (task) {
    // If no new text provided, just redirect to the list
    return res.redirect(`/lists/${task.listId}`);
  } else {
    // If task not found, redirect to the default list
    return res.redirect("/lists/Today");
  }
});

  // 🗑️ Delete task
  router.post("/delete/:listId", async (req, res) => {
    const userId = req.session.user.id;
    const taskId = req.body.taskId;
    await repository.deleteTask(taskId, userId);

    res.redirect(`/lists/${req.params.listId}`);
  });

  return router;
};
