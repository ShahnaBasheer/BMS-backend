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
exports.verifyOTP = exports.emailChangeProfile = exports.passWordChangeProfile = exports.editProfile = exports.getProfile = exports.logoutUser = exports.loginUser = exports.otpVerification = exports.resendOtpCode = exports.createUser = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const customError_utils_1 = require("../utils/customError.utils");
const responseFormatter_config_1 = __importDefault(require("../utils/responseFormatter.config"));
// Create new user from signup form
const createUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new customError_utils_1.BadRequestError("Validation failed");
    }
    const data = {
        fullName: req.body.fullName,
        work: req.body.work,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
    };
    const user = yield user_service_1.default.createUser(data);
    if (user) {
        (0, responseFormatter_config_1.default)(200, { email: data.email }, "Verification Code has been sent successfully!", res);
    }
}));
exports.createUser = createUser;
// Resend OTP Code
const resendOtpCode = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new customError_utils_1.BadRequestError("Validation failed");
    }
    const result = yield user_service_1.default.resendOtpCode(email);
    if (result) {
        (0, responseFormatter_config_1.default)(200, { email }, "OTP resent successfully", res);
    }
}));
exports.resendOtpCode = resendOtpCode;
// OTP Verification
const otpVerification = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, email } = req.body;
    const result = yield user_service_1.default.otpVerification(otp, email);
    if (result) {
        (0, responseFormatter_config_1.default)(200, null, "OTP verified successfully!", res);
    }
}));
exports.otpVerification = otpVerification;
// Login user
const loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new customError_utils_1.BadRequestError("Validation failed");
    }
    const { token, user, refresh } = yield user_service_1.default.loginUser(email, password);
    res.cookie((_a = process.env.USER_REFRESH) !== null && _a !== void 0 ? _a : '', refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    (0, responseFormatter_config_1.default)(200, { token, user }, "Login successfully!", res);
}));
exports.loginUser = loginUser;
// Logout user
const logoutUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req === null || req === void 0 ? void 0 : req.cookies[process.env.USER_REFRESH];
    if (!refreshToken)
        throw new customError_utils_1.UnauthorizedError("No Refresh Token in Cookies");
    res.clearCookie(process.env.USER_REFRESH, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    (0, responseFormatter_config_1.default)(200, null, "Successfully logged out!", res);
}));
exports.logoutUser = logoutUser;
// Get Profile
const getProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const profile = yield user_service_1.default.getProfile((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    (0, responseFormatter_config_1.default)(200, { profile }, "Successfully retrieved Profile!", res);
}));
exports.getProfile = getProfile;
// Edit Profile
const editProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, work, interests } = req.body;
    const userId = req.user.id;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new customError_utils_1.BadRequestError("Validation failed");
    }
    const profile = yield user_service_1.default.editProfile(userId, fullName, work, interests);
    (0, responseFormatter_config_1.default)(200, { profile }, "Profile updated successfully!", res);
}));
exports.editProfile = editProfile;
// Change Password
const passWordChangeProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    yield user_service_1.default.changePassword(userId, currentPassword, newPassword);
    (0, responseFormatter_config_1.default)(200, null, "Password changed successfully!", res, req);
}));
exports.passWordChangeProfile = passWordChangeProfile;
// Change Email
const emailChangeProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = req.body;
    const updatedUser = yield user_service_1.default.changeEmail((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, email);
    req.user = updatedUser;
    (0, responseFormatter_config_1.default)(200, { profile: updatedUser, email }, "OTP sent to both current and new emails!", res, req);
}));
exports.emailChangeProfile = emailChangeProfile;
// Verify OTP for Email Change
const verifyOTP = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { otpOld, otpNew, email } = req.body;
    const updatedUser = yield user_service_1.default.verifyOTP((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, otpOld, otpNew, email);
    (0, responseFormatter_config_1.default)(200, { profile: updatedUser }, "Email changed successfully!", res, req);
}));
exports.verifyOTP = verifyOTP;
