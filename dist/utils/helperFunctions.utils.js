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
exports.CloudinaryfileStore = exports.otpEmailSend = void 0;
exports.isOtpExpired = isOtpExpired;
const otp_generator_1 = __importDefault(require("otp-generator"));
const cloudinary_confg_1 = __importDefault(require("../config/cloudinary.confg"));
const stream_1 = require("stream");
const sharp_1 = __importDefault(require("sharp"));
// Function to send OTP email
const otpEmailSend = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = otp_generator_1.default.generate(6, { specialChars: false });
        const subject = 'OTP Verification';
        const text = `Your OTP for email verification is: ${otp}`;
        return { otp, subject, text };
    }
    catch (error) {
        console.log(error.message);
        throw new Error('Error in OTP generation');
    }
});
exports.otpEmailSend = otpEmailSend;
// Function to store images in Cloudinary
const CloudinaryfileStore = (files, folderName, fName) => __awaiter(void 0, void 0, void 0, function* () {
    if (!files || !folderName || !fName) {
        throw new Error('Invalid input');
    }
    const processedImages = [];
    console.log(files.length, folderName);
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            if (!file.mimetype.startsWith('image/')) {
                return reject(new Error('Only image files are allowed.'));
            }
            (0, sharp_1.default)(file.buffer, { failOnError: false })
                .resize({ width: 800 })
                .toBuffer()
                .then((buffer) => {
                const uploadStream = cloudinary_confg_1.default.uploader.upload_stream({
                    folder: folderName,
                    public_id: `${fName}_${Date.now()}`,
                    resource_type: 'auto',
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve((result === null || result === void 0 ? void 0 : result.secure_url) || null);
                    }
                });
                // Convert the optimized buffer into a stream and upload it
                const bufferStream = stream_1.Readable.from(buffer);
                bufferStream.pipe(uploadStream).on('error', (streamError) => {
                    reject(streamError);
                });
            })
                .catch((err) => {
                console.log(err);
                console.error(`Sharp processing error: ${err.message}`);
                // Skip the problematic file and resolve with null or a placeholder
                resolve(null);
            });
        });
    });
    // Filter out any null values (from skipped files)
    const results = yield Promise.all(uploadPromises);
    return results.filter((url) => url !== null); // Only return successful uploads
});
exports.CloudinaryfileStore = CloudinaryfileStore;
function isOtpExpired(timestamp, expirationMinutes) {
    const currentTime = new Date();
    const otpTimestamp = new Date(timestamp);
    const timeDifferenceInMinutes = (currentTime.getTime() - otpTimestamp.getTime()) / (1000 * 60);
    return timeDifferenceInMinutes > expirationMinutes;
}
