import pdfParse = require('pdf-parse');

async function test() {
  console.log("Type of pdfParse.PDFParse:", typeof (pdfParse as any).PDFParse);
  if (typeof (pdfParse as any).PDFParse === 'function') {
    console.log("Is prototype/class:", (pdfParse as any).PDFParse.toString().slice(0, 100));
  }
}

test();
