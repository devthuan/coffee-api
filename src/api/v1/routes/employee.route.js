const express = require("express");
const EmployeeController = require("../controllers/employee.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const route = express.Router();

route.get("/", EmployeeController.GetEmployees);
route.post("/", EmployeeController.AddEmployees);
route.delete("/", EmployeeController.DeleteEmployee);
route.put("/", EmployeeController.UpdateEmployee);

module.exports = route;
