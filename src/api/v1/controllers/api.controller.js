const { connection } = require("../../../config/db.config");

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

// test
const UploadFile = (req, res, next) => {
  const id = req.body.id;

  const file = req.file;
  const serverUrl = "http://localhost:8080/uploads/"; // Địa chỉ máy chủ của bạn

  const pathFile = serverUrl + file.filename;

  if (!id || !file) {
    res.status(400).json({
      error: "Missing values !!!",
    });
    return;
  }
  let sql = `UPDATE Products SET image_product = ? WHERE id = ?`;
  connection.query(sql, [pathFile, id], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An Unknown error.",
      });
    } else {
      res.status(200).json({
        message: "Update status image product successful.",
      });
    }
  });
};

const GetFile = (req, res, next) => {
  let sql = `select image_product from Products limit 1`;
  connection.query(sql, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An Unknown error.",
      });
    } else {
      const imagePaths = result.map((row) => {
        return row.image_product;
      });

      res.status(200).json({
        data: imagePaths,
      });
    }
  });
};

module.exports = {
  HomePages,

  UploadFile,
  GetFile,
};
