const catchAsync = require("../utils/catchAsync");
const crud = require("./crudController");
exports.insertDelivery = catchAsync(async (req, res, next) => {
  crud.createOne("delivery", req, res, next);
});

exports.searchDelivery = catchAsync(async (req, res, next) => {
  const query = req.query;

  const user = await crud.findOneByParam("delivery", query);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

exports.updateDelivery = catchAsync(async (req, res, next) => {
  crud.updateOne("delivery", req, res, next);
});
exports.deleteDelivery = catchAsync(async (req, res, next) => {
  crud.deleteOne("delivery", req, res, next);
});
