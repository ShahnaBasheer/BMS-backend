"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const validateForm_middleware_1 = require("../middlewares/validateForm.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rateLimit_middleware_1 = __importDefault(require("../middlewares/rateLimit.middleware"));
const multer_config_1 = __importDefault(require("../config/multer.config"));
const router = (0, express_1.Router)();
// Public routes (no authentication required)
router.post('/login', validateForm_middleware_1.validateLogin, auth_controller_1.loginUser);
router.post('/signup', validateForm_middleware_1.validateSignup, auth_controller_1.createUser);
router.post('/verify-otp', auth_controller_1.otpVerification);
router.post('/resend-otp', rateLimit_middleware_1.default, auth_controller_1.resendOtpCode);
// Authenticated routes (all routes here require authMiddleware and isUser)
router.use(auth_middleware_1.authMiddleware, auth_middleware_1.isUser);
router.get('/dashboard', blog_controller_1.getDashBoard);
router.get('/myblogs', blog_controller_1.getMyBlogs); // Get user's Blogs
router.get('/details/:blogId', blog_controller_1.getBlogDetail); // Get Blog details
// Blog routes
router.route('/blog')
    .post(multer_config_1.default, validateForm_middleware_1.validateBlogForm, blog_controller_1.createBlog) // Create Blog
    .patch(multer_config_1.default, validateForm_middleware_1.validateBlogForm, blog_controller_1.editBlog); // Update Blog
router.route('/blog/:blogId')
    .get(blog_controller_1.getBlogDetail) // Get Blog details
    .delete(blog_controller_1.deleteBlog); // Delete Blog
// Profile routes
router.route('/profile')
    .get(auth_controller_1.getProfile) // Get profile
    .put(validateForm_middleware_1.validateProfile, auth_controller_1.editProfile); // Edit profile
router.route('/profile/change-password')
    .patch(validateForm_middleware_1.validatePassword, auth_controller_1.passWordChangeProfile); // Change password
router.route('/profile/change-email')
    .patch(auth_controller_1.emailChangeProfile); // Change email
router.route('/profile/verify-otp')
    .patch(auth_controller_1.verifyOTP); // Verify OTP
// Logout route
router.post('/logout', auth_controller_1.logoutUser);
exports.default = router;
