const express = require("express");
const CartController = require("../controllers/cart.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const route = express.Router();

route.get("/", verifyToken, CartController.GetCart);

route.post("/", verifyToken, CartController.AddCart);

route.delete("/:cart_id", verifyToken, CartController.DeleteCart);

route.patch("/:cart_id", verifyToken, CartController.UpdateCart);

module.exports = route;
