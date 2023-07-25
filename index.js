const express = require("express");
const app = express();
require("express-async-errors");
const contactRoutes = require("./controllers/contact.controller");

app.use(express.json());
app.use("/", contactRoutes);
// Global error handling
app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send(JSON.stringify(err) || "Internal server error! ");
});

app.listen(3000, () => {
  console.log(`Application is running...`);
});
