const fs = require("fs");
const path = require("path");

// Function to remove a file from the file system
const fileRemover = (filename) => {
  if (!filename) {
    // If the filename is not provided or empty, return without doing anything
    return;
  }

  const filePath = path.join("../uploads", filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error removing file:", err);
    } else {
      console.log("File removed successfully:", filename);
    }
  });
};

module.exports = fileRemover;
