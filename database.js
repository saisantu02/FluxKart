const sql = require("mysql2/promise");
const connection = sql.createPool({
  host: "localhost",
  user: "root",
  password: "MIG20@home",
  database: "fluxkart",
});

module.exports = connection;
