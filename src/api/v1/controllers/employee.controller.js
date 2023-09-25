const employeeModel = require("../models/employee.model");

const GetEmployees = (req, res, next) => {
  const page = req.params.page || 1;
  const limit = req.params.limit || 5;

  employeeModel.getEmployees(page, limit, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An Unknown error.",
      });
    } else {
      employeeModel.getTotalEmployeesCount((TotalError, TotalResult) => {
        if (TotalError) {
          console.log(TotalError);
          return res.status(500).json({
            error: "An Unknown error.",
          });
        } else {
          const total = TotalResult[0].total;
          const totalPages = Math.ceil(total / limit);
          res.status(200).json({
            message: "Successful",
            total,
            totalPages,
            data: result,
          });
        }
      });
    }
  });
};

const AddEmployees = (req, res, next) => {
  const { name, email, phone_number, position } = req.body;
  console.log(name);

  if (!name || !email || !phone_number || !position) {
    return res.status(400).json({
      error: "Missing required values !!!",
    });
  }

  employeeModel.AddEmployees(
    name,
    email,
    phone_number,
    position,
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          error: "An Unknown error .",
        });
      } else {
        return res.status(200).json({
          message: "Add employee successful.",
        });
      }
    }
  );
};
const DeleteEmployee = (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      error: "Missing required values !!!",
    });
  }

  employeeModel.DeleteEmployee(id, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: "An Unknown error.",
      });
    } else {
      return res.status(200).json({
        message: "Deleted employee successful.",
      });
    }
  });
};

const UpdateEmployee = (req, res, next) => {
  const { id, name, email, phone_number, position } = req.body;

  if (!id || !name || !email || !phone_number || !position) {
    return res.status(400).json({
      error: "Missing required values !!!",
    });
  }

  employeeModel.UpdateEmployee(
    id,
    name,
    email,
    phone_number,
    position,
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          error: "An Unknown error.",
        });
      } else {
        return res.status(200).json({
          message: "Updated employee successful.",
        });
      }
    }
  );
};

module.exports = {
  GetEmployees,
  AddEmployees,
  DeleteEmployee,
  UpdateEmployee,
};
