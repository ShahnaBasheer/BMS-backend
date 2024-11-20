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
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.size, 10);
    const selected = req.query.interest || '';
    const interests = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.interests) !== null && _b !== void 0 ? _b : [];
    const blogs = yield blog_service_1.default.getDashboard(selected, interests, page, limit);
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
    var _a, _b;
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.size, 10);
    const selected = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.category) || '';
    const data = yield blog_service_1.default.getMyBlogs((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id, page, limit, selected);
    (0, responseFormatter_config_1.default)(200, { blogs: data.blogs, categories: data.categories }, 'Blogs retrieved successfully', res, req);
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
