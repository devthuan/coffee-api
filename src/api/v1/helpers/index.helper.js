const moment = require("moment");

const GetDateTimeCurrent = () => {
  const currentDate = moment();

  return currentDate.format("YYYY-MM-DD HH:mm:ss");
  // return currentDate.format("YYYY-MM-DD");
};

module.exports = { GetDateTimeCurrent };
