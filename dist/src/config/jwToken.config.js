"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }
    return (0, jsonwebtoken_1.sign)({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};
exports.generateToken = generateToken;
const generateRefreshToken = (id) => {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables.");
    }
    return (0, jsonwebtoken_1.sign)({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "3d" });
};
exports.generateRefreshToken = generateRefreshToken;
