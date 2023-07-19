const express = require("express");
const app = express();
const connection = require("./database");


app.get("/", (req, res) => {
  connection
    .query("SELECT * from Contact")
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

  res.send("Wassup in browser");
});

app.listen(3000, () => {
  console.log(`Application is running on: localhost:3000`);
});
