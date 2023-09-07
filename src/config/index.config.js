const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB__HOST,
  user: process.env.DB__USER,
  password: process.env.DB__PASSWORD,
  database: process.env.DB__DATABASE,
  connectionLimit: process.env.CONNECTIONLIMIT,
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to MYSQL: " + err.stack);
    return;
  }
  console.log("Connected to MYSQL as id: " + connection.threadId);
});


module.exports = { connection };
