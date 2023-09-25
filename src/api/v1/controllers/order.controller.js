const { connection } = require("../../../config/db.config");
const orderModel = require("../models/order.model");

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
  const limit = req.params.limit || 5;

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
  orderModel.UpdateStatusOrder(order_status, order_id, (error, result) => {
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
  GetOrderByUser,
  GetOrderAll,

  UpdateStatusOrder,
};
