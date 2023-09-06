const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const useRoutes = require("./api/v1/routes/api.route");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

// upgrade security
app.use(helmet());
// record logs
app.use(morgan("combined"));
// init routes
app.use("/v1/", useRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
