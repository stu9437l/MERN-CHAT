const { VerifyTOken } = require("../config/jwt");
const UserModel = require("../model/user");

const Authentication = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next({
      status: 401,
      message: "Unauthenticate user",
    });
  }
  const { _id } = VerifyTOken(token);
  const user = await UserModel.findById(_id);
  if (!user) {
    return next({
      status: 403,
      message: "Access denied",
    });
  }
  req.user = user;
  next();
};

module.exports = {
  Authentication,
};
