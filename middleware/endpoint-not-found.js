const { StatusCodes } = require("http-status-codes");

const endpoint404Handler = (req, res, next) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    msg:
      "Requested endpoint does not exist. Check that you're using the " +
      "required method and that you've not mispelled the URL",
  });
};

module.exports = { endpoint404Handler };
