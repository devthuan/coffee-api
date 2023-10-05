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
  const page = req.query.page || 1;

  // Kiểm tra xem dữ liệu đã được lưu trong cache chưa
  redis.get(`users:${page}`, (err, cachedData) => {
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

const cacheDataProduct = (req, res, next) => {
  const page = req.query.page || 1;

  console.log("check page: ", page);

  let cacheKey = `products:${page}`;
  console.log("check cachkey: ", cacheKey);
  redis.get(cacheKey, (err, cachedData) => {
    if (err) return res.json({ error: "Unknow an error.", detail: err });

    if (cachedData) {
      res.json({
        message: "data from redis",
        data: JSON.parse(cachedData),
      });
    } else {
      next();
    }
  });
};

const cacheDataSearchUser = (req, res, next) => {
  const searchTerm = req.query.key;

  let cacheKey = `search:${searchTerm}`;

  redis.get(cacheKey, (err, cachedData) => {
    if (err) return res.json({ error: "Unknow an error.", detail: err });

    if (cachedData) {
      res.json({
        message: "data from redis",
        data: JSON.parse(cachedData),
      });
    } else {
      next();
    }
  });
};

module.exports = {
  cacheMiddleware,
  cacheDataUsers,
  cacheDataProduct,
  cacheDataSearchUser,
};
