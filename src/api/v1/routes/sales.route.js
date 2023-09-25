const express = require("express");
const SalesController = require("../controllers/sales.controller");
const {
  verifyToken,
  projectRouteAdmin,
} = require("../middlewares/auth.middleware");
const route = express.Router();

route.post("/total-sales", projectRouteAdmin, SalesController.AddTotalSales);

module.exports = route;
