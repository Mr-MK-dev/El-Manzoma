module.exports = async (db, params) => {
  try {
    console.log(params.path);
    let fs = require("fs"),
      img = fs.readFileSync(params.path, "base64"),
      finalImg = `data:image/png;base64,${img}`;
    return finalImg;
  } catch (e) {
    return "";
  }
};
