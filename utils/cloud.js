const cloudinary = require('cloudinary').v2;
const multer = require("multer");
const path = require('path');

exports.cloudinaryUpload = (file) => {
  console.log({ file });
  const params = {
    width: 500,
    height: 500,
    gravity: 'auto',
    crop: 'fill',
    folder: 'devTown',
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    public_id: `${Date.now()}-${path.parse(file.originalname).name}`
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy()
    cloudinary.uploader.upload_stream(params, (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        console.log({ result });
        resolve(result.secure_url);
      }
    }).end(file.buffer);
  })
  // for deleting from cloudinary
  // cloudinary.uploader.destroy(cloudinary_id) 
};

// const storage = multer.diskStorage({});
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log({ file, mimetype: file.mimetype });
  if (file.mimetype.split("/")[0] === "image") {
    req.video_file = false;
    cb(null, true);
  } else if (file.mimetype.split("/")[0] === "application") {
    req.video_file = false;
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 11006600, files: 5 },
});

