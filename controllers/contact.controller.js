const express = require("express");
const contactRoutes = express.Router();
const contactService = require("../service/contact.service");

contactRoutes.get("/", async (req, res) => {
  res.json({status: 200,message: "success",envStatus: process.env.ENV || "Fail"});
});

contactRoutes.get("/contacts", async (req, res) => {
  const contacts = await contactService.getAllContacts();
  res.send(contacts);
});

contactRoutes.get("/contacts/:id", async (req, res) => {
  const contact = await contactService.getContactById(req.params.id);
  res.send(contact);
});

contactRoutes.post("/identify", async (req, res) => {
  const contact = await contactService.addContact(req.body);
  res.send(contact);
});

module.exports = contactRoutes;
