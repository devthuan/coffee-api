const express = require("express");
const UserController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const route = express.Router();

route.post("/login", UserController.Login);
route.post("/refresh-token", UserController.refreshLogin);
route.post("/logout", verifyToken, UserController.Logout);

module.exports = route;
