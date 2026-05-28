import axios from "axios";
import PDFParser from "pdf2json";
import mammoth from "mammoth";

export const extractResumeText = async (url: string): Promise<string> => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const buffer = Buffer.from(response.data);

  // 🔹 Try PDF parsing
  try {
    const pdfParser = new PDFParser();

    return await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        reject(errData.parserError);
      });

      pdfParser.on("pdfParser_dataReady", () => {
        const text = pdfParser.getRawTextContent();
        resolve(text);
      });

      pdfParser.parseBuffer(buffer);
    });
  } catch (err) {
    console.log("PDF parsing failed, trying DOCX...");
  }

  // 🔹 Try DOCX
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch {
    throw new Error("Unsupported resume format");
  }
};