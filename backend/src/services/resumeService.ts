import { put } from '@vercel/blob';
import pdfParse from 'pdf-parse';
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
   * Falls back to local disk storage if Vercel Blob credentials are missing or invalid.
   */
  async uploadResumeToBlob(userId: string, fileBuffer: Buffer, originalName: string): Promise<string> {
    if (!verifyPdfMagicBytes(fileBuffer)) {
      throw new Error('Invalid file signature. Only authentic PDF files are allowed.');
    }

    const cleanOriginalName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `resumes/${userId}-${Date.now()}-${cleanOriginalName}`;

    const isPlaceholder = !env.BLOB_READ_WRITE_TOKEN || env.BLOB_READ_WRITE_TOKEN.includes('placeholder');

    if (!isPlaceholder) {
      try {
        const blob = await put(filename, fileBuffer, {
          access: 'public',
          token: env.BLOB_READ_WRITE_TOKEN,
        });
        return blob.url;
      } catch (error) {
        console.warn('[Vercel Blob] Upload failed, falling back to local file storage:', error);
      }
    }

    // Local storage fallback for development
    try {
      const uploadsDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const localFileName = `${userId}-${Date.now()}-${cleanOriginalName}`;
      const localFilePath = path.join(uploadsDir, localFileName);
      fs.writeFileSync(localFilePath, fileBuffer);

      const port = env.PORT || '4000';
      return `http://localhost:${port}/uploads/${localFileName}`;
    } catch (localError) {
      console.error('[Upload] Local storage fallback failed:', localError);
      throw new Error('Failed to upload resume to both cloud and local storage.');
    }
  },

  /**
   * Parses the text out of a PDF buffer using pdf-parse.
   */
  async extractTextFromPdf(fileBuffer: Buffer): Promise<string> {
    try {
      // @ts-ignore
      const data = await pdfParse(fileBuffer);
      // Strip out problematic characters, macros or excessive whitespace
      let text = data.text.replace(/\u0000/g, ''); // Remove null bytes
      text = text.replace(/javascript:/gi, ''); // Basic sanitization
      return text.trim();
    } catch (error) {
      console.error('[PDF Extract Error] Detailed parsing failure:', error);
      throw new Error('Failed to extract text from PDF document. Please verify the file is not corrupted.');
    }
  }
};
