const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const fs = require("fs");

const formats = require('./formats');

const [startX, startY] = [60, 230];
const LINEHEIGHT = 25;
let totalHeight = LINEHEIGHT * 2;
const FONT_SIZE = 15;
const studentName = "Mohammad Akram Khan";
const project = "Mini Project Name";
const technology = "MERN Stack Development";
const duration = `May'22 - Jul'22`;
const trainer = `Mr. Mohammad Mubassir`;
const gender = `male`;
let cursorPos = { x: startX, y: startY };
let cursorInc = { x: startX, y: startY };

const MAXWORDS = 520;
let charPerLine = 0;
let pageDim = {};

const modify = async () => {
  // const textFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const [page, pdfDoc] = await initPage(
    "./static/templates/Letter_Head_Blank.pdf"
  );
  pageDim = page.getSize();
  // console.log(startX, startY);

  const textFont = await initFont(pdfDoc, "Garamond-Regular.ttf");
  const boldFont = await initFont(pdfDoc, "Garamond-Bold.ttf");
    // console.log(pageDim);
  let paragraphText1 = formats.miniProjectLetter(studentName, project, technology, duration, textFont, boldFont, startX, pageDim, gender);
  // let paragraphText1 = formats.internshipLetter({studentName, project, technology, duration, textFont, boldFont, startX, pageDim});
  // let paragraphText1 = formats.majorProjectLetter({studentName, project, technology, duration, trainer, textFont, boldFont, startX, pageDim});

  // let bottomText+='\nFor any further details please contact the undersigned.'
  // console.log(cursorPos);

  printLines(page, paragraphText1);
  // console.log(`Total Height: ${totalHeight}`);
  // return;
  drawImage(pdfDoc, page, './static/templates/sign.jpg', startX-30, pageDim.height - cursorPos.y + (LINEHEIGHT*1), 0.3)

  let detailText = [];
  // printLines(
  //   page,
  //   detailText,
  //   cursorPos.x,
  //   height - (totalHeight + cursorPos.y)
  // );
  // printLines(page, detailText, width/3, height - (totalHeight + 230), boldFont);

  await saveFile(pdfDoc, "nice2.pdf");
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
  //   cursorPos.y += LINEHEIGHT;
  // });

  let currentLine = "";
  textArray.forEach((line) => {
    let textToDraw = addNewLines(line.text, line.font, line.setX);
    // console.log(cursorPos);
    let text = "";
    console.log(textToDraw);
    // console.log(cursorPos);
    for (let i = 0; i < textToDraw.length; i++) {
      text = textToDraw[i];
      
      if(i==0 && line.setX){
        cursorPos.x = line.setX;
      }
      if(i>0){
        cursorPos.x = line.setX ? line.setX : startX;
        // console.log(cursorPos)
      }
      // console.log(cursorPos.x);
      page.drawText(text, {
        x: cursorPos.x,
        y: pageDim.height - cursorPos.y,
        size: FONT_SIZE,
        lineHeight: line.setLineHeight ? line.setLineHeight : LINEHEIGHT,
        font: line.font,
        color,
      });
      cursorPos.x += line.font.widthOfTextAtSize(text, FONT_SIZE);
      
      // cursorPos.x += line.text.length * (line.type == "normal" ? 6 : 8);
      // cursorPos.y = cursorInc.y;
      // console.log(cursorPos);
      
      // console.log(text.split("\n").length);
      // cursorPos.y += (textToDraw.split("\n").length - 1) * LINEHEIGHT;
      cursorPos.y += (text.split("\n").length -1) * LINEHEIGHT;
    }
    // cursorPos = {...cursorInc};
  });
  // console.log(currentLine.split("\n").length);
};

const drawImage = async ( pdfDoc, page, path, x, y, scale) => {
  const img = fs.readFileSync(path);
  const jpgImage = await pdfDoc.embedJpg(img);
  const jpgDims = jpgImage.scale(1);
  page.drawImage(jpgImage, {
    x: x,
    y: y,
    width: jpgDims.width * scale,
    height: jpgDims.height *scale ,
  })
}

const addNewLines2 = (text) => {
  // const text = document.getElementById("text").value;
  // console.log(text);
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word, i) => {
    
    // console.log(`charPerLine : ${charPerLine}`);
    // console.log(`totalLength : ${line.length + word.length + charPerLine}`);

    if (line.length + word.length + charPerLine <= MAXWORDS) {
      // console.log(line.length + word.length + charPerLine);
      line += word + " ";
      // if (i > 1)
      charPerLine += word.length + 1;
    } else {
      // console.log(word);
      // console.log(line.length + word.length + charPerLine);
      // if(lines.length >=1)
      //   lines.push('\n'+line);
      // else
      // console.log('limit reached');
        lines.push(line);
        line = word + " ";
      charPerLine = word.length + 1;
      totalHeight += LINEHEIGHT;
    }
  });
  if(lines.length >=1)
    lines.push('\n'+line);
  else
    lines.push(line);
  // charPerLine = 0;
  // document.getElementById("text").value = lines.join("\n");
  // console.log(lines.join("\n"));
  // return lines.join("\n");
  return lines;
};

const addNewLines = (text, font, setX) => {
  let words = text.split(" ");
  line = '';
  lines = [];
  singleLine = true;
  if(setX) cursorInc.x = 0;
  
  words.forEach((word, i) => {
    // console.log(word+" - "+cursorInc.x);
    // console.log(word);
    // let textWidth = font.widthOfTextAtSize(text, FONT_SIZE);
    if(cursorInc.x+font.widthOfTextAtSize(word+' ', FONT_SIZE) > MAXWORDS){
      console.log('cursor to next '+cursorInc.x+' , '+word.length);
      cursorInc.x = setX? setX : startX+font.widthOfTextAtSize(word+' ', FONT_SIZE);
      cursorInc.y += LINEHEIGHT;
      // charPerLine = 0;
      console.log(line+word);
      lines.push(line+word+'\n')
      line='';
      singleLine = false;
      
    }else{
      // charPerLine+=word.length+1
      cursorInc.x +=font.widthOfTextAtSize(word+' ', FONT_SIZE);
      line+=word+' '
    }
  })
  lines.push(line);
  return lines;
}

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
