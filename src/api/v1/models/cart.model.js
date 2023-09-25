const { connection } = require("../../../config/db.config");

const GetCart = (user_id, callback) => {
  let sql = `SELECT user_id, product_id, name_product, price, quantity FROM Cart 
                JOIN Products ON Cart.product_id = Products.id where user_id = ?`;

  connection.query(sql, [user_id], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const AddCart = (user_id, product_id, quantity, callback) => {
  let sql = `Insert into Cart (user_id, product_id, quantity) values (?,?,?)`;

  connection.query(sql, [user_id, product_id, quantity], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const DeleteCart = (cart_id, callback) => {
  let sql = `delete from Cart where cart_id = ?`;

  connection.query(sql, [cart_id], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const UpdateCart = (cart_id, quantity, callback) => {
  let sql = `update Cart set quantity = ? where cart_id = ?`;

  connection.query(sql, [quantity, cart_id], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};
module.exports = {
  GetCart,
  AddCart,
  DeleteCart,
  UpdateCart,
};
