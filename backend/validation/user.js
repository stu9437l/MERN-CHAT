const { check, validationResult } = require("express-validator");
const UserModel = require("../model/user");
const UserValidation = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Name is required")
    .isLength({ min: 4, max: 32 })
    .withMessage("Names should be between 4 and 32 cahreacter"),
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value) => {
      return await UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          throw new Error(`user with ${value} is already exist`);
        }
      });
    }),
  check("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .not()
    .isIn(["password", 123456, "admin"])
    .withMessage("Too common password please put strong on"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    return next();
  },
];

module.exports = {
  UserValidation,
};
