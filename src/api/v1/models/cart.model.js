const { connection } = require("../../../config/db.config");

const GetCart = (user_id, callback) => {
  let sql = `SELECT cart_id, user_id, product_id, name_product, price, image_product, quantity FROM Cart 
                JOIN Products ON Cart.product_id = Products.id where user_id = ?`;

  connection.query(sql, [user_id], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const getTotalCart = (callback) => {
  let sql = "select count(*) as total from Cart";
  connection.query(sql, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const AddCart = (user_id, product_id, quantity, callback) => {
  // First, check if the product_id already exists in the cart
  const checkSql = "SELECT * FROM Cart WHERE user_id = ? AND product_id = ?";

  connection.query(checkSql, [user_id, product_id], (error, rows) => {
    if (error) {
      callback(error, null);
    } else {
      if (rows.length > 0) {
        // Product already exists, update the quantity
        const existingQuantity = rows[0].quantity;
        const newQuantity = existingQuantity + quantity;

        const updateSql =
          "UPDATE Cart SET quantity = ? WHERE user_id = ? AND product_id = ?";
        connection.query(
          updateSql,
          [newQuantity, user_id, product_id],
          (updateError, updateResult) => {
            if (updateError) {
              callback(updateError, null);
            } else {
              callback(null, updateResult);
            }
          }
        );
      } else {
        // Product does not exist, insert a new record
        const insertSql =
          "INSERT INTO Cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
        connection.query(
          insertSql,
          [user_id, product_id, quantity],
          (insertError, insertResult) => {
            if (insertError) {
              callback(insertError, null);
            } else {
              callback(null, insertResult);
            }
          }
        );
      }
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
const DeleteCartByUserId = (user_id, callback) => {
  let sql = `delete from Cart where user_id = ?`;

  connection.query(sql, [user_id], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const UpdateCart = (quantity, cart_id, callback) => {
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
  getTotalCart,
  GetCart,
  AddCart,
  DeleteCart,
  DeleteCartByUserId,
  UpdateCart,
};
