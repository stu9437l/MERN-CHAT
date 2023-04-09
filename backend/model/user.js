const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    picture: {
      type: String,
      default:
        "https://icon-library.com/images/default-user-icon/default-user-icon-6.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// hashpassword
UserSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
