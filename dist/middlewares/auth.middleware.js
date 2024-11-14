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
exports.isUser = exports.authMiddleware = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const customError_utils_1 = require("../utils/customError.utils");
const jwToken_config_1 = require("../config/jwToken.config");
exports.authMiddleware = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authorizationHeader = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new customError_utils_1.UnauthorizedError('Not authorized: no Bearer');
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            throw new customError_utils_1.UnauthorizedError('Not authorized: no access token');
        }
        const decode = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        const user = yield user_model_1.default.findById(decode === null || decode === void 0 ? void 0 : decode.id);
        if (!user)
            throw new customError_utils_1.UnauthorizedError('User not found!');
        if (user.isBlocked) {
            res.clearCookie(process.env.USER_REFRESH, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });
            throw new customError_utils_1.ForbiddenError('User account is blocked');
        }
        req.user = user;
        return next();
    }
    catch (error) {
        console.log(error.message, 'line 75 authMiddleware');
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            const refreshToken = req === null || req === void 0 ? void 0 : req.cookies[process.env.USER_REFRESH];
            if (!refreshToken) {
                throw new customError_utils_1.UnauthorizedError('Refresh token is not found!');
            }
            try {
                const decode = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const user = yield user_model_1.default.findById(decode === null || decode === void 0 ? void 0 : decode.id);
                if (!user)
                    throw new customError_utils_1.UnauthorizedError('User not found!');
                if (user.isBlocked) {
                    throw new customError_utils_1.ForbiddenError('User account is blocked');
                }
                const token = (0, jwToken_config_1.generateToken)(user === null || user === void 0 ? void 0 : user.id);
                console.log('New token has been generated and stored');
                req.user = user;
                req.token = token;
            }
            catch (refreshError) {
                res.clearCookie(process.env.USER_REFRESH, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                });
                if (refreshError instanceof customError_utils_1.ForbiddenError ||
                    refreshError instanceof customError_utils_1.UnauthorizedError) {
                    throw refreshError;
                }
                console.log(refreshError === null || refreshError === void 0 ? void 0 : refreshError.message, 'session expired');
            }
        }
        else if (error instanceof customError_utils_1.ForbiddenError) {
            throw error;
        }
        return next();
    }
}));
exports.isUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req === null || req === void 0 ? void 0 : req.user) {
        return next();
    }
    throw new customError_utils_1.UnauthorizedError('Authorization Failed!');
}));
