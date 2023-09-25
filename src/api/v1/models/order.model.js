const { connection } = require("../../../config/db.config");

const GetOrderByUser = (user_id, callback) => {
  let sql = `SELECT order_id, name_product, price, quantity, full_name, phone_number, address,order_status, order_date FROM Orders
  JOIN Cart ON Orders.cart_id = Cart.cart_id
  JOIN Products ON Cart.product_id = Products.id
  WHERE Orders.user_id = ?
  `;
  connection.query(sql, [user_id], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const GetOrderAll = (page, limit, callback) => {
  const offset = (page - 1) * limit;

  let sql = `SELECT order_id, name_product, price, quantity, full_name, phone_number, address,order_status, order_date FROM Orders
  JOIN Cart ON Orders.cart_id = Cart.cart_id
  JOIN Products ON Cart.product_id = Products.id
  limit ? , ? `;
  connection.query(sql, [offset, limit], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const getOrderTotalPage = (callback) => {
  let sql = "select  count(*) as total from Orders";
  connection.query(sql, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const UpdateStatusOrder = (order_id, order_status, callback) => {
  let sql = `UPDATE Orders SET order_status = ? WHERE order_id = ?`;
  connection.query(sql, [order_status, order_id], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = {
  GetOrderByUser,
  GetOrderAll,
  getOrderTotalPage,
  UpdateStatusOrder,
};
