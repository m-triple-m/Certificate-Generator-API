const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const fs = require("fs");

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

    this.MAXWORDS = 100;
    this.charPerLine = 0;
    this.pageDim = {};
    this.template = template;
  }

  modify = async (certiData, output = "nice.pdf") => {
    // const textFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    await this.initPage(`./static/templates/${this.template}`);
    this.pageDim = this.page.getSize();
    // console.log(startX, startY);

    this.textFont = await this.initFont("Garamond.ttf");
    this.boldFont = await this.initFont("Garamond-Bold.ttf");

    let paragraphText1 = [
      {
        text: `This is to inform you that `,
        font: this.textFont,
        type: "normal",
      },
      {
        text: certiData.studentName,
        font: this.boldFont,
        type: "bold",
      },
      {
        text: ` has completed his training.\n`,
        font: this.textFont,
        type: "normal",
      },
      {
        text: `Details are as follows:\n`,
        font: this.textFont,
        type: "normal",
        setX: this.startX,
      },
      {
        text: `\nProject`,
        font: this.textFont,
        type: "normal",
        setX: this.startX,
      },
      {
        text: `: ${certiData.project}`,
        font: this.boldFont,
        type: "bold",
        setX: this.pageDim.width / 3,
      },
      {
        text: `\nTechnology`,
        font: this.textFont,
        type: "normal",
        setX: this.startX,
      },
      {
        text: `: ${certiData.technology}`,
        font: this.boldFont,
        type: "bold",
        setX: this.pageDim.width / 3,
      },
      {
        text: `\nDuration`,
        font: this.textFont,
        type: "normal",
        setX: this.startX,
      },
      {
        text: `: ${certiData.duration}`,
        font: this.boldFont,
        type: "bold",
        setX: this.pageDim.width / 3,
      },
      {
        text: `\n\nRegards,`,
        font: this.textFont,
        type: "normal",
        setX: this.startX,
      },
      {
        text: `\n\n\n\nCoordinator,`,
        font: this.textFont,
        type: "normal",
        setX: this.startX,
      },
      {
        text: `\nDigipodium`,
        font: this.textFont,
        type: "normal",
        setLineHeight: 15,
        setX: this.startX,
      },
    ];

    // let bottomText+='\nFor any further details please contact the undersigned.'

    this.printLines(paragraphText1);
    this.drawImage(this.startX-20, this.pageDim.height - this.cursorPos.y + (this.LINEHEIGHT*2) - 10, 0.3)

    let detailText = [];
    // printLines(
    //   page,
    //   detailText,
    //   cursorPos.x,
    //   height - (totalHeight + cursorPos.y)
    // );
    // printLines(page, detailText, width/3, height - (totalHeight + 230), boldFont);

    // return await this.saveFile(this.pdfDoc, `${certiData.studentName.trim().replaceAll(' ', '_')}.pdf`);
    return await this.pdfDoc.save();
  };

  initFont = async (file) => {
    const garamond = fs.readFileSync(`./fonts/${file}`);
    const textFont = await this.pdfDoc.embedFont(garamond);
    return textFont;
  };

  initPage = async (path) => {
    // const url = "./static/templates/letter_template2.pdf";
    // const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
    const existingPdfBytes = fs.readFileSync(path);
    this.pdfDoc = await PDFDocument.load(existingPdfBytes);
    this.pdfDoc.registerFontkit(fontkit);
    this.page = this.pdfDoc.getPages()[0];
    // console.log(pages);
    // return [pages[0], pdfDoc];
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
    // console.log(text.split('\n'));
    // text.split("\n").forEach((line) => {
    //   cursorPos.y+=LINEHEIGHT;
    // });

    textArray.forEach((line) => {
      let textToDraw = this.addNewLines(line.text);
      // console.log(`charPerLine : ${charPerLine}`);
      console.log(textToDraw);
      console.log("\n");
      let text = "";
      // console.log(cursorPos);
      for (let i = 0; i < textToDraw.length; i++) {
        text = textToDraw[i];
        let textWidth = line.font.widthOfTextAtSize(text, this.FONT_SIZE);
        if (i > 0 && !line.setX) {
          this.cursorPos.x = this.startX;
          this.charPerLine = 0;
        } else if (i == 0 && line.setX) {
          this.cursorPos.x = line.setX;
          this.charPerLine = 0;
        }
        this.page.drawText(text, {
          x: line.setX ? line.setX : this.cursorPos.x,
          y: this.pageDim.height - this.cursorPos.y,
          size: this.FONT_SIZE,
          lineHeight: line.setLineHeight ? line.setLineHeight : this.LINEHEIGHT,
          font: line.font,
          color,
        });
        // cursorPos.x += line.text.length * (line.type == "normal" ? 6 : 8);
        this.cursorPos.x += textWidth;

        console.log(text.split("\n").length);
        // cursorPos.y += (textToDraw.split("\n").length - 1) * LINEHEIGHT;
        this.cursorPos.y += (text.split("\n").length - 1 + i) * this.LINEHEIGHT;
      }
    });
    // console.log(currentLine.split("\n").length);
  };

  drawImage = async (x, y, scale, path='./static/templates/sign.jpg') => {
    const img = fs.readFileSync(path);
    const jpgImage = await this.pdfDoc.embedJpg(img);
    const jpgDims = jpgImage.scale(1);
    this.page.drawImage(jpgImage, {
      x: x,
      y: y,
      width: jpgDims.width * scale,
      height: jpgDims.height *scale ,
    })
  }

  addNewLines = (text) => {
    // const text = document.getElementById("text").value;
    // console.log(text);

    const words = text.split(" ");
    const lines = [];
    let line = "";
    words.forEach((word, i) => {
      // console.log(`charPerLine : ${charPerLine}`);
      // console.log(`totalLength : ${line.length + word.length + charPerLine}`);

      if (line.length + word.length + this.charPerLine <= this.MAXWORDS) {
        // console.log(line.length + word.length + charPerLine);
        line += word + " ";
        // if (i > 1)
        this.charPerLine += word.length + 1;
      } else {
        // console.log(word);
        // console.log(line.length + word.length + charPerLine);
        // if(lines.length >=1)
        //   lines.push('\n'+line);
        // else
        console.log("limit reached");
        lines.push(line);
        line = word + " ";
        this.charPerLine = word.length + 1;
        this.totalHeight += this.LINEHEIGHT;
      }
    });
    if (lines.length >= 1) lines.push("\n" + line);
    else lines.push(line);

    // document.getElementById("text").value = lines.join("\n");
    // console.log(lines.join("\n"));
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
