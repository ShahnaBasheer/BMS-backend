"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const customError_utils_1 = require("../utils/customError.utils");
// Express rate limiter middleware
const resendOtpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3,
    keyGenerator: (req) => {
        return req.ip || ''; // Use IP address for rate limiting
    },
    handler: (req, res) => {
        throw new customError_utils_1.TooManyRequestsError('Too many OTP requests. Try again later.');
    },
});
exports.default = resendOtpLimiter;
