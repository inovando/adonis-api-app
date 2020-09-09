var fs = require('fs');

const Helpers = use('Helpers');

var fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf',
  },
};

var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);

const makePDf = function (docDefinition) {
  const ts = +new Date();
  const fileName = `${ts}.pdf`;
  const path = Helpers.tmpPath(fileName);

  const doc = printer.createPdfKitDocument(docDefinition);
  doc.pipe(fs.createWriteStream(path));
  doc.end();

  return { fileName };
};

module.exports = { makePDf };
