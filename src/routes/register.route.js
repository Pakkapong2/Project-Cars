const express = require('express');
const app = express.Router();
const controller = require('../controllers/register.controller');

// define routes here
app.post("/", controller.create);
app.get("/",controller.get)
app.get("/:id",controller.getById)
app.put("/:id", controller.update);
app.delete("/:id", controller.delete);
module.exports = app;
