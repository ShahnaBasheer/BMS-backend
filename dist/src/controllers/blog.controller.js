"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editBlog = exports.deleteBlog = exports.getBlogDetail = exports.getMyBlogs = exports.createBlog = exports.getDashBoard = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const blog_service_1 = __importDefault(require("../services/blog.service"));
const responseFormatter_config_1 = __importDefault(require("../utils/responseFormatter.config"));
const express_validator_1 = require("express-validator");
const customError_utils_1 = require("../utils/customError.utils");
const blog_service_2 = __importDefault(require("../services/blog.service"));
const getDashBoard = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const selected = req.query.interest || '';
    const interests = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.interests) !== null && _b !== void 0 ? _b : [];
    const blogs = yield blog_service_1.default.getDashboard(selected, interests);
    (0, responseFormatter_config_1.default)(200, { blogs, interests }, 'Successfully fetched dashboard data', res, req);
}));
exports.getDashBoard = getDashBoard;
const createBlog = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new customError_utils_1.BadRequestError('Validation failed');
    }
    const files = req.files;
    const data = {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        description: req.body.description,
        author: req.user.id,
        image: ''
    };
    const blog = yield blog_service_1.default.createBlog(data, files.image);
    (0, responseFormatter_config_1.default)(200, { blog }, 'Blog created successfully', res, req);
}));
exports.createBlog = createBlog;
const getMyBlogs = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const blogs = yield blog_service_1.default.getMyBlogs((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id);
    (0, responseFormatter_config_1.default)(200, { blogs }, 'Blogs retrieved successfully', res, req);
}));
exports.getMyBlogs = getMyBlogs;
const getBlogDetail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_service_1.default.getBlogDetail(req.params.blogId);
    (0, responseFormatter_config_1.default)(200, { blog }, 'Blog retrieved successfully', res, req);
}));
exports.getBlogDetail = getBlogDetail;
const deleteBlog = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_service_1.default.deleteBlog(req.params.blogId);
    (0, responseFormatter_config_1.default)(200, { blog }, 'Blog successfully deleted', res, req);
}));
exports.deleteBlog = deleteBlog;
const editBlog = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    const files = req.files;
    // Validate incoming request data
    if (!errors.isEmpty()) {
        console.log(errors.array());
        throw new customError_utils_1.BadRequestError("Validation failed");
    }
    if (!req.body.blogId) {
        throw new customError_utils_1.BadRequestError("Blog ID is required");
    }
    const data = {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        description: req.body.description,
        image: ''
    };
    const blog = yield blog_service_2.default.editBlog(data, files.image, req.body.blogId);
    (0, responseFormatter_config_1.default)(200, { blog }, "Blog updated successfully", res, req);
}));
exports.editBlog = editBlog;
// import { Response } from 'express';
// import asyncHandler from 'express-async-handler';
// import createSuccessResponse from '../utils/responseFormatter.config';
// import { CloudinaryfileStore } from '../utils/helperFunctions.utils';
// import { validationResult } from 'express-validator';
// import Blog from '../models/blog.model';
// import { BadRequestError, ConflictError } from '../utils/customError.utils';
// import CustomRequest from '../interfaces/request.interface';
// const getDashBoard = asyncHandler(async (req:  CustomRequest, res: Response):Promise<void> => {
//   const selected: string = (req.query.interest as string) || '';
//   const interests: string[] = req?.user?.interests ?? [];
//   let filter = {};
//   console.log(selected, 'knkjjkn');
//   if (selected) {
//     filter = { category: selected };
//   } else if (interests?.length > 0) {
//     filter = { category: { $in: interests } };
//   }
//   const blogs = await Blog.find(filter).populate('author').sort({ createdAt: -1 });
//   createSuccessResponse(200, { blogs, interests }, 'successfully fetch dashboard data', res, req);
// });
// const createBlog = asyncHandler(async (req:  CustomRequest, res: Response): Promise<void> => {
//   const errors = validationResult(req);
//   // Validate incoming  CustomRequest data
//   if (!errors.isEmpty()) {
//     console.log(errors.array());
//     throw new BadRequestError('Validation failed');
//   }
//   // Assert req.files as a type that includes an 'image' key
//   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//   // Ensure an image file is uploaded
//   if (!files?.image || files.image.length === 0) {
//     throw new ConflictError('Image is required');
//   }
//   // Upload the image to Cloudinary (or relevant storage)
//   const coverPicPath = await CloudinaryfileStore(files.image, '/Blogs/CoverPics', 'AR_coverpic');
//   if (!coverPicPath || coverPicPath.length === 0) {
//     throw new Error('Image upload failed');
//   }
//   // Prepare Blog data to be saved
//   const data = {
//     title: req.body.title,
//     content: req.body.content,
//     category: req.body.category,
//     description: req.body.description,
//     author: req.user.id, // assuming req.user.id is set by an authentication middleware
//     image: coverPicPath[0], // store the first URL/path from the array
//   };
//   // Save Blog to database
//   const blog = await Blog.create(data);
//   createSuccessResponse(200, { blog }, 'Blog created successfully', res, req);
// });
// const getMyBlogs = asyncHandler(async (req:  CustomRequest, res: Response):Promise<void> => {
//   const blogs = await Blog.find({ author: req?.user?.id }).sort({ createdAt: -1 });
//   createSuccessResponse(200, { blogs }, 'Blogs retrieved successfully', res, req);
// });
// const getBlogDetail = asyncHandler(async (req:  CustomRequest, res: Response):Promise<void> => {
//   const { blogId } = req.params;
//   const blog = await Blog.findById(blogId).populate('author');
//   createSuccessResponse(200, { blog }, 'Blog retrieved successfully', res, req);
// });
// const editBlog = asyncHandler(async (req:  CustomRequest, res: Response):Promise<void> => {
//   const errors = validationResult(req);
//   let coverPicPath: string[] | null = null;
//   // Validate incoming  CustomRequest data
//   if (!errors.isEmpty()) {
//     console.log(errors.array());
//     throw new BadRequestError('Validation failed');
//   }
//   // Additional code for editing the blog can be placed here...
// });
// const deleteBlog = asyncHandler(async (req:  CustomRequest, res: Response):Promise<void> => {
//   const { blogId } = req.params;
//   const getBlog = await Blog.findById(blogId);
//   if (!getBlog) {
//     throw new Error("Blog not found"); 
//   }
//   const blog = await Blog.findByIdAndDelete(blogId);
//   createSuccessResponse(200,{ blog }, "Blog successfully deleted", res, req);
// });
// export {
//   getDashBoard,
//   createBlog,
//   getMyBlogs,
//   getBlogDetail,
//   editBlog,
//   deleteBlog
// }
