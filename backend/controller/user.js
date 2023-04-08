const { GenerateToken } = require("../config/jwt");
const UserModel = require("../model/user");

const CreateUser = async (req, res, next) => {
  if (req.file) {
    req.body.picture = req.file.filename;
  }
  const { name, email, password, isAdmin } = req.body;
  try {
    const user = await UserModel.create({
      name,
      email,
      password,
      isAdmin,
      picture: req.body.picture,
    });
    return res.status(200).json({
      message: "User is created",
      user,
    });
  } catch (err) {
    next({
      message: "Create user failed",
    });
  }
};

const GetAllUsers = async (req, res, next) => {
  try {
    const regex = new RegExp(req.query.name, "i");
    const keyword = req.query.name ? { name: { $regex: regex } } : {};
    const users = await UserModel.find(keyword).find({
      _id: { $ne: req.user._id },
    });
    res.json(users);
  } catch (err) {
    next({
      message: "GetUsers failed",
    });
  }
};

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const checkPassword = await user.comparePassword(password);

    if (user && (await checkPassword)) {
      const token = GenerateToken(user._id);
      return res.status(200).json({
        user,
        token,
      });
    }
    return next({
      status: 400,
      message: "Invalid Credential!",
    });
  } catch (err) {
    next({
      message: "login failed",
    });
  }
};

module.exports = {
  CreateUser,
  GetAllUsers,
  Login,
};
