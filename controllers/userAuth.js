const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const AppError = require("../utils/appError");
exports.signup = catchAsync(async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    address,
    rating,
    role,
  } = req.body;
  const newUser = await User.create({
    first_name,
    last_name,
    email,
    password,
    phone_number,
    address,
    rating,
    role,
  });

  res.status("201").json({
    status: "success",
    data: {
      newUser,
    },
  });
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN_HOURS,
  });
};

const createSendToken = (user, statusCode, res) => {
  const id = user.user_id;
  const token = signToken(id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password are provided
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findByEmailandPassword(email, password);
  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

exports.loginConfirmation = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  const decryptedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  console.log(decryptedToken);

  const currentUser = await User.findById(decryptedToken.id);
  if (!currentUser) {
    return next(new AppError("No users found holding this token.", 401));
  }

  req.user = currentUser;
  next();
});
