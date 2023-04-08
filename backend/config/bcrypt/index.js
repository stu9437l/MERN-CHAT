const bcrypt = require("bcrypt");

const HashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const ComparePassword = async (prevPassword, enteredPassword) => {
  const checkPassWord = await bcrypt.compare(prevPassword, enteredPassword);
  console.log(checkPassWord);

  return checkPassWord;
};

module.exports = {
  ComparePassword,
  HashPassword,
};
