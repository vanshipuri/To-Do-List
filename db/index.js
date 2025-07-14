require("dotenv").config();
const SqliteRepository = require("./sqlite");
const FileRepository = require("./file");
const InMemoryRepository = require("./inmemory");

function getRepository() {
  if (process.env.DB_REPOSITORY === "sqlite") {
    console.log("🟢 Using SQLite Repository");
    return new SqliteRepository();
  } else if (process.env.DB_REPOSITORY === "file") {
    console.log("🟡 Using File Repository");
    return new FileRepository();
  } else if (
    process.env.DB_REPOSITORY === "memory" ||
    !process.env.DB_REPOSITORY
  ) {
    console.log("🔵 Using In-Memory Repository");
    return new InMemoryRepository();
  } else {
    throw new Error("Unknown DB_REPOSITORY type: " + process.env.DB_REPOSITORY);
  }
}

module.exports = getRepository;
