const { connection } = require("../../../config/db.config");

const CountTotalSales = (cal) => {
  const sql = `SELECT  SUM(Products.price * Cart.quantity) AS total_sales, Orders.order_date AS date
                FROM Orders
                JOIN Cart ON Orders.cart_id = Cart.cart_id
                JOIN Products ON Cart.product_id = Products.id
                WHERE Orders.order_status = "Hoàn thành"
                GROUP BY Orders.order_date;
                `;
  connection.query(sql, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const AddTotalSales = (date, total_sales, callback) => {
  let sql = `INSERT INTO Sales (sale_date, total_sales) VALUES (?,?)
            ON DUPLICATE KEY UPDATE total_sales = VALUES(total_sales);
          `;
  connection.query(sql, [date, total_sales], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = {
  CountTotalSales,
  AddTotalSales,
};
