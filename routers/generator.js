const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const fs = require("fs");
const formats = require("../formats");

module.exports = class PDFGenerator {
  constructor(template) {
    [this.startX, this.startY] = [60, 230];
    this.LINEHEIGHT = 30;
    this.totalHeight = this.LINEHEIGHT * 2;
    this.FONT_SIZE = 15;
    this.studentName = "Mohammad Mubassir";
    this.project = "Mini Project Name";
    this.technology = "MERN Stack Development";
    this.duration = `May'22 - Jul'22`;
    this.cursorPos = { x: this.startX, y: this.startY };
    this.cursorInc = { x: this.startX, y: this.startY };

    this.MAXWORDS = 500;
    this.charPerLine = 0;
    this.pageDim = {};
    this.template = template;
  }

  modify = async (certiData, output = "nice.pdf") => {
    await this.initPage(`./static/templates/${this.template}`);
    this.pageDim = this.page.getSize();

    this.textFont = await this.initFont("Garamond-Regular.ttf");
    this.boldFont = await this.initFont("Garamond-Bold.ttf");

    // let paragraphText1 = [
    //   {
    //     text: `This is to inform you that `,
    //     font: this.textFont,
    //     type: "normal",
    //   },
    //   {
    //     text: certiData.studentName,
    //     font: this.boldFont,
    //     type: "bold",
    //   },
    //   {
    //     text: ` has completed his training.\n`,
    //     font: this.textFont,
    //     type: "normal",
    //   },
    //   {
    //     text: `Details are as follows:\n`,
    //     font: this.textFont,
    //     type: "normal",
    //     setX: this.startX,
    //   },
    //   {
    //     text: `\nProject`,
    //     font: this.textFont,
    //     type: "normal",
    //     setX: this.startX,
    //   },
    //   {
    //     text: `: ${certiData.project}`,
    //     font: this.boldFont,
    //     type: "bold",
    //     setX: this.pageDim.width / 3,
    //   },
    //   {
    //     text: `\nTechnology`,
    //     font: this.textFont,
    //     type: "normal",
    //     setX: this.startX,
    //   },
    //   {
    //     text: `: ${certiData.technology}`,
    //     font: this.boldFont,
    //     type: "bold",
    //     setX: this.pageDim.width / 3,
    //   },
    //   {
    //     text: `\nDuration`,
    //     font: this.textFont,
    //     type: "normal",
    //     setX: this.startX,
    //   },
    //   {
    //     text: `: ${certiData.duration}`,
    //     font: this.boldFont,
    //     type: "bold",
    //     setX: this.pageDim.width / 3,
    //   },
    //   {
    //     text: `\n\nRegards,`,
    //     font: this.textFont,
    //     type: "normal",
    //     setX: this.startX,
    //   },
    //   {
    //     text: `\n\n\n\nCoordinator,`,
    //     font: this.textFont,
    //     type: "normal",
    //     setX: this.startX,
    //   },
    //   {
    //     text: `\nDigipodium`,
    //     font: this.textFont,
    //     type: "normal",
    //     setLineHeight: 15,
    //     setX: this.startX,
    //   },
    // ];
    let paragraphText1 = formats.miniProjectLetter(
      certiData.studentName,
      certiData.project,
      certiData.technology,
      certiData.duration,
      this.textFont,
      this.boldFont,
      this.startX,
      this.pageDim,
      "male"
    );

    this.printLines(paragraphText1);
    this.drawImage(
      this.startX - 30,
      this.pageDim.height - 20 - this.cursorPos.y + this.LINEHEIGHT * 2,
      0.3
    );

    let detailText = [];

    return await this.pdfDoc.save();
  };

  initFont = async (file) => {
    const garamond = fs.readFileSync(`./fonts/${file}`);
    const textFont = await this.pdfDoc.embedFont(garamond);
    return textFont;
  };

  initPage = async (path) => {
    const existingPdfBytes = fs.readFileSync(path);
    this.pdfDoc = await PDFDocument.load(existingPdfBytes);
    this.pdfDoc.registerFontkit(fontkit);
    this.page = this.pdfDoc.getPages()[0];
  };

  getTabSpaces = (text, totalChars) => {
    const spaces = totalChars - text.length;
    let tab = "";
    for (let i = 0; i < spaces; i++) {
      tab += " ";
    }
    return tab;
  };

  printLines = (textArray, color = rgb(0, 0, 0)) => {
    let currentLine = "";
    textArray.forEach((line) => {
      let textToDraw = this.addNewLines(line.text, line.font, line.setX);
      // console.log(cursorPos);
      let text = "";
      console.log(textToDraw);
      // console.log(cursorPos);
      for (let i = 0; i < textToDraw.length; i++) {
        text = textToDraw[i];

        if (i == 0 && line.setX) {
          this.cursorPos.x = line.setX;
        }
        if (i > 0) {
          this.cursorPos.x = line.setX ? line.setX : this.startX;
          // console.log(cursorPos)
        }
        // console.log(cursorPos.x);
        this.page.drawText(text, {
          x: this.cursorPos.x,
          y: this.pageDim.height - this.cursorPos.y,
          size: this.FONT_SIZE,
          lineHeight: line.setLineHeight ? line.setLineHeight : this.LINEHEIGHT,
          font: line.font,
          color,
        });
        this.cursorPos.x += line.font.widthOfTextAtSize(text, this.FONT_SIZE);

        // cursorPos.x += line.text.length * (line.type == "normal" ? 6 : 8);
        // cursorPos.y = cursorInc.y;
        // console.log(cursorPos);

        // console.log(text.split("\n").length);
        // cursorPos.y += (textToDraw.split("\n").length - 1) * LINEHEIGHT;
        this.cursorPos.y += (text.split("\n").length - 1) * this.LINEHEIGHT;
      }
      // cursorPos = {...cursorInc};
    });
  };

  drawImage = async (x, y, scale, path = "./static/templates/sign.jpg") => {
    const img = fs.readFileSync(path);
    const jpgImage = await this.pdfDoc.embedJpg(img);
    const jpgDims = jpgImage.scale(1);
    this.page.drawImage(jpgImage, {
      x: x,
      y: y,
      width: jpgDims.width * scale,
      height: jpgDims.height * scale,
    });
  };

  addNewLines = (text, font, setX) => {
    let words = text.split(" ");
    let line = "";
    let lines = [];
    let singleLine = true;
    if (setX) this.cursorInc.x = 0;

    words.forEach((word, i) => {
      // console.log(word+" - "+cursorInc.x);
      // console.log(word);
      // let textWidth = font.widthOfTextAtSize(text, FONT_SIZE);
      if (
        this.cursorInc.x + font.widthOfTextAtSize(word + " ", this.FONT_SIZE) >
        this.MAXWORDS
      ) {
        console.log("cursor to next " + this.cursorInc.x + " , " + word.length);
        this.cursorInc.x = setX
          ? setX
          : this.startX + font.widthOfTextAtSize(word + " ", this.FONT_SIZE);
        this.cursorInc.y += this.LINEHEIGHT;
        // charPerLine = 0;
        console.log(line + word);
        lines.push(line + word + "\n");
        line = "";
        singleLine = false;
      } else {
        // charPerLine+=word.length+1
        this.cursorInc.x += font.widthOfTextAtSize(word + " ", this.FONT_SIZE);
        line += word + " ";
      }
    });
    lines.push(line);
    return lines;
  };

  saveFile = async (doc, filename) => {
    const pdfBytes = await doc.save();
    fs.writeFile(`./static/generatedPDF/${filename}`, pdfBytes, (err) => {
      if (err) throw err;
      console.log("It's saved!");
    });
    return `./static/generatedPDF/${filename}`;
  };
};

// let pdf = new PDFGenerator();
// pdf.modify();
