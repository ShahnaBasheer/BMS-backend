import { body, ValidationChain } from 'express-validator';


// Validation for signup form
export const validateSignup: ValidationChain[] = [
  body('fullName')
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('Full Name is required'),
  body('work')
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('Work is required'),
  body('email')
    .isEmail()
    .withMessage('Email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters'),
];

// Validation for blog form
export const validateBlogForm: ValidationChain[] = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('category')
    .isString()
    .withMessage('Category must be a string')
    .isLength({ min: 3 })
    .withMessage('Category must be at least 3 characters long'),
  body('description')
    .isString()
    .withMessage('Description must be a string')
    .isLength({ min: 100 })
    .withMessage('Description must be at least 100 characters long')
    .isLength({ max: 400 })
    .withMessage('Description must be at most 400 characters long'),
  body('content')
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 200 })
    .withMessage('Content must be at least 200 characters long'),
];

// Validation for login form
export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters'),
];

// Validation for profile update
export const validateProfile: ValidationChain[] = [
  body('fullName')
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('Full Name is required'),
  body('work')
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('Work is required'),
  body('email')
    .isEmail()
    .withMessage('Email is required'),
  body('interests')
    .notEmpty()
    .withMessage('Interests are required')
    .isArray({ min: 1 })
    .withMessage('Interests must be an array with at least 1 interest'),
];

// Validation for password change
export const validatePassword: ValidationChain[] = [
  body('currentPassword')
    .isLength({ min: 6 })
    .withMessage('Current Password must contain at least 6 characters'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New Password must contain at least 6 characters'),
];
