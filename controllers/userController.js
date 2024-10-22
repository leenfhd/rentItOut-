const crud = require("./crudController");
const catchAsync = require("../utils/catchAsync");
exports.getProfile = (req, res, next) => {
  req.params.id = req.user.user_id;
  next();
};

exports.getUser = crud.getOne("users");

exports.search = catchAsync(async (req, res, next) => {
  const query = req.query;

  // Use await since findOneByParam is an asynchronous function
  const user = await crud.findOneByParam("users", query);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
