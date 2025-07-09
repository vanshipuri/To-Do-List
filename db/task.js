class Task {
  id = 0;
  text = "";
  listId = undefined;
  completed = false;

  constructor(listId = 0, text = "", completed = false) {
    this.listId = listId;
    this.text = text;
    this.completed = completed;
  }
}

module.exports = Task;
