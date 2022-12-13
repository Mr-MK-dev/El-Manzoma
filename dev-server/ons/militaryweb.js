module.exports = async params => {
  let con = params.con,
    io = params.io;
  let fs = require("fs");
  const { PDFExtract } = require("pdf.js-extract");
  let getMyNationalId = function(buffer) {
    const extract = new PDFExtract();
    extract
      .extractBuffer(buffer, {})
      .then(data => {
        let nid = data.pages[0].content[84].str;
        return nid;
      })
      .catch(err => {
        return err;
      });
  };

  con.on("reconstruct-pdf", () => {
    let page = require("./files/page.js");
  });

  con.on("edara-pdf", x => {
    console.log("Extracting PDF");
    fs.readFile("./files/def.pdf", (error, buffer) => {
      const extract = new PDFExtract();
      extract
        .extractBuffer(buffer, {})
        .then(data => {
          let p1 = data.pages[135];
          console.log("Done...");
          io.to(con.id).emit("edaraExtracted", p1.content);
          return true;
        })
        .catch(err => {
          return err;
        });
    });
  });

  let { webUnits, arabicNumbers } = require("./militaryweb/vars");
  let {
    is4CharYear,
    fixDateSpaces,
    fixConscripteNumbers,
    getConscriptionPeriodText,
    fixPeriodToDays,
    getNumberFromString,
    onlyNumbers,
    fixNumbers
  } = require("./militaryweb/funcs");

  let getSoldierData = require("./militaryweb/soldiers");

  let getNonComData = require("./militaryweb/noncom");

  // let pdf_table_extractor = require("pdf-table-extractor");
  // let pdf2table = require("pdf2table");
  // const tabula = require("tabula-js");
  // const Tabula = require("fresh-tabula-js");
  // const { PdfReader, TableParser } = require("pdfreader");
  // console.log(extractData());
  // fs.readFile("./test.pdf", function(err, buffer) {
  //   const t = tabula(buffer);
  //   t.extractCsv((err, data) => {
  //     console.log(data);
  //   });
  // });
  // const extractData = async () => {
  //   const table = new Tabula("test.pdf");
  //   return await table.getData();
  // };
  // console.log(extractData());

  // let fixPdfRows = function(rows) {
  //   rows.forEach((row, i) => {
  //     row.forEach((col, ii) => {
  //       let fixedNumber = getNumberFromString(col);
  //       rows[i][ii] =
  //         Number(fixedNumber) == fixedNumber ||
  //         fixedNumber.replace("/", "").includes("/")
  //           ? fixedNumber
  //           : [...fixedNumber].reverse().join("");
  //     });
  //   });
  // Only for units
  // let arr = [];
  // rows.forEach((row, i) => {
  //   if (i == 1) {
  //     arr.push(row[3]);
  //   }
  //   if (i > 1) {
  //     let cols = row.length;
  //     if (cols == 3) {
  //       // Normal Row
  //       arr.push(row[1]);
  //     } else if (cols > 3) {
  //       let str = "";
  //       for (let ii = 1; ii < cols - 1; ii++) {
  //         str += row[ii];
  //       }
  //       arr.push(str);
  //     }
  //   }
  // });
  //   return rows;
  // };

  con.on("getUnitsFromWeb", x => {
    // let data = web_units_1;
    // web_units_2.forEach(unit => {
    //   if (!data.includes(unit)) {
    //     data.push(unit);
    //   }
    // });
    // io.to(con.id).emit("gotUnitsFromWeb", {
    //   data,
    //   error: false
    // });
    // const extract = new PDFExtract();
    fs.readFile("./errors/2001134790989.pdf", (error, buffer) => {
      getMyIdData({
        buffer,
        id: "2001134790989",
        child: ""
      });
    });
    // PdfReader
    // let table = new TableParser();
    // let matrix = {};
    // new PdfReader().parseFileItems("test.pdf", function(err, item) {
    //   if (!item || item.page) {
    //     matrix[item && item.page ? item.page : "0"] = renderMatrix(
    //       table.getMatrix()
    //     );
    //     table = new TableParser();
    //   } else if (item.text) {
    //     table.processItem(item, true);
    //   }
    // });
    // io.to(con.id).emit("gotUnitsFromWeb", {
    //   data: matrix,
    //   error: false
    // });
    // Fresh
    // const t = new Tabula("./testc2.pdf", {});
    // console.log("Started");
    // let data = await t.extractCsv();
    // console.log(data);
    // io.to(con.id).emit("gotUnitsFromWeb", {
    //   data: data.output,
    //   error: data.error
    // });
    // Tabula noraml
    // const t = tabula("./testc2.pdf", {});
    // console.log("Started");
    // t.extractCsv((err, data) => {
    //   console.log(data);
    //   console.log(err);
    //   io.to(con.id).emit("gotUnitsFromWeb", {
    //     data: data,
    //     error: err
    //   });
    // });
    // t.extractCsv((err, data) => {
    //   console.log(data);
    //   console.log(err);
    // });
    // fs.readFile("./test.pdf", function(error, buffer) {
    // });
    // t.extractCsv((err, data) => {
    //   io.to(con.id).emit("gotUnitsFromWeb", {
    //     data: data,
    //     error: err
    //   });
    // });
    // table
    //   .getData()
    //   .then(xx => {
    //     io.to(con.id).emit("gotUnitsFromWeb", {
    //       data: xx,
    //       error: false
    //     });
    //   })
    //   .catch(err => {
    //     io.to(con.id).emit("gotUnitsFromWeb", {
    //       data: [],
    //       error: err
    //     });
    //   });
    // fs.readFile("./test.pdf", function(err, buffer) {
    //   if (err) {
    //     io.to(con.id).emit("gotUnitsFromWeb", {
    //       data: [],
    //       error: err
    //     });
    //   } else {
    //     pdf2table.parse(buffer, function(err, rows, rowsdebug) {
    //       if (err) {
    //         io.to(con.id).emit("gotUnitsFromWeb", {
    //           data: [],
    //           error: err
    //         });
    //       } else {
    //         io.to(con.id).emit("gotUnitsFromWeb", {
    //           data: rowsdebug,
    //           error: false
    //         });
    //       }
    //     });
    //   }
    // });
    // pdf_table_extractor(
    //   "test.pdf",
    //   result => {
    // io.to(con.id).emit("gotUnitsFromWeb", {
    //   data: JSON.stringify(result),
    //   error: false
    // });
    //   },
    //   error => {
    //     io.to(con.id).emit("gotUnitsFromWeb", {
    //       data: [],
    //       error: error
    //     });
    //   }
    // );
  });

  con.on("getUnitsForceList", x => {
    const extract = new PDFExtract();
    extract
      .extractBuffer(x.buffer, {})
      .then(data => {
        let all_ids = [],
          all_cons = [];
        data.pages.forEach((page, i) => {
          let strings = page.content.map(c => c.str),
            ids = [],
            // all conscriptes in this page
            cons = [];
          strings.forEach((str, i) => {
            if (
              str.length == 9 &&
              strings[i + 1].length == 4 &&
              onlyNumbers(str) &&
              onlyNumbers(strings[i + 1])
            ) {
              let id = str + strings[i + 1];
              ids.push(id);
            } else if (str.length == 13 && onlyNumbers(str)) {
              // militaryId
              let id = fixNumbers(str);
              ids.push(id);

              // get Conscripte
              let fullName = [];
              for (let j = 1; j < 5; j++) {
                if (["بالخدمة", "هارب", "إجراءات إنهاء خدمة"].includes(strings[i - j])) {
                  // remove the degree
                  fullName.pop();
                  break;
                } else {
                  fullName.push(strings[i - j]);
                }
              }
              cons.push({
                fullName: fullName.reverse().join(" "),
                militaryId: id
              });
            }
          });
          all_ids = [...all_ids, ...ids];
          all_cons = [...all_cons, ...cons];
        });

        io.to(con.id).emit("gotUnitsForceList", {
          list: all_ids, // data.pages[0]
          cons: all_cons,
          error: false
        });
      })
      .catch(err => {
        io.to(con.id).emit("gotUnitsForceList", {
          list: [],
          error: err.message
        });
      });
  });

  let successConscriptes = 0,
    errorConscriptes = 0;

  let getMyIdData = function(x) {
    const extract = new PDFExtract();
    extract
      .extractBuffer(x.buffer, {})
      .then(data => {
        let title = data.pages[0].content.filter(c =>
          c.str.includes("السجل الاساسي")
        )[0].str;
        let isSoldier = title.includes("للمجندين") || title.includes("للجنود"),
          conscripte = isSoldier
            ? getSoldierData(data.pages)
            : getNonComData(data.pages),
          periods = [
            "webClearServicePeriod",
            "webLostPeriod",
            "webServicePeriod"
          ];
        conscripte.isSoldier = isSoldier;
        conscripte.webAt = new Date();
        conscripte = fixConscripteNumbers(conscripte);
        conscripte.periodText = getConscriptionPeriodText(
          conscripte.webConscriptionDate
        );
        periods.forEach(period => {
          conscripte[period] = fixPeriodToDays(conscripte[period]);
        });
        successConscriptes += 1;
        console.log(
          `Success: ${successConscriptes}; ${x.id}, Child: ${x.child}`
        );
        // console.log(conscripte);
        io.to(con.id).emit(`gotMyIdData${x.child}`, {
          data: conscripte,
          id: x.id,
          error: false
        });
        let intVal = setInterval(() => {
          data = null;
          x.buffer = null;
          clearInterval(intVal);
        }, 2000);
      })
      .catch(err => {
        console.log(err);
        errorConscriptes += 1;
        console.log(`Error: ${errorConscriptes}; ${x.id}`);
        io.to(con.id).emit(`gotMyIdData${x.child}`, {
          data: {},
          id: x.id,
          error: err.message
        });
      });
  };

  con.on("getMyIdData", x => {
    getMyIdData(x);
  });

  con.on("getMyNid", x => {
    const extract = new PDFExtract();
    extract
      .extractBuffer(x.buffer, {})
      .then(data => {
        // let nid = data.pages[0].content[84].str;
        // let nid = data.pages[0].content.find(
        //   c =>
        //     c.str.length == 14 &&
        //     ((c.x == "110.93" && c.y == "410.65999999999997") ||
        //       (c.x == "110.93" && c.y == "420.65999999999997"))
        // );
        let nid_index = data.pages[0].content.findIndex(
            c => c.str == "بيانات بطاقة الرقم القومي"
          ),
          nid = data.pages[0].content[nid_index + 1].str,
          isCorrect = nid.length == 14 || nid.length == 7 ? true : false;
        // console.log("Start: " + x.id);
        // console.log(data.pages[0].content);
        // console.log(nid);
        // console.log("End: " + x.id);
        io.to(con.id).emit("getMyNid", {
          nid: isCorrect ? nid : "no_nid",
          mid: x.id,
          error: isCorrect ? false : "no_nid"
        });
      })
      .catch(err => {
        io.to(con.id).emit("getMyNid", {
          mid: x.id,
          error: err
        });
      });
  });
};
