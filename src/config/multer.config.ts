import multer, { StorageEngine } from 'multer';
import { RequestHandler } from 'express';

// Configure multer storage
const storage: StorageEngine = multer.memoryStorage();

// Define the file fields
const fileFields = [
  { name: 'image', maxCount: 1 },
];

// Configure multer upload
const upload: RequestHandler = multer({ storage }).fields(fileFields);

export default upload;
