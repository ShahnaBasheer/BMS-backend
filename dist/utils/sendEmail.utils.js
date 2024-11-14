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
const nodemailer_1 = __importDefault(require("nodemailer"));
const customError_utils_1 = require("./customError.utils");
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, subject, text }) {
    try {
        if (!email) {
            throw new customError_utils_1.BadRequestError('Email Id is required!');
        }
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        yield transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("Email sent successfully");
    }
    catch (error) {
        console.log(`${error.message} - Email not sent`);
        throw error;
    }
});
exports.default = sendEmail;
