const express = require("express");
const routes = express.Router();
const contactService = require("../service/contact.service");

routes.get("/contacts", async (req, res) => {
  const data = await contactService.getAllContacts();
  res.send(data);
});

module.exports = routes;
