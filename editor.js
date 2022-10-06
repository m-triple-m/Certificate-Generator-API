const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const fs = require("fs");

const [startX, startY] = [60, 230];
const LINEHEIGHT = 30;
let totalHeight = LINEHEIGHT * 2;
const FONT_SIZE = 15;
const studentName = "Mohammad Mubassir";
const project = "Mini Project Name";
const technology = "MERN Stack Development";
const duration = `May'22 - Jul'22`;
const cursorPos = { x: startX, y: startY };

const MAXWORDS = 90;
let charPerLine = 0;
let pageDim = {};

const modify = async () => {
  // const textFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const [page, pdfDoc] = await initPage(
    "./static/templates/letter_template2.pdf"
  );
  pageDim = page.getSize();
  // console.log(startX, startY);

  const textFont = await initFont(pdfDoc, "Garamond.ttf");
  const boldFont = await initFont(pdfDoc, "Garamond-Bold.ttf");

  let paragraphText1 = [
    {
      text: `This is to inform you that `,
      font: textFont,
      type: "normal",
    },
    {
      text: studentName,
      font: boldFont,
      type: "bold",
    },
    {
      text: ` has completed his training.\n`,
      font: textFont,
      type: "normal",
    },
    {
      text: `Details are as follows:\n`,
      font: textFont,
      type: "normal",
    },
    {
      text: `\nProject`,
      font: textFont,
      type: "normal",
    },
    {
      text: `: ${project}`,
      font: boldFont,
      type: "bold",
      setX: pageDim.width/3,
    },
    {
      text: `\nTechnology`,
      font: textFont,
      type: "normal",
    },
    {
      text: `: ${technology}`,
      font: boldFont,
      type: "bold",
      setX: pageDim.width/3,
    },
    {
      text: `\nDuration`,
      font: textFont,
      type: "normal",
    },
    {
      text: `: ${duration}`,
      font: boldFont,
      type: "bold",
      setX: pageDim.width/3,
    },
    {
      text: `\n\nRegards,`,
      font: textFont,
      type: "normal"
    },
    {
      text: `\n\n\n\nCoordinator,`,
      font: textFont,
      type: "normal"
    },
    {
      text: `\nDigipodium,`,
      font: textFont,
      type: "normal",
      setLineHeight: 15
    },
  ];

  // let bottomText+='\nFor any further details please contact the undersigned.'

  printLines(page, paragraphText1);

  let detailText = [
    
  ];
  // printLines(
  //   page,
  //   detailText,
  //   cursorPos.x,
  //   height - (totalHeight + cursorPos.y)
  // );
  // printLines(page, detailText, width/3, height - (totalHeight + 230), boldFont);

  await saveFile(pdfDoc, "nice.pdf");
};

const initFont = async (pdfDoc, file) => {
  const garamond = fs.readFileSync(`./fonts/${file}`);
  const textFont = await pdfDoc.embedFont(garamond);
  return textFont;
};

const initPage = async (path) => {
  // const url = "./static/templates/letter_template2.pdf";
  // const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
  const existingPdfBytes = fs.readFileSync(path);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const pages = pdfDoc.getPages();
  // console.log(pages);
  return [pages[0], pdfDoc];
};

const getTabSpaces = (text, totalChars) => {
  const spaces = totalChars - text.length;
  let tab = "";
  for (let i = 0; i < spaces; i++) {
    tab += " ";
  }
  return tab;
};

const printLines = (page, textArray, color = rgb(0, 0, 0)) => {
  // console.log(text.split('\n'));
  // text.split("\n").forEach((line) => {
  //   cursorPos.y+=LINEHEIGHT;
  // });

  let currentLine = '';
  textArray.forEach((line) => {
    let textToDraw = addNewLines(line.text);
    
    console.log(textToDraw.split("\n").length);
    
    console.log(cursorPos);
    page.drawText(textToDraw, {
      x: (line.setX ? line.setX : cursorPos.x),
      y: pageDim.height - cursorPos.y,
      size: FONT_SIZE,
      lineHeight: (line.setLineHeight ? line.setLineHeight : LINEHEIGHT),
      font: line.font,
      color,
    });
    cursorPos.x += line.text.length * (line.type == "normal" ? 6 : 8);
    if(line.text.split('\n').length>1 || line.setX){
      cursorPos.x = startX;
    }
    cursorPos.y += (textToDraw.split("\n").length - 1) * LINEHEIGHT;
  });
  // console.log(currentLine.split("\n").length);
};

const addNewLines = (text) => {
  // const text = document.getElementById("text").value;
  // console.log(text);
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word, i) => {
    if (line.length + word.length + charPerLine <= MAXWORDS) {
      // console.log(line.length + word.length + charPerLine);
      line += word + " ";
      if (i > 1) charPerLine += word.length + 1;
    } else {
      console.log(word);
      // console.log(line.length + word.length + charPerLine);
      lines.push(line);
      line = word + " ";
      charPerLine = word.length + 1;
      totalHeight += LINEHEIGHT;
    }
  });
  lines.push(line);
  charPerLine = 0;
  // document.getElementById("text").value = lines.join("\n");
  // console.log(lines.join("\n"));
  return lines.join("\n");
};

const saveByteArray = (reportName, byte) => {
  var blob = new Blob([byte], { type: "application/pdf" });
  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  var fileName = reportName;
  link.download = fileName;
  link.click();
};

const saveFile = async (doc, filename) => {
  const pdfBytes = await doc.save();
  fs.writeFile(`./static/generatedPDF/${filename}`, pdfBytes, (err) => {
    if (err) throw err;
    console.log("It's saved!");
  });
};

modify();
