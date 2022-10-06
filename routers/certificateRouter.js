const express = require("express");
const PDFGenerator = require("./generator");
const router = express.Router();
const templateModel = require("../models/templateModel");

const JSZip = require("jszip");
const fs = require("fs");

const makeZip = (cb, pathToFiles = "./static/generatedPDF") => {
  const zip = new JSZip();
  try {
    zip.folder("Minor_Project_Certificates");

    fs.readdirSync(pathToFiles).forEach((pdFile) => {
      console.log(pdFile);
      zip.file(pdFile, fs.readFileSync(`${pathToFiles}/${pdFile}`));
    });

    zip
      .generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(
        fs.createWriteStream(
          `./static/generatedPDF/Minor_Project_Certificates.zip`
        )
      )
      .on("finish", cb);
  } catch (err) {
    console.error(err);
  }
};

router.post("/generate", async (req, res) => {
  // console.log(req.body);
  const {sheetData, template_id} = req.body;
  const template = await templateModel.findById(template_id);
  console.log(sheetData);
  const studentData = sheetData.slice(1);
  const zip = new JSZip();
  try {
    for (let student of studentData) {
      let pdfGenerator = new PDFGenerator(template.file);

      zip.folder("Minor_Project_Certificates");
      const pdfData = await pdfGenerator.modify({
        studentName: student[2],
        technology: student[3],
        duration: student[4],
        project: student[6],
      });
      zip.file(
        `Minor_Project_Certificates/${student[2]
          .trim()
          .replaceAll(" ", "_")}.pdf`,
        pdfData
      );
    }

    zip
      .generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(
        fs.createWriteStream(
          `./static/generatedPDF/Minor_Project_Certificates.zip`
        )
      )
      .on("finish", () => {
        console.log("zipped!!");
        res.json({
          status: "success",
          zipFile: "Minor_Project_Certificates.zip",
        });
      });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
