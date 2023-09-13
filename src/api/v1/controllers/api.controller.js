const jwt = require("jsonwebtoken");

const { connection } = require("../../../config/index.config");
const { validateRegisterData } = require("../validations/index.validation");
const { GetDateTimeCurrent } = require("../helpers/index.helper");
const { hashPassword, comparePassword } = require("../services/auth.service");
const {
  generateTokens,
  updateRefreshToken,
} = require("../middlewares/auth.middleware");

const HomePages = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    console.log(user_id);
    connection.query("select * from Users", (error, result, fields) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          error: "Database error",
        });
        return;
      }

      res.json({
        user_id: user_id,
        data: result,
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Error",
    });
    return;
  }
};

const Register = async (req, res, next) => {
  try {
    const { user_name, password, phone_number } = req.body;
    let validationErrors = validateRegisterData(
      user_name,
      password,
      phone_number
    );

    if (validationErrors) {
      return res.status(400).json({ error: validationErrors });
    }

    let created_date = GetDateTimeCurrent();
    let is_staff = "staff";
    let hashPass = await hashPassword(password);
    let sql =
      "insert into Users (username, password, phone_number, created_date, is_staff ) values (?, ?, ?, ? ,?) ";
    connection.query(
      sql,
      [user_name, hashPass, phone_number, created_date, is_staff],
      (error, result) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            res.status(400).json({
              error: "Name an existing account !! ",
            });
            return;
          } else {
            console.log(error);
            res.status(400).json({
              error: "An unknown error !!!",
            });
          }
        } else {
          res.status(200).json({
            message: "Account registration successful.",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(401).json({
      error: error,
    });
  }
};

const Login = (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required !!!",
      });
    }

    let sql = "select id, username, password from Users where username = ?";
    connection.query(sql, [username], async (error, result, fields) => {
      if (error) {
        res.status(400).json({
          error: "An Unknown error !!!",
        });
        return;
      } else {
        if (result[0].length === 0) {
          return res.status(404).json({
            error: "Account or password is incorrect.",
          });
        }

        let comparePass = await comparePassword(password, result[0].password);
        if (!comparePass) {
          return res.status(404).json({
            error: "Account or password is incorrect.",
          });
        }

        let payload = {
          user_id: result[0].id,
          username: username,
        };
        // create jwt
        const tokens = generateTokens(payload);

        updateRefreshToken(result[0].id, tokens.refreshToken);

        res.json({
          message: "Login successful.",
          token: tokens,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "An Unknown error !!1",
    });
  }
};

const Logout = (req, res, next) => {
  const user_id = req.user_id;

  updateRefreshToken(user_id, null);
  res.status(200).json({
    message: " Logout successful.",
  });
};

const refreshLogin = (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const payload = {
      user_id: decoded.user_id,
      username: decoded.username,
    };

    const tokens = generateTokens(payload);

    updateRefreshToken(decoded.user_id, tokens.refreshToken);

    res.status(200).json({
      tokens: tokens,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      error: "Forbidden",
    });
  }
};

const Products = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 2;
  const offset = (page - 1) * limit;

  let sql = "select * from Products limit ?, ?";
  connection.query(sql, [offset, limit], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An Unknown error.",
      });
    } else {
      connection.query(
        "select count(*) as total from Products ",
        (error, resultTotal) => {
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
          }
        }
      );
    }
  });
};

const GetUsers = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const offset = (page - 1) * limit;

  let sql = "select * from Users limit ?, ?";
  connection.query(sql, [offset, limit], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An Unknown error.",
      });
    } else {
      connection.query(
        "select count(*) as total from Users",
        (totalError, totalResult) => {
          if (totalError) {
            console.log(totalError);
            res.status(500).json({ error: "An Unknown error ." });
          } else {
            let total = totalResult[0].total;
            let totalPages = Math.ceil(total / limit);
            res.status(200).json({
              message: "Get users successful .",
              total,
              totalPages,
              data: result,
            });
          }
        }
      );
    }
  });
};

// const DeleteUsers = (req, res, next) => {
//   const { id } = req.params;

//   let sql = "delete from Users where id = ?";
//   connection.query(sql, [id], (error, result) => {
//     if (error) {
//       console.log(error);
//       res.status(500).json({
//         error: "An Unknown error.",
//       });
//       return;
//     } else {
//       res.status(200).json({
//         message: "Delete user successful.",
//       });
//     }
//   });
// };

const GetCart = (req, res, next) => {
  const user_id = req.user_id;

  let sql = `SELECT user_id, product_id, name_product, price, quantity FROM Cart 
          JOIN Products ON Cart.product_id = Products.id where user_id = ?`;

  connection.query(sql, [user_id], (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "An Unknown error",
      });
    } else {
      res.json({
        data: result,
      });
    }
  });
};
const AddCart = (req, res, next) => {
  const user_id = req.user_id;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({
      error: "Missing values.",
    });
  }

  let sql = `Insert into Cart (user_id, product_id, quantity) values (?,?,?)`;

  connection.query(sql, [user_id, product_id, quantity], (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "An Unknown error",
      });
    } else {
      res.json({
        message: "Add item to cart successful.",
      });
    }
  });
};
const DeleteCart = (req, res, next) => {
  const { cart_id } = req.params;
  if (!cart_id) {
    return res.status(400).json({
      error: "Missing values.",
    });
  }

  let sql = `delete from Cart where cart_id = ?`;

  connection.query(sql, [cart_id], (error, result) => {
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
const UpdateCart = (req, res, next) => {
  const { cart_id } = req.params;
  const { quantity } = req.body;
  if (!cart_id) {
    return res.status(400).json({
      error: "Missing values.",
    });
  }

  let sql = `update Cart set quantity = ? where cart_id = ?`;

  connection.query(sql, [quantity, cart_id], (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "An Unknown error",
      });
    } else {
      res.json({
        message: "update quantity item in cart successful.",
      });
    }
  });
};

const GetOrderByUser = (req, res, next) => {
  const user_id = req.user_id;

  let sql = `SELECT order_id, name_product, price, quantity, full_name, phone_number, address,order_status, order_date FROM Orders
  JOIN Cart ON Orders.cart_id = Cart.cart_id
  JOIN Products ON Cart.product_id = Products.id
  WHERE Orders.user_id = ?
  `;
  connection.query(sql, [user_id], (error, result) => {
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
  const offset = (page - 1) * limit;

  let sql = `SELECT order_id, name_product, price, quantity, full_name, phone_number, address,order_status, order_date FROM Orders
  JOIN Cart ON Orders.cart_id = Cart.cart_id
  JOIN Products ON Cart.product_id = Products.id
  limit ? , ? `;
  connection.query(sql, [offset, limit], (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({
        error: "An Unknown error. ",
      });
    } else {
      connection.query(
        "select  count(*) as total from Orders",
        (totalError, totalResult) => {
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
        }
      );
    }
  });
};

const SearchUser = (req, res, next) => {
  const searchTerm = req.query.key;

  const sql =
    "select * from Users where username like ? or phone_number like ?";
  const query = [`${searchTerm}%`, `%${searchTerm}%`];

  connection.query(sql, query, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An Unknown error.",
      });
    } else {
      res.status(200).json({
        data: result,
      });
    }
  });
};

const AddTotalSales = (req, res, next) => {
  const sql = `SELECT  SUM(Products.price * Cart.quantity) AS total_sales, Orders.order_date AS date
                FROM Orders
                JOIN Cart ON Orders.cart_id = Cart.cart_id
                JOIN Products ON Cart.product_id = Products.id
                WHERE Orders.order_status = "Hoàn thành"
                GROUP BY Orders.order_date;
                `;
  connection.query(sql, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An Unknown error.",
      });
    } else {
      result.forEach((row) => {
        const date = row.date;
        const total_sales = row.total_sales;
        connection.query(
          `INSERT INTO Sales (sale_date, total_sales) VALUES (?,?)
            ON DUPLICATE KEY UPDATE total_sales = VALUES(total_sales);
          `,
          [date, total_sales],
          (AddError, AddResult) => {
            if (AddError) {
              console.log(AddError);
              res.status(500).json({
                error: "An Unknown error.",
              });
            } else {
              res.status(200).json({
                message: "Insert data to table sales successful.",
              });
            }
          }
        );
      });
    }
  });
};

module.exports = {
  HomePages,
  Register,
  Login,
  Logout,
  refreshLogin,
  Products,
  GetUsers,

  GetCart,
  AddCart,
  DeleteCart,
  UpdateCart,

  GetOrderByUser,
  GetOrderAll,

  SearchUser,
  AddTotalSales,
};
