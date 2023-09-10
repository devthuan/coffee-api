const express = require("express");
const apiController = require("../controllers/api.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const route = express.Router();

route.get("/users", verifyToken, apiController.HomePages);
route.post("/register", apiController.Register);

module.exports = route;
