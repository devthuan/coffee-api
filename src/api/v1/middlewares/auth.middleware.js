// Trong thư mục "middlewares":
// Hàm middleware được sử dụng để xử lý yêu cầu HTTP trước khi chúng được định tuyến đến controllers.
// Hàm middleware có thể thực hiện xác thực, kiểm tra quyền truy cập, ghi log, nén dữ liệu, v.v.

// check login, token
require("dotenv").config;
const { connection } = require("../../../config/db.config");
const { redis } = require("../../../config/redis.config");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({
      error: "Unauthorized",
    });

  try {
    
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user_id = decoded.user_id;
    next();

  } catch (error) {
    console.log(error);
    res.status(403).json({
      error: "Forbidden",
    });
  }
};

const projectRouteAdmin = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({
      error: "Unauthorized",
    });

  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let user_id = decoded.user_id;
    connection.query(
      "select is_staff from Users where id = ?",
      [user_id],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({
            error: "An Unknown error.",
          });
          return;
        } else {
          if (result[0].is_staff === "true") {
            next();
          } else {
            res.status(403).json({
              message: "You do not have permission to access this route",
            });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(403).json({
      error: "Forbidden",
    });
  }
};

const updateRefreshToken = (user_id, refreshToken) => {
  connection.query(
    "SELECT user_id, refresh_token FROM Tokens WHERE user_id = ?",
    [user_id],
    (error, result) => {
      if (error) {
        console.log(error);
      }

      if (result.length === 0) {
        // Insert a new refresh token
        connection.query(
          "INSERT INTO Tokens (user_id, refresh_token, created_date) VALUES (?, ?, NOW())",
          [user_id, refreshToken],
          (error, result) => {
            if (error) {
              console.log(error);
              return;
            } else {
              redis.set(
                user_id,
                refreshToken,
                "EX",
                process.env.EXPIRE_REFRESH_TOKEN
              );
              console.log("Insert successful.");
            }
          }
        );
      } else {
        // Update refreshToken
        connection.query(
          "UPDATE Tokens SET refresh_token = ?, update_date = NOW() WHERE user_id = ?",
          [refreshToken, user_id],
          (error, result) => {
            if (error) {
              console.log(error);
            } else {
              redis.set(
                user_id,
                refreshToken,
                "EX",
                process.env.EXPIRE_REFRESH_TOKEN
              );
              console.log("Update successful.");
            }
          }
        );
      }
    }
  );
};

const generateTokens = (payload) => {
  // Create JWT
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
};

module.exports = {
  verifyToken,
  generateTokens,
  updateRefreshToken,
  projectRouteAdmin,
};
