const express = require("express");

const { redis } = require("../../../config/redis.config");

const cacheMiddleware = (req, res, next) => {
  const key = req.url;

  // Kiểm tra xem dữ liệu đã được lưu trong cache chưa
  redis.get(key, (err, cachedData) => {
    if (err) throw err;

    // Nếu có dữ liệu trong cache, trả về nó
    if (cachedData) {
      res.json(cachedData);
    } else {
      // Nếu không có dữ liệu trong cache, tiếp tục xử lý yêu cầu và lưu dữ liệu vào cache
      next();
    }
  });
};

const cacheDataUsers = (req, res, next) => {
  // Kiểm tra xem dữ liệu đã được lưu trong cache chưa
  redis.get("users", (err, cachedData) => {
    if (err) throw err;

    // Nếu có dữ liệu trong cache, trả về nó
    if (cachedData) {
      res.json({
        messege: "data from redis",
        data: JSON.parse(cachedData),
      });
    } else {
      // Nếu không có dữ liệu trong cache, tiếp tục xử lý yêu cầu và lưu dữ liệu vào cache
      next();
    }
  });
};

module.exports = { cacheMiddleware, cacheDataUsers };
