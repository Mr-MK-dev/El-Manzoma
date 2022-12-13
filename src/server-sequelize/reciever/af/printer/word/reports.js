module.exports = async (db, params) => {
  if (!params.isExcel) {
    const isDevelopment = process.env.NODE_ENV !== "production";

    let PizZip = require("pizzip"),
      Docxtemplater = require("docxtemplater"),
      fs = require("fs"),
      path = require("path");

    if (params.query) {
      let content = fs.readFileSync(
          path.resolve(
            __dirname,
            `${isDevelopment ? "../" : "../../"}printer/inputs/${
              params.query
            }.docx`
          ),
          "binary"
        ),
        zip = new PizZip(content),
        doc;
      try {
        doc = new Docxtemplater(zip, {
          modules: []
        });
      } catch (error) {
        console.log(error);
        return error;
      }
      doc.setData(params.data);
      try {
        doc.render();
      } catch (error) {
        console.log(error);
        return error;
      }
      let buffer = doc.getZip().generate({
        type: "nodebuffer"
      });
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
            params.filename
          }.docx`
        ),
        buffer
      );
      let executablePath = `${__dirname}\\${
        isDevelopment ? "..\\" : "..\\..\\..\\..\\"
      }printer\\outputs\\${params.filename}.docx`;

      const { PDFDocument, PDFRawStream, PDFName } = require("pdf-lib");
      let err;

      try {
        const ext = ".pdf";
        const inputPath = path.join(path.resolve(executablePath));
        const outputPath = path.join(
          path.resolve(
            __dirname,
            `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
              params.filename
            }.docx`
          )
        );
        // libre.convertAsync = require("util").promisify(libre.convert);
        const wordToPdf = require("./docto");

        await wordToPdf(
          path.resolve(
            __dirname,
            `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
              params.filename
            }.docx`
          ),
          path.resolve(
            __dirname,
            `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
              params.filename
            }.pdf`
          ),
          {}
        );

        const contrbuite = await PDFDocument.load(
          fs.readFileSync(
            path.resolve(
              __dirname,
              `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
                params.filename
              }.pdf`
            )
          )
        );
        const jpgImage = await contrbuite.embedPng(params.data.image);
        console.log(contrbuite.getPage(0).getHeight());

        contrbuite.getPage(0).drawImage(jpgImage, {
          width: 180,
          height: 130,
          x: 100,
          y: contrbuite.getPage(0).getHeight() - 250
        });

        fs.writeFileSync(
          path.resolve(
            __dirname,
            `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
              params.filename
            }.pdf`
          ),
          await contrbuite.save()
        );
      } catch (error) {
        err = error;
        console.log(error);

        try {
          const ext = ".pdf";
          const inputPath = path.join(path.resolve(executablePath));
          const outputPath = path.join(
            path.resolve(
              __dirname,
              `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
                params.filename
              }.docx`
            )
          );
          // libre.convertAsync = require("util").promisify(libre.convert);
          const wordToPdf = require("./docto");

          await wordToPdf(
            path.resolve(
              __dirname,
              `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
                params.filename
              }.docx`
            ),
            path.resolve(
              __dirname,
              `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
                params.filename
              }.pdf`
            ),
            {}
          );

          const contrbuite = await PDFDocument.load(
            fs.readFileSync(
              path.resolve(
                __dirname,
                `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
                  params.filename
                }.pdf`
              )
            )
          );
          const jpgImage = await contrbuite.embedJpg(params.data.image);
          console.log(contrbuite.getPage(0).getHeight());
          contrbuite.getPage(0).drawImage(jpgImage, {
            width: 180,
            height: 130,
            x: 100,
            y: contrbuite.getPage(0).getHeight() - 250
          });

          fs.writeFileSync(
            path.resolve(
              __dirname,
              `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
                params.filename
              }.pdf`
            ),
            await contrbuite.save()
          );
        } catch (error) {
          err = error;
          console.log(error);
        }
      }
      let executablePathPDF = executablePath.replace(".docx", ".pdf");

      return {
        file: executablePath,
        pdfFile: executablePathPDF,
        folder: executablePathPDF.replace(`${params.filename}.pdf`, ""),
        err
      };
    }
  } else {
    const isDevelopment = process.env.NODE_ENV !== "production";
    var XlsxTemplate = require("./template-parser"),
      fs = require("fs"),
      path = require("path");
    let content = fs.readFileSync(
      path.resolve(
        __dirname,
        `${isDevelopment ? "../" : "../../"}printer/inputs/${params.query}.xlsx`
      ),
      "binary"
    );
    // Create a template
    var template = new XlsxTemplate(content);

    // Replacements take place on first sheet
    var sheetNumber = 1;

    // Perform substitution
    template.substitute(sheetNumber, params.data);

    // Get binary data
    var data = template.generate({ type: "uint8array" });

    fs.writeFileSync(
      path.resolve(
        __dirname,
        `${isDevelopment ? "../" : "../../../../"}printer/outputs/${
          params.filename
        }.xlsx`
      ),
      data
    );
    let executablePath = `${__dirname}\\${
      isDevelopment ? "..\\" : "..\\..\\..\\..\\"
    }printer\\outputs\\${params.filename}.xlsx`;

    return {
      file: executablePath,
      folder: executablePath.replace(`${params.filename}.xlsx`, "")
    };
    return;
  }
  return;
};
