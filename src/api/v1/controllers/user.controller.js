require("dotenv").config();
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { validateRegisterData } = require("../validations/index.validation");
const { GetDateTimeCurrent } = require("../helpers/index.helper");
const { hashPassword, comparePassword } = require("../services/auth.service");
const {
  generateTokens,
  updateRefreshToken,
} = require("../middlewares/auth.middleware");
const { redis } = require("../../../config/redis.config");

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

    userModel.AddUserToDatabase(
      user_name,
      hashPass,
      phone_number,
      created_date,
      is_staff,
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

    userModel.Login(username, async (error, result, fields) => {
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
        if (result[0].is_active === 0) {
          return res.status(400).json({
            error: "Your account has been locked",
          });
        }

        let payload = {
          user_id: result[0].id,
          username: username,
        };
        // create jwt
        const tokens = generateTokens(payload);

        // update freshToken token in mysql and redis
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

    redis.get(decoded.user_id, (error, reply) => {
      if (error || !reply) {
        res.json({
          error: "Token is expired.",
        });
      } else {
        if (reply === refreshToken) {
          const payload = {
            user_id: decoded.user_id,
            username: decoded.username,
          };
          const tokens = generateTokens(payload);
          console.log(tokens);
          updateRefreshToken(decoded.user_id, `${tokens.refreshToken}`);
          res.status(200).json({
            tokens: tokens,
          });
        } else {
          res.json({
            error: "Token is expired.",
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      error: "Forbidden",
    });
  }
};

const GetUsers = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  userModel.GetUser(page, limit, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An Unknown error.",
      });
    } else {
      userModel.getUserTotalPage((totalError, totalResult) => {
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
          const userData = {
            message: "Get users successful .",
            total,
            totalPages,
            data: result,
          };
          const userDataJSON = JSON.stringify(userData);
          redis.set(
            "users",
            userDataJSON,
            "EX",
            process.env.EXPIRE_REFRESH_TOKEN
          );
        }
      });
    }
  });
};

const DeleteUsers = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: "Missing required values !!!",
    });
  }

  userModel.DeleteUsers(id, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An Unknown error.",
      });
      return;
    } else {
      res.status(200).json({
        message: "Delete user successful.",
      });
    }
  });
};

const SearchUser = (req, res, next) => {
  const searchTerm = req.query.key;

  userModel.SearchUser(searchTerm, (error, result) => {
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

module.exports = {
  refreshLogin,
  Login,
  Logout,

  Register,
  GetUsers,
  DeleteUsers,
  SearchUser,
};
