const fs = require("fs");
const path = require("path");
const RepositoryBase = require("./base");
const List = require("./list");
const Task = require("./task");

class FileRepository extends RepositoryBase {
  /**
   * @var List[]
   */
  lists = [];
  /**
   * @var Task[]
   */
  tasks = [];

  listSequence = 0;
  taskSequence = 0;

  constructor() {
    super();
    this.dataFile = path.join(__dirname, "../data.json");
    this.#loadFromFile();
  }
  #loadFromFile() {
    if (fs.existsSync(this.dataFile)) {
      const rawData = fs.readFileSync(this.dataFile);
      const data = JSON.parse(rawData);

      this.lists = data.lists.map((l) => {
        const list = new List(l.name);
        list.id = l.id;
        return list;
      });
      this.tasks = data.tasks.map((t) => {
        const task = new Task(t.listId, t.text, t.completed);
        task.id = t.id;
        return task;
      });
      this.listSequence = data.listSequence || 0;
      this.taskSequence = data.taskSequence || 0;
    }
  }

  #saveToFile() {
    const data = {
      lists: this.lists,
      tasks: this.tasks,
      listSequence: this.listSequence,
      taskSequence: this.taskSequence,
    };

    fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
  }

  async getLists() {
    return this.lists;
  }
  async findList(listId) {
    return this.lists.find((list) => list.id === listId);
  }
  async createList(text) {
    const list = new List(text);
    list.id = (++this.listSequence).toString();
    this.lists.push(list);
    this.#saveToFile();
    return list;
  }
  async updateList(updatedList) {
    const index = this.lists.findIndex((list) => list.id == updatedList.id);
    if (index !== -1) {
      this.lists[index] = updatedList;
      this.#saveToFile();
    }
  }
  async deleteList(listId) {
    //this.lists = this.lists.filter((task) => task.listId == listId);
    //list.id = this.listSequence--;
    //this.#saveToFile();
  }

  async getListTasks(listId) {
    return this.tasks.filter((task) => task.listId == listId);
  }
  async findTask(taskId) {
    return this.tasks.find((task) => task.id == taskId);
  }
  async createTask(list, text) {
    const task = new Task(list.id, text);
    task.id = (++this.taskSequence).toString();
    this.tasks.push(task);
    this.#saveToFile();
    return task;
  }
  async updateTask(task) {
    const index = this.tasks.findIndex((task) => task.id == updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.#saveToFile();
    }
  }
  async deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id != taskId);
    this.#saveToFile();
  }
}

module.exports = FileRepository;
