const catchAsync = require("../utils/catchAsync");
const crud = require("./crudController");
exports.insertInsurance = catchAsync(async (req, res, next) => {
  crud.createOne("Insurance", req, res, next);
});

exports.searchInsurance = catchAsync(async (req, res, next) => {
  const query = req.query;

  const user = await crud.findOneByParam("Insurance", query);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

exports.updateInsurance = catchAsync(async (req, res, next) => {
  crud.updateOne("Insurance", req, res, next);
});
exports.deleteInsurance = catchAsync(async (req, res, next) => {
  crud.deleteOne("Insurance", req, res, next);
});
