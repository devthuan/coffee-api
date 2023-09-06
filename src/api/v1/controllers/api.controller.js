const HomePages = (req, res, next) => {
  res.json({
    message: "Home PAGE",
  });
};

module.exports = {
  HomePages,
};
