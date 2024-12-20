"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const customError_utils_1 = require("../utils/customError.utils");
function notFoundHandler(req, res, next) {
    res.status(404).json({ status: 'not-found', message: `Not Found: ${req.originalUrl}` });
}
function errorHandler(error, req, res, next) {
    console.log('An error occurred:', error);
    if (error instanceof customError_utils_1.CustomError) {
        res.status(error.statusCode).json({ status: 'error', message: error === null || error === void 0 ? void 0 : error.message });
    }
    else {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}
