const salesModel = require("../models/sales.model");

const AddTotalSales = (req, res, next) => {
  salesModel.CountTotalSales((error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: "An Unknown error.",
      });
    } else {
      result.forEach((row) => {
        const date = row.date;
        const total_sales = row.total_sales;
        salesModel.AddTotalSales(date, total_sales, (AddError, AddResult) => {
          if (AddError) {
            console.log(AddError);
            res.status(500).json({
              error: "An Unknown error.",
            });
          } else {
            res.status(200).json({
              message: "Insert data to table sales successful.",
            });
          }
        });
      });
    }
  });
};

module.exports = {
  AddTotalSales,
};
