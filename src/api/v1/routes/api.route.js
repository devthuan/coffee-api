const express = require("express");
const apiController = require("../controllers/api.controller");
const {
  verifyToken,
  projectRouteAdmin,
} = require("../middlewares/auth.middleware");
const route = express.Router();
const multer = require("multer");

// Khởi tạo Multer và cấu hình thư mục lưu trữ tệp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Thư mục lưu trữ tệp
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Tên tệp sau khi lưu
  },
});

const upload = multer({ storage: storage });

// route.get("/users", verifyToken, apiController.HomePages);
route.post("/register", apiController.Register);
route.get("/user", projectRouteAdmin, apiController.GetUsers);
route.patch("/user/:id", projectRouteAdmin, apiController.DeleteUsers);

route.get("/product", apiController.Products);
route.post(
  "/product",
  upload.single("image_product"),
  projectRouteAdmin,
  apiController.AddProducts
);
route.patch(
  "/product/:product_id",
  projectRouteAdmin,
  apiController.DeleteProducts
);

route.get("/cart", verifyToken, apiController.GetCart);
route.post("/cart", verifyToken, apiController.AddCart);
route.delete("/cart/:cart_id", verifyToken, apiController.DeleteCart);
route.patch("/cart/:cart_id", verifyToken, apiController.UpdateCart);

route.get("/order", verifyToken, apiController.GetOrderByUser);
route.get("/order-all", projectRouteAdmin, apiController.GetOrderAll);

route.get("/search", projectRouteAdmin, apiController.SearchUser);
route.post("/total-sales", projectRouteAdmin, apiController.AddTotalSales);

route.patch(
  "/status-order",
  projectRouteAdmin,
  apiController.UpdateStatusOrder
);
route.post("/upload", upload.single("file"), apiController.UploadFile);
route.get("/file", apiController.GetFile);

module.exports = route;
