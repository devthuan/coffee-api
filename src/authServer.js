const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const useRoutes = require("./api/v1/routes/auth.route");

const app = express();
dotenv.config();

const port = 5050;
app.use(
  cors({
    origin: `http://localhost:3000`,
  })
);

// phân tích dữ liệu từ body : lấy req từ form
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// upgrade security
app.use(helmet());
// record logs
app.use(morgan("combined"));
// init routes
app.use("/v1/", useRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
