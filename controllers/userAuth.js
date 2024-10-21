const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const connection = require("../db_connections/dbConnect");
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

  res.status(201).json({
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
  user.password = undefined;

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

  const currentUser = await User.findById(decryptedToken.id);
  if (!currentUser) {
    return next(new AppError("No users found holding this token.", 401));
  }

  req.user = currentUser;
  next();
});
exports.allow = (error_message, ...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(error_message, 403));
    }

    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const [user] = await connection
    .promise()
    .query("SELECT * FROM users WHERE email = ?", [email]);

  if (!user.length) {
    return next(new AppError("There is no user with that email.", 404));
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Save the token to the user (hash it before saving)
  await connection
    .promise()
    .query(
      "UPDATE users SET passwordResetToken = ?, passwordResetExpires = ? WHERE user_id = ?",
      [
        crypto.createHash("sha256").update(resetToken).digest("hex"),
        new Date(Date.now() + 10 * 60 * 1000),
        user[0].user_id,
      ]
    );

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/rentItOut/users/resetPassword/${resetToken}`;

  // Setup email transport
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  await transporter.sendMail({
    to: user[0].email,
    subject: "Your password reset token (valid for 10 minutes)",
    text: `Reset your password using the following link: ${resetURL}`,
  });

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const [user] = await connection
    .promise()
    .query(
      "SELECT * FROM users WHERE passwordResetToken = ? AND passwordResetExpires > ?",
      [hashedToken, new Date(Date.now())]
    );

  if (!user.length) {
    return next(new AppError("Token is invalid or has expired.", 400));
  }

  const newPassword = req.body.password;
  await connection
    .promise()
    .query(
      "UPDATE users SET password = ?, passwordResetToken = NULL, passwordResetExpires = NULL WHERE user_id = ?",
      [newPassword, user[0].user_id]
    );

  createSendToken(user[0], 200, res);
});
