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
// services/blog.service.ts
const blog_repository_1 = __importDefault(require("../repositories/blog.repository"));
const helperFunctions_utils_1 = require("../utils/helperFunctions.utils");
const customError_utils_1 = require("../utils/customError.utils");
class BlogService {
    constructor() {
        this._blogRepository = new blog_repository_1.default();
    }
    createBlog(data, imageFile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!imageFile || imageFile.length === 0) {
                throw new Error("Image is required");
            }
            const coverPicPath = yield (0, helperFunctions_utils_1.CloudinaryfileStore)(imageFile, "/Blogs/CoverPics", "AR_coverpic");
            if (!coverPicPath || coverPicPath.length === 0) {
                throw new Error("Image upload failed");
            }
            data.image = coverPicPath[0];
            return this._blogRepository.create(data);
        });
    }
    getDashboard(selected_1, interests_1, page_1) {
        return __awaiter(this, arguments, void 0, function* (selected, interests, page, size = 1) {
            let filter = {};
            if (selected) {
                filter = { category: selected };
            }
            else if ((interests === null || interests === void 0 ? void 0 : interests.length) > 0) {
                filter = { category: { $in: interests } };
            }
            const skip = (page - 1) * size;
            return (yield this._blogRepository.find(filter, { createdAt: -1 }, skip, size));
        });
    }
    getMyBlogs(authorId, page, size, selected) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * size;
            let filter = { author: authorId };
            if (selected) {
                filter.category = selected;
            }
            const blogs = yield this._blogRepository.find(filter, { createdAt: -1 }, skip, size);
            const categories = yield this._blogRepository.getDistinctValues({ author: authorId }, 'category');
            return { blogs, categories };
        });
    }
    getBlogDetail(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._blogRepository.findById(blogId);
        });
    }
    deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._blogRepository.deleteById(blogId);
        });
    }
    editBlog(data, imageFile, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let coverPicPath = null;
            const existingBlog = yield this._blogRepository.findById(blogId);
            if (!existingBlog) {
                throw new customError_utils_1.NotFoundError("Blog not found");
            }
            // Ensure an image file is uploaded
            if (imageFile) {
                coverPicPath = yield (0, helperFunctions_utils_1.CloudinaryfileStore)(imageFile, "/Blogs/CoverPics", "Blog_coverpic");
                if (!coverPicPath || coverPicPath.length === 0) {
                    throw new Error("Image upload failed");
                }
                existingBlog.image = coverPicPath[0];
            }
            // Update the Blog fields with the new data from the request
            existingBlog.title = data.title || existingBlog.title;
            existingBlog.content = data.content || existingBlog.content;
            existingBlog.category = data.category || existingBlog.category;
            existingBlog.description = data.description || existingBlog.description;
            // Save the updated Blog back to the database
            yield existingBlog.save();
            return existingBlog;
        });
    }
}
exports.default = new BlogService();
