import { put } from '@vercel/blob';
import pdfParse = require('pdf-parse');
import { env } from '../config/env';
import fs from 'fs';
import path from 'path';

// Verify the magic bytes of a PDF file (25 50 44 46)
export const verifyPdfMagicBytes = (buffer: Buffer): boolean => {
  if (buffer.length < 4) return false;
  return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
};

export const resumeService = {
  /**
   * Uploads the raw buffer to Vercel Blob and returns the storage URL.
   */
  async uploadResumeToBlob(userId: string, fileBuffer: Buffer, originalName: string): Promise<string> {
    if (!verifyPdfMagicBytes(fileBuffer)) {
      throw new Error('Invalid file signature. Only authentic PDF files are allowed.');
    }

    const filename = `${userId}-${Date.now()}-${originalName}`;

    if (!env.BLOB_READ_WRITE_TOKEN || env.BLOB_READ_WRITE_TOKEN === 'vercel-blob-placeholder-token') {
      console.warn('Vercel Blob token is missing or placeholder. Using local upload fallback.');
      return this.saveResumeLocally(filename, fileBuffer);
    }

    try {
      const blob = await put(`resumes/${filename}`, fileBuffer, {
        access: 'public',
        token: env.BLOB_READ_WRITE_TOKEN,
      });

      return blob.url;
    } catch (error) {
      console.warn('Vercel Blob upload failed, falling back to local storage:', error);
      return this.saveResumeLocally(filename, fileBuffer);
    }
  },

  /**
   * Saves resume locally as a fallback.
   */
  async saveResumeLocally(filename: string, fileBuffer: Buffer): Promise<string> {
    const uploadDir = path.resolve(__dirname, '../../uploads');
    
    // Ensure directory exists
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(uploadDir, safeFilename);

    await fs.promises.writeFile(filePath, fileBuffer);

    const port = env.PORT || '4000';
    return `http://localhost:${port}/uploads/${safeFilename}`;
  },

  /**
   * Parses the text out of a PDF buffer using pdf-parse v2.
   * pdf-parse v2 exports a PDFParse class with a .load(buffer) method that returns parsed data.
   */
  async extractTextFromPdf(fileBuffer: Buffer): Promise<string> {
    try {
      // pdf-parse v2 exports PDFParse as a class — instantiate it then call .load()
      const PDFParseClass = (pdfParse as any).PDFParse;
      const parser = new PDFParseClass({ verbosity: 0 });
      const result = await parser.load(fileBuffer);

      // getText returns an array of page texts, join them all
      let text: string;
      if (result && typeof result.text === 'string') {
        text = result.text;
      } else {
        // fallback: call getText if available
        const pages = await parser.getText();
        text = Array.isArray(pages)
          ? pages.map((p: any) => p.text || '').join('\n')
          : String(pages);
      }

      // Strip out problematic characters
      text = text.replace(/\u0000/g, ''); // Remove null bytes
      text = text.replace(/javascript:/gi, ''); // Basic sanitization
      return text.trim();
    } catch (error: any) {
      console.error('PDF parsing failed. Error detail:', error);
      throw new Error(`Failed to extract text from PDF document. Detail: ${error?.message || error}`);
    }
  }
};

