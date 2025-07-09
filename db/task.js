class Task {
  id = 0;
  text = "";
  listId = undefined;
  completed = false;

  constructor(id = 0, text = "", completed = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }
}

module.exports = Task;
