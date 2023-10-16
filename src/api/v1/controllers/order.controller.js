const { connection } = require("../../../config/db.config");
const orderModel = require("../models/order.model");

const AddOrderByUser = (req, res, next) => {
  try {
    const user_id = req.user_id;
    const {
      full_name,
      phone_number,
      delivery_address,
      payment_method,
      order_status,
    } = req.body;

    if (
      !full_name ||
      !phone_number ||
      !delivery_address ||
      !payment_method ||
      !order_status
    ) {
      res.status(400).json({
        error: "Missing values.",
      });
    }
    orderModel.AddOrderByUser(
      user_id,

      full_name,
      phone_number,
      delivery_address,
      payment_method,
      order_status,
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(400).json({
            error: "Error query. ",
          });
        } else {
          res.status(200).json({
            message: "add item into order successful.",
            order_id: result,
          });
        }
      }
    );
  } catch (error) {
    res.status(400).json({
      error: "An Unknown error.",
    });
  }
};

const GetOrderDetail = (req, res) => {
  const { order_id } = req.params;

  orderModel.OrderDetail(order_id, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "Error query. ",
      });
    } else {
      res.status(200).json({
        message: "successful.",
        data: result,
      });
    }
  });
};

const AddOrderDetail = (req, res, next) => {
  try {
    const user_id = req.user_id;
    const order_id = req.body.order_id;
    const products = req.body.products;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: "Missing value!",
      });
    }
    orderModel.AddOrderDetail(order_id, products, (error, result) => {
      console.log(error);
      if (error) {
        res.status(400).json({
          error: "Error query. ",
        });
      } else {
        res.status(200).json({
          message: "add item into order detail successful.",
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      error: "An Unknown error.",
    });
  }
};

const GetOrderByUser = (req, res, next) => {
  const user_id = req.user_id;

  if (!user_id) {
    return res.status(400).json({
      error: "Missing required values !!!",
    });
  }

  orderModel.GetOrderByUser(user_id, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "An Unknown error. ",
      });
    } else {
      res.status(200).json({
        data: result,
      });
    }
  });
};

const GetOrderAll = (req, res, next) => {
  const page = req.params.page || 1;
  const limit = req.params.limit || 10;

  orderModel.GetOrderAll(page, limit, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "An Unknown error. ",
      });
    } else {
      orderModel.getOrderTotalPage((totalError, totalResult) => {
        if (totalError) {
          console.log(totalError);
          res.status(400).json({
            error: "An Unknown error.",
          });
        } else {
          const total = totalResult[0].total;
          const totalPages = Math.ceil(total / limit);
          res.status(200).json({
            total,
            totalPages,
            data: result,
          });
        }
      });
    }
  });
};

const UpdateStatusOrder = (req, res, next) => {
  const { order_id, order_status } = req.body;
  if (!order_id || !order_status) {
    res.status(400).json({
      error: "Missing values !!!",
    });
    return;
  }
  orderModel.UpdateStatusOrder(order_id, order_status, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An Unknown error.",
      });
    } else {
      res.status(200).json({
        message: "Update status order successful.",
      });
    }
  });
};

module.exports = {
  AddOrderDetail,
  GetOrderDetail,
  GetOrderByUser,
  GetOrderAll,
  AddOrderByUser,
  UpdateStatusOrder,
};
