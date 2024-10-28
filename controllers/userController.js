const crud = require("./crudController");
const catchAsync = require("../utils/catchAsync");
exports.getProfile = (req, res, next) => {
  req.params.id = req.user.user_id;

  next();
};

exports.search = catchAsync(async (req, res, next) => {
  const query = req.query;

  const user = await crud.findOneByParam("users", query);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

exports.updateUserProfile = catchAsync(async (req, res, next) => {
  crud.updateOne("users", req, res, next);
});
exports.deleteProfile = catchAsync(async (req, res, next) => {
  crud.deleteOne("users", req, res, next);
});
exports.getAll = catchAsync(async (req, res, next) => {
  crud.getAll("users", req, res, next);
});
exports.getUser = catchAsync(async (req, res, next) => {
  crud.getOne("users", req, res, next);
});
exports.updateUser = catchAsync(async (req, res, next) => {
  crud.updateOne("users", req, res, next);
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  crud.deleteOne("users", req, res, next);
});
