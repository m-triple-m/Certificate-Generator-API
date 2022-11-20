module.exports = {
  miniProjectLetter: (
    studentName,
    project,
    technology,
    duration,
    textFont,
    boldFont,
    startX,
    pageDim,
    gender
  ) => {
    return [
      {
        text: `This is to inform you that`,
        font: textFont,
        type: "normal",
      },
      {
        text: studentName,
        font: boldFont,
        type: "bold",
      },
      {
        text: `has completed summer internship from Digipodium. Details are as follow:\n`,
        font: textFont,
        type: "normal",
      },
      {
        text: `\nProject`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `: ${project}`,
        font: boldFont,
        type: "bold",
        setX: pageDim.width / 3,
      },
      {
        text: `\nTechnology`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `: ${technology}`,
        font: boldFont,
        type: "bold",
        setX: pageDim.width / 3,
      },
      {
        text: `\nDuration`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `: ${duration}`,
        font: boldFont,
        type: "bold",
        setX: pageDim.width / 3,
      },
      {
        text: `\n\nFor any further details please contact the undersigned.`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `\n\nRegards,`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `\n\n\n\nDirector,`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `\nDigipodium,`,
        font: textFont,
        type: "normal",
        setX: startX,
        setLineHeight: 15,
      },
    ];
  },
  internshipLetter: ({
    studentName,
    project,
    technology,
    duration,
    textFont,
    boldFont,
    startX,
    pageDim
  }) => {
    return [
      {
        text: `This is to inform you that`,
        font: textFont,
        type: "normal",
      },
      {
        text: studentName,
        font: boldFont,
        type: "bold",
      },
      {
        text: `has completed his training. The project using MERN Stack Development was done under the guidance and supervision of Mr. Mohammad Mubassir from Feb'22 - Apr'22.\n`,
        font: textFont,
        type: "normal",
      },
      {
        text: `\nProject`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `: ${project}`,
        font: boldFont,
        type: "bold",
        setX: pageDim.width / 3,
      },
      {
        text: `\nTechnology`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `: ${technology}`,
        font: boldFont,
        type: "bold",
        setX: pageDim.width / 3,
      },
      {
        text: `\nDuration`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `: ${duration}`,
        font: boldFont,
        type: "bold",
        setX: pageDim.width / 3,
      },
      {
        text: `\n\nRegards,`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `\n\n\n\nCoordinator,`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `\nDigipodium,`,
        font: textFont,
        type: "normal",
        setX: startX,
        setLineHeight: 15,
      },
    ];
  },
  majorProjectLetter: ({
    studentName,
    project,
    technology,
    duration,
    trainer,
    textFont,
    boldFont,
    startX,
    pageDim
  }) => {
    return [
      {
        text: `This is to certify that`,
        font: textFont,
        type: "normal",
      },
      {
        text: `${studentName}`,
        font: boldFont,
        type: "bold",
      },
      {
        text: `has completed the major project titled`,
        font: textFont,
        type: "normal",
      },
      {
        text: `"${project}"`,
        font: boldFont,
        type: "bold",
      },
      {
        text: `as a part of Internship Program in our Organisation.\n`,
        font: textFont,
        type: "normal",
      },
      {
        text: `\nThe Project using ${technology} was done under the guidance and supervision of ${trainer} from ${duration}.\n`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `\nThe student has completed the assigned project well within the time frame and the performance and conduct during the project was found good.\n`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `\n\nA technically sound project has been developed for one of our clients.\n`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `\n\nRegards,`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `\n\n\n\nCoordinator,`,
        font: textFont,
        type: "normal",
        setX: startX,
      },
      {
        text: `\nDigipodium,`,
        font: textFont,
        type: "normal",
        setX: startX,
        setLineHeight: 15,
      },
    ];
  },
};