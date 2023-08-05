const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // Get the file name without extension
    const fileNameWithoutExtension = path
      .basename(file.originalname, path.extname(file.originalname))
      .toLowerCase()
      .split(" ")
      .join("-");

    cb(
      null,
      fileNameWithoutExtension +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [".jpg", ".jpeg", ".png"];

  // Check if the file extension is in the allowed list
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error(
        "Invalid file type. Only images with extensions .jpg, .jpeg, .png, and .gif are allowed."
      )
    );
  }
};

const uploadPicture = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024, // 1 MB limit
    files: 1, // Limiting to one file per request
  },
});

module.exports = uploadPicture;
