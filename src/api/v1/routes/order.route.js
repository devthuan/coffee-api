const express = require("express");
const OrderController = require("../controllers/order.controller");
const {
  verifyToken,
  projectRouteAdmin,
} = require("../middlewares/auth.middleware");
const route = express.Router();

route.get("/order", verifyToken, OrderController.GetOrderByUser);
route.get("/order-all", projectRouteAdmin, OrderController.GetOrderAll);

route.patch(
  "/status-order",
  projectRouteAdmin,
  OrderController.UpdateStatusOrder
);

module.exports = route;
