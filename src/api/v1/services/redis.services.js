const { redis } = require("../../../config/redis.config");
require("dotenv").config();

const setDataIntoRedis = (key, value, expired) => {
  try {
    redis.set(key, value, "EX", expired);
  } catch (error) {
    console.error("Error setting Redis key:", error);
  }
};

module.exports = {
  setDataIntoRedis,
};
