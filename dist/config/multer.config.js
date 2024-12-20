"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Configure multer storage
const storage = multer_1.default.memoryStorage();
// Define the file fields
const fileFields = [
    { name: 'image', maxCount: 1 },
];
// Configure multer upload
const upload = (0, multer_1.default)({ storage }).fields(fileFields);
exports.default = upload;
