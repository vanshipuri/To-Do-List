const Database = require("better-sqlite3");
const RepositoryBase = require("./base");
const List = require("./list");
const Task = require("./task");

class SqliteRepository extends RepositoryBase {
  /**
   * @type {import("better-sqlite3").Database}
   */
  db;

  constructor() {
    super(); //call parent constructor
    this.db = new Database("database.db", {});
    this.db.pragma("journal_mode = WAL");

    this.db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listId INTEGER,
        text TEXT,
        completed INTEGER DEFAULT 0
      )
        `);

    this.db.exec(`
        CREATE TABLE IF NOT EXISTS lists(
        id  INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
        )
        `);
  }
  //get all lists
  async getLists() {
    const stmt = this.db.prepare("SELECT * FROM lists");
    const rows = stmt.all();
    return rows.map((row) => {
      console.log(row);
      const list = new List(row.name);
      list.id = row.id;
      return list;
    });
  }
  //find all list
  async findList(listId) {
    const stmt = this.db.prepare("SELECT * FROM lists WHERE id = ?");
    const row = stmt.get(listId);
    if (!row) return null;
    const list = new List(row.name);
    list.id = row.id;
    return list;
  }
  //add new list
  async createList(text) {
    const stmt = this.db.prepare("INSERT INTO lists (name) VALUES (?)");
    const result = stmt.run(text);
    const list = new List(text);
    list.id = result.lastInsertRowid;
    return list;
  }
  //rename list
  async updateList(list) {
    const stmt = this.db.prepare("UPDATE lists SET name = ? WHERE id = ?");
    stmt.run(updatedList.name, updatedList.id);
  }
  //delete list
  async deleteList(listId) {
      this.db.prepare("DELETE FROM tasks WHERE listId = ?").run(listId);
     this.db.prepare("DELETE FROM lists WHERE id = ?").run(listId);
  }
  //get all tasks under a list
  async getListTasks(listId) {
    const stmt = this.db.prepare("SELECT * FROM tasks WHERE listId = ?");
    const rows = stmt.all(listId);
    return rows.map((row) => {
      const task = new Task(row.listId, row.text, !!row.completed);
      task.id = row.id;
      return task;
    });
  }
  //find task
  async findTask(taskId) {
    const stmt = this.db.prepare("SELECT * FROM tasks WHERE id = ?");
    const row = stmt.get(taskId);
    if (!row) return null;
    const task = new Task(row.listId, row.text, !!row.completed);
    task.id = row.id;
    return task;
  }

  //create new task
  async createTask(list, text) {
    const stmt = this.db.prepare(
      "INSERT INTO tasks (listId, text) VALUES (?, ?)"
    );
    const result = stmt.run(list.id, text);
    const task = new Task(list.id, text);
    task.id = result.lastInsertRowid;
    return task;
  }
  //update the task
  async updateTask(task) {
    const stmt = this.db.prepare(
      "UPDATE tasks SET text = ?, completed = ? WHERE id = ?"
    );
    stmt.run(task.text, task.completed ? 1 : 0, task.id);
  }

  //delete task
  async deleteTask(taskId) {
    const stmt = this.db.prepare("DELETE FROM tasks WHERE id = ?");
    stmt.run(taskId);
  }
}

module.exports = SqliteRepository;
