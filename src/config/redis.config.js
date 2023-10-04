const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis({
  host: process.env.HOST_REDIS,
  port: process.env.PORT_REDIS,
});

redis.on("error", (err) => {
  console.log("connect to redis failed: ", err);
});
module.exports = { redis };
