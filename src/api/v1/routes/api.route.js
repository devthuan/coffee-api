const express = require("express");
const apiController = require("../controllers/api.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const route = express.Router();

// route.get("/users", verifyToken, apiController.HomePages);
route.post("/register", apiController.Register);
route.get("/product", apiController.Products);
route.get("/user", apiController.GetUsers);
// route.delete("/user/:id", apiController.DeleteUsers);

route.get("/cart", verifyToken, apiController.GetCart);
route.post("/cart", verifyToken, apiController.AddCart);
route.delete("/cart/:cart_id", apiController.DeleteCart);
route.patch("/cart/:cart_id", apiController.UpdateCart);

module.exports = route;
