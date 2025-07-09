class RepositoryBase {
  async getLists() {}
  async findList(listId) {}
  async createList(text) {}
  async updateList(list) {}
  async deleteList(listId) {}

  async getListTasks(listId) {}
  async findTask(taskId) {}
  async createTask(list, text) {}
  async updateTask(task) {}
  async deleteTask(taskId) {}
}

module.exports = RepositoryBase;
