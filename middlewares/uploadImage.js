const ErrorHandler = require("../utils/errorHandler");
const { cloudinaryUpload } = require("../utils/cloud");
const catchAsyncError = require("../utils/catchAsyncError");

exports.uploadImage = catchAsyncError(async (req, res, next) => {
  console.log({ body: req.body });
  const file = req.file;
  if (!file) return next(new ErrorHandler("Invalid Image", 400));

  const results = await cloudinaryUpload(file);
  res.status(200).send(results);
});
