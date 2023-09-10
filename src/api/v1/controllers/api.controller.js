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

module.exports = {
  HomePages,
  Register,
  Login,
  Logout,
  refreshLogin,
};
