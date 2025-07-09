const RepositoryBase = require("./base");
const List = require("./list");
const Task = require("./task");

class InMemoryRepository extends RepositoryBase {
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

  async getLists() {
    return [...this.lists];
  }
  async findList(listId) {
    return this.lists.find((list) => list.id == listId);
  }
  async createList(text) {
    const list = new List(text);
    list.id = this.listSequence++;
    this.lists.push(list);
    return list;
  }
  async updateList(updatedList) {
    const index = this.lists.findIndex((list) => list.id == updatedList.id);
    if (index !== -1) {
      this.lists[index] = updatedList;
    }
  }
  async deleteList(listId) {
    //this.lists = this.lists.filter((task) => task.listId == listId);
    //list.id = this.listSequence--;
  }

  async getListTasks(listId) {
    return this.tasks.filter((task) => task.listId == listId);
  }
  async findTask(taskId) {
    return this.tasks.find((task) => task.id == taskId);
  }
  async createTask(list, text) {
    const task = new Task(list.id, text);
    task.id = this.taskSequence++;
    this.tasks.push(task);
    return task;
  }
  async updateTask(updatedTask) {
    const index = this.tasks.findIndex((task) => task.id == updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
    }
  }
  async deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id != taskId);
  }
}

module.exports = InMemoryRepository;
