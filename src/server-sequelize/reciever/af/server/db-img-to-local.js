const constants = require("../../../../Constant").default;
module.exports = async (db, params) => {
  let fs = require("fs");
  const isDevelopment = process.env.NODE_ENV !== "production";
  let soldier = await db[params.table].findOne({
    where: {
      ID: params.ID
    },
    attributes: ["image"]
  });

  if (!soldier.image) return false;
  let uniqueId = new Date().getTime(),
    type = soldier.image.split(";")[0].split("/")[1],
    filename = `${params.ID}.png`,
    writablePath = `${constants.imagePath}/${filename}`,
    imageBuffer = Buffer.from(soldier.image, "base64"),
    error = null;
  fs.writeFile(writablePath, imageBuffer, "base64", err => {
    error = err;
  });
  let deleteImage = await db[params.table].update(
    {
      image: writablePath
    },
    {
      where: {
        ID: params.ID
      }
    }
  );
  return error ? false : true;
};
