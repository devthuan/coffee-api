const { connection } = require("../../../config/index.config");

const HomePages = async (req, res, next) => {
  try {
    connection.query("select * from users", (error, result, fields) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          error: "Database error",
        });
        return;
      }

      res.json({
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

module.exports = {
  HomePages,
};
