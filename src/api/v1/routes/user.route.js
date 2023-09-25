const express = require("express");
const UserController = require("../controllers/user.controller");
const {
  verifyToken,
  projectRouteAdmin,
} = require("../middlewares/auth.middleware");
const route = express.Router();

route.post("/register", UserController.Register);
route.get("/user", projectRouteAdmin, UserController.GetUsers);
route.patch("/user/:id", projectRouteAdmin, UserController.DeleteUsers);
route.get("/search", projectRouteAdmin, UserController.SearchUser);

module.exports = route;
