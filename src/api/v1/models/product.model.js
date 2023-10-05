const { connection } = require("../../../config/db.config");
const { redis } = require("../../../config/redis.config");

const GetProducts = (page, limit, callback) => {
  const offset = (page - 1) * limit;

  let sql = "select * from Products limit ?, ?";
  connection.query(sql, [offset, limit], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);

      
    }
  });
};

const getProductTotalPage = (callback) => {
  let sql = "select count(*) as total from Products";
  connection.query(sql, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const AddProducts = (
  name_product,
  description,
  price,
  image_product,
  callback
) => {
  const serverUrl = "http://localhost:8080/uploads/";
  const pathFile = serverUrl + image_product.filename;

  let sql = `insert into Products (name_product, description, price, created_date, image_product) values (?, ?, ?, NOW(), ?)`;
  connection.query(
    sql,
    [name_product, description, price, pathFile],
    (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, result);
      }
    }
  );
};

const DeleteProducts = (product_id, callback) => {
  let sql = `update Products set is_active = ? where id = ?`;

  connection.query(sql, [0, product_id], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = {
  GetProducts,
  getProductTotalPage,
  AddProducts,
  DeleteProducts,
};
