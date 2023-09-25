const express = require("express");

const cartRoute = require("./cart.route");
const employeeRoute = require("./employee.route");
const orderRoute = require("./order.route");
const productRoute = require("./product.route");
const userRoute = require("./user.route");
const salesRoute = require("./sales.route");

const apiRoute = express();

apiRoute.use("/cart", cartRoute);
apiRoute.use("/employees", employeeRoute);
apiRoute.use("/", orderRoute);
apiRoute.use("/product", productRoute);
apiRoute.use("/", userRoute);
apiRoute.use("/", salesRoute);

module.exports = apiRoute;

// const apiController = require("../controllers/api.controller");
// const {
//   verifyToken,
//   projectRouteAdmin,
// } = require("../middlewares/auth.middleware");
// const route = express.Router();
// const multer = require("multer");

// route.post("/upload", upload.single("file"), apiController.UploadFile);
// route.get("/file", apiController.GetFile);

// module.exports = route;
