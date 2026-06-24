import multer from 'multer';
import { Request } from 'express';

// Configure multer to store files in memory temporarily
const storage = multer.memoryStorage();

// File filter to restrict to PDF only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'));
  }
};

// Multer upload middleware with 5MB size limit
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});
