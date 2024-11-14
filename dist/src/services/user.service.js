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
const jwToken_config_1 = require("../config/jwToken.config");
const customError_utils_1 = require("../utils/customError.utils");
const helperFunctions_utils_1 = require("../utils/helperFunctions.utils");
const sendEmail_utils_1 = __importDefault(require("../utils/sendEmail.utils"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
class UserService {
    constructor() {
        this._userRepository = new user_repository_1.default(); // Assuming _userRepository is imported
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = userData.email;
            const user = yield this._userRepository.findUserByEmail(email);
            if (user) {
                if (!user.isVerified)
                    yield this._userRepository.deleteByEmail(email);
                else {
                    throw new customError_utils_1.ConflictError("You have already signed up. Please log in!");
                }
            }
            const emailInfo = yield (0, helperFunctions_utils_1.otpEmailSend)(email);
            yield this._userRepository.create(Object.assign(Object.assign({}, userData), { otp: emailInfo.otp, otpTimestamp: new Date() }));
            yield (0, sendEmail_utils_1.default)({ email, subject: emailInfo.subject, text: emailInfo.text });
            return true;
        });
    }
    resendOtpCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findUserByEmail(email);
            if (user && !user.isVerified) {
                yield (0, helperFunctions_utils_1.otpEmailSend)(email);
                const emailInfo = yield (0, helperFunctions_utils_1.otpEmailSend)(email);
                yield (0, sendEmail_utils_1.default)({ email, subject: emailInfo.subject, text: emailInfo.text });
                return true;
            }
            else {
                throw new customError_utils_1.NotFoundError("User not found or already verified");
            }
        });
    }
    otpVerification(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findUserByEmail(email);
            if (user && user.isVerified)
                throw new customError_utils_1.ConflictError("User Already Exist!");
            if (!(user === null || user === void 0 ? void 0 : user.otp) || !(user === null || user === void 0 ? void 0 : user.otpTimestamp) || user.otp !== otp) {
                throw new customError_utils_1.BadRequestError("Invalid OTP");
            }
            if ((0, helperFunctions_utils_1.isOtpExpired)(user.otpTimestamp, 2)) {
                throw new customError_utils_1.BadRequestError("Expired OTP");
            }
            // Send welcome email
            const subject = "Welcome to nextThoughts";
            const text = `Dear ${user.fullName},\nWelcome to nextThoughts! We're thrilled to have you on board. Thank you for choosing us.`;
            yield (0, sendEmail_utils_1.default)({ email, subject, text });
            const updateData = {
                $set: { isVerified: true }, // Set fields you want to keep
                $unset: { otpTimestamp: "", otp: "" }, // Unset fields you want to remove
            };
            yield this._userRepository.updateProfile(user.id, updateData);
            return true;
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findVerifiedUserByEmail(email);
            if (user && (user === null || user === void 0 ? void 0 : user.isBlocked)) {
                throw new customError_utils_1.ForbiddenError("User account is blocked");
            }
            if (user && (yield bcrypt_1.default.compare(password, user.password)) && user.role === "user" && user.isVerified) {
                const accessToken = (0, jwToken_config_1.generateToken)(user.id);
                const refreshToken = (0, jwToken_config_1.generateRefreshToken)(user.id);
                return { token: accessToken, refresh: refreshToken, user };
            }
            else {
                throw new customError_utils_1.UnauthorizedError("Invalid email or password");
            }
        });
    }
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new customError_utils_1.NotFoundError("Profile not found");
            }
            return user;
        });
    }
    editProfile(userId, fullName, work, interests) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = {};
            if (fullName)
                updateData.fullName = fullName;
            if (work)
                updateData.work = work;
            if (interests)
                updateData.interests = interests;
            const user = yield this._userRepository.updateProfile(userId, updateData);
            if (!user) {
                throw new customError_utils_1.NotFoundError("Profile not found");
            }
            return user;
        });
    }
    // Change user password
    changePassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new customError_utils_1.NotFoundError("User not found");
            }
            const isMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!isMatch) {
                throw new customError_utils_1.UnauthorizedError("Current password is incorrect");
            }
            user.password = newPassword;
            yield user.save();
            return user;
        });
    }
    // Change user email and send OTP for verification
    changeEmail(userId, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new customError_utils_1.NotFoundError("User not found");
            }
            const oldOtpInfo = yield (0, helperFunctions_utils_1.otpEmailSend)(user.email);
            const newOtpInfo = yield (0, helperFunctions_utils_1.otpEmailSend)(newEmail);
            const profile = yield this._userRepository.updateProfile(userId, {
                otp: oldOtpInfo.otp,
                otpTimestamp: new Date(),
                newotp: newOtpInfo.otp,
                newotpTimestamp: new Date(),
            });
            return profile;
        });
    }
    // Verify OTP for email change
    verifyOTP(userId, otpOld, otpNew, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findById(userId);
            if (!user) {
                throw new customError_utils_1.NotFoundError("User not found");
            }
            const currentTime = new Date();
            // Validate old OTP
            if (!(user === null || user === void 0 ? void 0 : user.otp) || !(user === null || user === void 0 ? void 0 : user.otpTimestamp) || (user === null || user === void 0 ? void 0 : user.otp) !== otpOld) {
                throw new customError_utils_1.BadRequestError(`Invalid OTP for ${user.email}`);
            }
            // Validate new OTP
            if (!(user === null || user === void 0 ? void 0 : user.newotp) || !(user === null || user === void 0 ? void 0 : user.newotpTimestamp) || (user === null || user === void 0 ? void 0 : user.newotp) !== otpNew) {
                throw new customError_utils_1.BadRequestError(`Invalid OTP for ${newEmail}`);
            }
            if ((0, helperFunctions_utils_1.isOtpExpired)(user.otpTimestamp, 2)) {
                throw new customError_utils_1.BadRequestError(`OTP is Expired for ${user.email}`);
            }
            if ((0, helperFunctions_utils_1.isOtpExpired)(user.newotpTimestamp, 3)) {
                throw new customError_utils_1.BadRequestError(`OTP is Expired for ${newEmail}`);
            }
            const updateData = {
                $set: { email: newEmail },
                $unset: { otpTimestamp: "", otp: "", newotpTimestamp: "", newotp: "" },
            };
            // Update user in the database
            const profile = yield this._userRepository.updateProfile(user.id, updateData);
            return profile;
        });
    }
}
exports.default = new UserService();
