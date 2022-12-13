let XLSX = require("xlsx-color");

function ec(r, c) {
  return XLSX.utils.encode_cell({ r: r, c: c });
}
function delete_row(ws, row_index) {
  var variable = XLSX.utils.decode_range(ws["!ref"]);
  for (var R = row_index; R < variable.e.r; ++R) {
    for (var C = variable.s.c; C <= variable.e.c; ++C) {
      ws[ec(R, C)] = ws[ec(R + 1, C)];
    }
  }
  variable.e.r--;
  ws["!ref"] = XLSX.utils.encode_range(variable.s, variable.e);
}

module.exports = async (db, params) => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  let path = require("path"),
    executablePath = `${__dirname}\\${
      isDevelopment ? "..\\" : "..\\..\\..\\..\\"
    }printer\\outputs\\${params.filename}.XLSX`,
    wb = XLSX.utils.book_new(),
    ws = XLSX.utils.json_to_sheet(params.data, {
      // header: params.excelHeaders
    });

  wb.Workbook = {
    Views: [
      {
        RTL: true
      }
    ]
  };
  let coulumnsWidth = [];
  let coulumnshight = [];

  for (let i = 0; i < params.excelHeaders.length; i++) {
    coulumnsWidth.push({
      width: 50
    });
  }
  for (let i = 0; i < XLSX.utils.decode_range(ws["!ref"]).e.r + 1; i++) {
    coulumnshight.push({
      hpx: 30
    });
  }

  ws["!cols"] = coulumnsWidth;
  ws["!rows"] = coulumnshight;

  delete_row(ws, 0);

  /* merge cells A1:B1 */
  // const merge = [
  //   { s: { r: 1, c: 0 }, e: { r: 2, c: 0 } },{ s: { r: 3, c: 0 }, e: { r: 4, c: 0 } },
  // ];
  // ws["!merges"] = merge;
  //var merge = XLSX.utils.decode_range("A1:B1"); // this is equivalent

  /* generate worksheet */

  /* add merges */
  // if (!ws["!merges"]) ws["!merges"] = [];
  // ws["!merges"].push(merge);

  Object.keys(ws).forEach(key => {
    // if (params.excelHeaders.indexOf(ws[key].v) > -1) {
    //   ws[key].v = "";
    //   delete ws[key];
    //   return;
    // }

    ws[key].s = {
      fill: {
        patternType: "Solid",
        fgColor: { rgb: "eeeeee" },
        bgColor: { rgb: "eeeeee" }
      },
      font: {
        name: "Times New Roman",
        sz: 12,
        color: "333333"
      },
      border: {
        top: { style: "thin", color: { auto: 0.5 } },
        right: { style: "thin", color: { auto: 0.5 } }
      },
      alignment: {
        vertical: "center",
        horizontal: "center",
        wrapText: "1"
      }
    };
  });

  XLSX.utils.book_append_sheet(wb, ws, "sheet1");
  XLSX.writeFile(
    wb,
    path.resolve(
      __dirname,
      `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
        params.filename
      }.XLSX`
    )
  );
  return {
    file: executablePath,
    folder: executablePath.replace(`${params.filename}.XLSX`, "")
  };
};
