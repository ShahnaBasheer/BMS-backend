"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateProfile = exports.validateLogin = exports.validateBlogForm = exports.validateSignup = void 0;
const express_validator_1 = require("express-validator");
// Validation for signup form
exports.validateSignup = [
    (0, express_validator_1.body)('fullName')
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage('Full Name is required'),
    (0, express_validator_1.body)('work')
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage('Work is required'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Email is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters'),
];
// Validation for blog form
exports.validateBlogForm = [
    (0, express_validator_1.body)('title')
        .isString()
        .withMessage('Title must be a string')
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long'),
    (0, express_validator_1.body)('category')
        .isString()
        .withMessage('Category must be a string')
        .isLength({ min: 3 })
        .withMessage('Category must be at least 3 characters long'),
    (0, express_validator_1.body)('description')
        .isString()
        .withMessage('Description must be a string')
        .isLength({ min: 100 })
        .withMessage('Description must be at least 100 characters long')
        .isLength({ max: 400 })
        .withMessage('Description must be at most 400 characters long'),
    (0, express_validator_1.body)('content')
        .isString()
        .withMessage('Content must be a string')
        .isLength({ min: 200 })
        .withMessage('Content must be at least 200 characters long'),
];
// Validation for login form
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Email is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters'),
];
// Validation for profile update
exports.validateProfile = [
    (0, express_validator_1.body)('fullName')
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage('Full Name is required'),
    (0, express_validator_1.body)('work')
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage('Work is required'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Email is required'),
    (0, express_validator_1.body)('interests')
        .notEmpty()
        .withMessage('Interests are required')
        .isArray({ min: 1 })
        .withMessage('Interests must be an array with at least 1 interest'),
];
// Validation for password change
exports.validatePassword = [
    (0, express_validator_1.body)('currentPassword')
        .isLength({ min: 6 })
        .withMessage('Current Password must contain at least 6 characters'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 6 })
        .withMessage('New Password must contain at least 6 characters'),
];
