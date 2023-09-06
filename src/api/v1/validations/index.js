module.export = {
  checkRequiredLogin: (req, res, next) => {
    const { username, password } = req.body;
    if (!username) {
      return [{ errors: "username missing..." }, null];
    }
  },
};
