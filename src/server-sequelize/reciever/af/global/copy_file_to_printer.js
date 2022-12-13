const fs = require("fs");
module.exports = async (db, params) => {
  fs.copyFile(
    params.FilePath,
    `\\\\SHABANANEW\\share\\printer\\outputs\\${params.ArchiveNum}-${params.SequenceNum}.png`,
    err => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        // Get the current filenames
        // after the function

        console.log(
          "\nFile Contents of copied_file:",
          fs.readFileSync(
            `\\\\SHABANANEW\\share\\printer\\outputs\\${params.ArchiveNum}-${params.SequenceNum}.png`
          )
        );
      }
    }
  );
  return `\\\\SHABANANEW\\share\\printer\\outputs\\${params.ArchiveNum}-${params.SequenceNum}.png`;
};
