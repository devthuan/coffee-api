const express = require("express");
const apiController = require("../controllers/api.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const route = express.Router();

route.post("/login", apiController.Login);
route.post("/refresh-token", apiController.refreshLogin);
route.post("/logout", verifyToken, apiController.Logout);

module.exports = route;
