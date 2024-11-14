"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createSuccessResponse = (statusCode, info, message, res, req) => {
    var _a, _b, _c, _d, _e;
    let data = {};
    if (info) {
        data = Object.assign({}, info);
    }
    if (req) {
        if (req === null || req === void 0 ? void 0 : req.token) {
            data.token = req.token;
        }
        if (req === null || req === void 0 ? void 0 : req.user) {
            data.user = {
                id: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                fullName: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.fullName,
                work: (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.work,
                email: (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.email,
                role: (_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.role,
            };
        }
    }
    res.status(statusCode).json({ status: 'success', data, message });
};
exports.default = createSuccessResponse;
