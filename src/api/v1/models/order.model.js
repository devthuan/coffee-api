const { connection } = require("../../../config/db.config");

const AddOrderByUser = (
  user_id,
  full_name,
  phone_number,
  delivery_address,
  payment_method,
  order_status,
  callback
) => {
  let sql = `INSERT INTO Orders (user_id, full_name, phone_number, delivery_address, order_date, payment_methods, order_status)
VALUES (?, ?, ?, ?, NOW(), ? ,?)`;
  connection.query(
    sql,
    [
      user_id,
      full_name,
      phone_number,
      delivery_address,
      payment_method,
      order_status,
    ],
    (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        const insertedId = result.insertId;
        callback(null, insertedId);
      }
    }
  );
};

const AddOrderDetail = (order_id, products, callback) => {
  let check = false;
  products.forEach((product) => {
    const { product_id, quantity } = product;
    const sql = `INSERT INTO OrderDetail ( order_id, product_id, quantity)
              VALUES (?, ?, ?)`;
    const values = [order_id, product_id, quantity];
    connection.query(sql, values, (error, result) => {
      if (error) {
        check = true;
      } else {
        check = false;
      }
    });
    if (check === true) {
      callback("error query", null);
    } else {
      callback(null, "add item successful");
    }
  });
};

const OrderDetail = (id, callback) => {
  let sql = `
SELECT 
        Products.name_product AS name_product,
        Products.price AS price,
        Products.image_product as image_product,
        OrderDetail.quantity,
        OrderDetail.quantity * Products.price AS total_payment
        FROM OrderDetail JOIN Products ON OrderDetail.product_id = Products.id
        WHERE order_id = ?`;
  connection.query(sql, id, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const GetOrderByUser = (user_id, callback) => {
  let sql = `SELECT
  	Orders.id,
      full_name,
      phone_number,
      delivery_address,
      order_date,
      payment_methods,
      order_status,
      SUM(OrderDetail.quantity * Products.price) AS total_payment
  FROM Orders
  JOIN OrderDetail ON Orders.id = OrderDetail.order_id
  JOIN Products ON OrderDetail.product_id = Products.id
  WHERE user_id = ?
  GROUP BY Orders.id, full_name, phone_number, delivery_address, order_date, payment_methods, order_status`;
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

  //   let sql = `SELECT
  // 	Orders.id,
  //     full_name,
  //     phone_number,
  //     delivery_address,
  //     order_date,
  //     payment_methods,
  //     order_status,
  //     SUM(OrderDetail.quantity * Products.price) AS total_payment
  // FROM Orders
  // JOIN OrderDetail ON Orders.id = OrderDetail.order_id
  // JOIN Products ON Orders.product_id = Products.id
  // GROUP BY Orders.id, full_name, phone_number, delivery_address, order_date, payment_methods, order_status
  // `;
  let sql = `SELECT
  	Orders.id,
      full_name,
      phone_number,
      delivery_address,
      order_date,
      payment_methods,
      order_status,
      SUM(OrderDetail.quantity * Products.price) AS total_payment
  FROM Orders
  JOIN OrderDetail ON Orders.id = OrderDetail.order_id
  JOIN Products ON OrderDetail.product_id = Products.id
  GROUP BY Orders.id, full_name, phone_number, delivery_address, order_date, payment_methods, order_status`;
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
  let sql = `UPDATE Orders SET order_status = ? WHERE id = ?`;
  connection.query(sql, [order_status, order_id], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = {
  AddOrderByUser,
  AddOrderDetail,
  OrderDetail,
  GetOrderByUser,
  GetOrderAll,
  getOrderTotalPage,
  UpdateStatusOrder,
};
