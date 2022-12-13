const fs = require("fs");
module.exports = async (db, params) => {
  fs.unlink(
    params.FilePath,
    err => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        // Get the current filenames
        // after the function
      }
    }
  );
  return true;
};
