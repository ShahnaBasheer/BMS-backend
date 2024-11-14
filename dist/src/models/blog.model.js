"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the Blog schema
const blogSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User collection
        required: true,
    },
    title: {
        type: String,
        required: true,
        minlength: 5,
    },
    description: {
        type: String,
        required: true,
        minlength: 100,
        maxlength: 400,
    },
    category: {
        type: String,
        required: true,
        minlength: 3,
    },
    content: {
        type: String,
        required: true,
        minlength: 200,
    },
    image: {
        type: String, // If storing image as a URL or path
        required: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});
// Create the Blog model from the schema
const Blog = mongoose_1.default.model('Blog', blogSchema);
exports.default = Blog;
