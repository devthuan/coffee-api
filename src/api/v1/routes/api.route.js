const express = require("express");
const apiController = require("../controllers/api.controller");

const route = express.Router();

route.get("/users", apiController.HomePages);

module.exports = route;
