const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: "Email address is required",
      match: /.+\@.+\..+/
    },
    password: {
      type: String,
      required: true,
    },
    telefones: [
      {
        numero: {
          type: String,
          required: true,
        },
        ddd: {
          type: String,
          required: true,
        },
      },
    ],
    ultimo_login: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});



const User = mongoose.model("User", userSchema);
module.exports = User;
