const sqlConnection = require("../database");

module.exports.getAllContacts = async () => {
  const [data] = await sqlConnection.query("SELECT * from Contact");
  return data;
};
