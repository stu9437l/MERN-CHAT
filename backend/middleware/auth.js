const { VerifyTOken } = require("../config/jwt");
const UserModel = require("../model/user");

const Authentication = async (req, res, next) => {
  const token = req.headers.authorization;
  const { _id } = VerifyTOken(token);
  const user = await UserModel.findById(_id);
  if (!user) {
    return next({
      message: "Unauthenticate",
    });
  }
  req.user = user;
  next()
};

module.exports = {
  Authentication,
};
