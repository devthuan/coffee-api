// employeeModel.js
const { connection } = require("../../../config/db.config"); // Import đối tượng kết nối cơ sở dữ liệu từ thư mục chứa nó.

const getEmployees = (page, limit, callback) => {
  const offset = (page - 1) * limit;
  const sql = "SELECT * FROM Employees LIMIT ?, ?";

  connection.query(sql, [offset, limit], (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
};

const getTotalEmployeesCount = (callback) => {
  const sql = "SELECT COUNT(*) AS total FROM Employees";

  connection.query(sql, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result[0].total);
    }
  });
};

const AddEmployees = (name, email, phone_number, position, callback) => {
  const sql = `insert into Employees (employee_name, employee_email, phone_number, position, created_date)
                values (?, ?, ?, ?, NOW())`;

  connection.query(
    sql,
    [name, email, phone_number, position],
    (error, result) => {
      if (error) {
        console.log(error);
        callback(error, null); // Gửi lỗi qua callback
      } else {
        callback(null, result); // Gửi kết quả thành công qua callback
      }
    }
  );
};

const DeleteEmployee = (id, callback) => {
  const sql = `delete from Employees where employee_id  = ?`;
  connection.query(sql, [id], (error, result) => {
    if (error) {
      console.log(error);
      callback(error, null); // Gửi lỗi qua callback
    } else {
      callback(null, result); // Gửi kết quả thành công qua callback
    }
  });
};

const UpdateEmployee = (id, name, email, phone_number, position, callback) => {
  
  const updateValues = {
    employee_name: name,
    employee_email: email,
    phone_number: phone_number,
    position: position,
    update_date: new Date(),
  };

  const sql = `update Employees set ? where employee_id = ? `;
  connection.query(sql, [updateValues, id], (error, result) => {
    if (error) {
      console.log(error);
      callback(error, null); // Gửi lỗi qua callback
    } else {
      callback(null, result); // Gửi kết quả thành công qua callback
    }
  });
};

module.exports = {
  getEmployees,
  getTotalEmployeesCount,
  AddEmployees,
  DeleteEmployee,
  UpdateEmployee,
};
