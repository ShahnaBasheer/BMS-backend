"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// repositories/blog.repository.ts
const base_repository_1 = __importDefault(require("./base.repository"));
const blog_model_1 = __importDefault(require("../models/blog.model"));
class BlogRepository extends base_repository_1.default {
    constructor() {
        super(blog_model_1.default);
    }
}
exports.default = BlogRepository;
