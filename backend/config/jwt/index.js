const jwt = require("jsonwebtoken");
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
const GenerateToken = (_id) => {
  const token = jwt.sign({ _id }, TOKEN_SECRET_KEY, { expiresIn: "2d" });
  return token;
};

const VerifyTOken = (token) => {
  const verifyToken = jwt.verify(token, TOKEN_SECRET_KEY);
  return verifyToken;
};

module.exports = {
  GenerateToken,
  VerifyTOken,
};
