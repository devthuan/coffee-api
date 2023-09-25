const { connection } = require("../../../config/db.config");

const AddUserToDatabase = (
  user_name,
  hashPass,
  phone_number,
  created_date,
  is_staff
) => {
  let sql = `insert into Users (username, password, phone_number, created_date, is_staff ) values (?, ?, ?, ? ,?) `;

  connection.query(
    sql,
    [user_name, hashPass, phone_number, created_date, is_staff],
    (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, result);
      }
    }
  );
};

const Login = (username, callback) => {
  let sql =
    "select id, username, password, is_active from Users where username = ?";

  connection.query(sql, [username], async (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const GetUser = (page, limit, callback) => {
  const offset = (page - 1) * limit;
  let sql = "select * from Users limit ?, ?";
  connection.query(sql, [offset, limit], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const DeleteUsers = (id, callback) => {
  let sql = "update Users set is_active = ? where id = ?";
  connection.query(sql, [0, id], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const SearchUser = (searchTerm, callback) => {
  const sql =
    "select * from Users where username like ? or phone_number like ?";
  const query = [`${searchTerm}%`, `%${searchTerm}%`];

  connection.query(sql, query, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = {
  AddUserToDatabase,
  Login,
  GetUser,
  DeleteUsers,
  SearchUser,
};
