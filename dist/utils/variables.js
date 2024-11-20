"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["User"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var Constants;
(function (Constants) {
    Constants["Production"] = "production";
    Constants["Lax"] = "lax";
    Constants["None"] = "none";
    Constants["Bearer"] = "Bearer ";
})(Constants || (exports.Constants = Constants = {}));
