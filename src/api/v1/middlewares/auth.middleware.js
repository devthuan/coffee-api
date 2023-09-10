// Trong thư mục "middlewares":
// Hàm middleware được sử dụng để xử lý yêu cầu HTTP trước khi chúng được định tuyến đến controllers.
// Hàm middleware có thể thực hiện xác thực, kiểm tra quyền truy cập, ghi log, nén dữ liệu, v.v.

// check login, token
require("dotenv").config;
const { connection } = require("../../../config/index.config");
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
    console.log(decoded);
    req.user_id = decoded.user_id;
    next();
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
    expiresIn: "60s",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  return { accessToken, refreshToken };
};

const deleteToken = (req, res, next) => {};

module.exports = {
  verifyToken,
  generateTokens,
  updateRefreshToken,
};
