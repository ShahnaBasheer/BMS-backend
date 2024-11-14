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
const user_model_1 = __importDefault(require("../models/user.model"));
const base_repository_1 = __importDefault(require("./base.repository"));
class UserRepository extends base_repository_1.default {
    constructor() {
        super(user_model_1.default);
    }
    // Check if the user exists and is verified
    findVerifiedUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') }, isVerified: true }).exec();
        });
    }
    // Find a user by email (whether verified or not)
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } }).exec();
        });
    }
    // Delete user by email
    deleteByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOneAndDelete({ email: { $regex: new RegExp(`^${email}$`, 'i') } }, { new: true });
        });
    }
    // Check if user is blocked
    isUserBlocked(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findById(id);
            return user ? user.isBlocked : false;
        });
    }
    // Find user by ID
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(userId);
        });
    }
    // Update user profile
    updateProfile(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(userId, updateData, { new: true });
        });
    }
    // Update email after OTP verification
    updateEmail(userId, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(userId, { email: newEmail }, { new: true });
        });
    }
    // Mark user as verified
    verifyUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
        });
    }
    // Block a user
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
        });
    }
    // Unblock a user
    unblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
        });
    }
}
exports.default = UserRepository;
