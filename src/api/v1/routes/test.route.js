const express = require("express");
const ApiController = require("../controllers/api.controller");
const {
  verifyToken,
  projectRouteAdmin,
} = require("../middlewares/auth.middleware");

const { cacheMiddleware } = require("../middlewares/cache.middleware");

const route = express.Router();

// route.post("/register", ApiController.Register);
route.get("/redis", cacheMiddleware, ApiController.GetRedis);

module.exports = route;
