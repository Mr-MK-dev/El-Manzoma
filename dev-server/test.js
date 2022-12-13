const tes = require("./ons/militaryweb/noncom");
const { PDFExtract } = require("pdf.js-extract");
let getNonComData = require("./ons/militaryweb/soldiers");

const fs = require("fs");

const buf = fs.readFileSync("./4.pdf");

const extract = new PDFExtract();
extract.extractBuffer(buf, {}).then(data => {
  let x = getNonComData(data.pages);
  console.log(x);
});
