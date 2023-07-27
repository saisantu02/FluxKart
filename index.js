const express = require("express");
const app = express();
require("express-async-errors");
require("dotenv").config();
const contactRoutes = require("./controllers/contact.controller");
const port = process.env.PORT || 3000

app.use(express.json());
app.use("/", contactRoutes);
// Global error handling
app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send(JSON.stringify(err) || "Internal server error! ");
});

app.listen(port, () => {
  console.log(`Application is running...`);
});
