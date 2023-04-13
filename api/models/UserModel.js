let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserRole = require("../enums/UserRole");

const SALT = 10;

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username field is required!"],
  },
  phone: {
    type: String,
    required: [true, "Phone field is required!"],
  },
  email: {
    type: String,
    required: [true, "Email field is required!"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    // minlength: 5,
    required: [true, "Password field is required!"],
  },
  userType: {
    type: String,
    enum: UserRole,
    required: [true, "User type field is required!"],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Saving user data
UserSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    //checking if password field is available and modified
    bcrypt.genSalt(SALT, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// For comparing the users entered password with database duing login
UserSchema.methods.comparePassword = function (candidatePassword, callBack) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callBack(err);
    callBack(null, isMatch);
  });
};

// For generating token when loggedin
UserSchema.methods.generateToken = function (callBack) {
  let user = this;
  let token = jwt.sign(user._id.toHexString(), process.env.SECRETE);

  callBack(null, token);
};

// Validating token for auth routes middleware
UserSchema.statics.findByToken = function (token, callBack) {
  jwt.verify(token, process.env.SECRETE, function (err, decode) {
    // This decode must give user_id if token is valid .ie decode = user_id
    User.findById(decode, function (err, user) {
      if (err) {
        res.json({ status: false, data: "Invalid User ID" });
      }

      callBack(null, user);
    });
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = { User };
