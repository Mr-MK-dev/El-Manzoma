const fs = require("fs");
module.exports = async (db, params) => {
  fs.copyFile(
    params.FilePath,
    `\\\\SHABANANEW\\share\\archiveFiles\\${params.ArchiveNum}-${params.SequenceNum}.png`,
    err => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        // Get the current filenames
        // after the function

        console.log(
          "\nFile Contents of copied_file:",
          fs.readFileSync(
            `\\\\SHABANANEW\\share\\archiveFiles\\${params.ArchiveNum}-${params.SequenceNum}.png`
          )
        );
      }
    }
  );
  return `\\\\SHABANANEW\\share\\archiveFiles\\${params.ArchiveNum}-${params.SequenceNum}.png`;
};
