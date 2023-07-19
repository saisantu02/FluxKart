const express = require("express");
const app = express();
require("express-async-errors");
const routes = require("./controllers/contact.controller");

app.use("/api", routes);
// Global error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send("Internal server error! ");
});

app.listen(3000, () => {
  console.log(`Application is running...`);
});
