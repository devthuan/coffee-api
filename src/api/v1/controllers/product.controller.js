const productModel = require("../models/product.model");
const { setDataIntoRedis } = require("../services/redis.services");

const Products = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  productModel.GetProducts(page, limit, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An Unknown error.",
      });
    } else {
      productModel.getProductTotalPage((error, resultTotal) => {
        if (error) {
          console.log(error);
          res.status(500).json({
            error: "An Unknown error.",
          });
        } else {
          const total = resultTotal[0].total;
          const totalPages = Math.ceil(total / limit);
          res.status(200).json({
            message: "Get products successful.",
            total,
            totalPages,
            products: result,
          });
          let dataProducts = {
            message: "Get products successful.",
            total,
            totalPages,
            products: result,
          };

          let dataJSON = JSON.stringify(dataProducts);
          let cacheKey = `products:${page}`;
          setDataIntoRedis(cacheKey, dataJSON, 3600);
        }
      });
    }
  });
};

const AddProducts = (req, res, next) => {
  const { name_product, description, price } = req.body;
  const image_product = req.file;

  productModel.AddProducts(
    name_product,
    description,
    price,
    image_product,
    (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          error: "An Unknown error.",
        });
      } else {
        res.status(200).json({
          message: "Add product successful .",
        });
      }
    }
  );
};

const DeleteProducts = (req, res, next) => {
  const { product_id } = req.params;

  if (!product_id) {
    return res.status(400).json({
      error: "Missing values.",
    });
  }

  productModel.DeleteProducts(product_id, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "An Unknown error",
      });
    } else {
      res.json({
        message: "delete item in cart successful.",
      });
    }
  });
};

module.exports = {
  Products,
  AddProducts,
  DeleteProducts,
};
