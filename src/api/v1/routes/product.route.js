const express = require("express");
const multer = require("multer");
const ProductController = require("../controllers/product.controller");
const {
  verifyToken,
  projectRouteAdmin,
} = require("../middlewares/auth.middleware");
const { cacheDataProduct } = require("../middlewares/cache.middleware");

const route = express.Router();

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

route.get("/", cacheDataProduct, ProductController.Products);

route.post(
  "/",
  upload.single("image_product"),
  projectRouteAdmin,
  ProductController.AddProducts
);

route.patch(
  "/:product_id",
  projectRouteAdmin,
  ProductController.DeleteProducts
);

module.exports = route;
