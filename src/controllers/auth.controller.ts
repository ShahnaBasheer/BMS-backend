import UserService from "../services/user.service";
import { Response } from "express";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../utils/customError.utils";
import createSuccessResponse from "../utils/responseFormatter.config";
import CustomRequest from "../interfaces/request.interface";
import { UserData } from "../interfaces/user.interface";


// Create new user from signup form
const createUser = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError("Validation failed");
  }

  const data: UserData = {
    fullName: req.body.fullName,
    work: req.body.work,
    email: (req.body.email as string).toLowerCase(),
    password: req.body.password,
  };

  const user = await UserService.createUser(data);
  if (user) {
    createSuccessResponse(200, { email: data.email }, "Verification Code has been sent successfully!", res);
  }
});

// Resend OTP Code
const resendOtpCode = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError("Validation failed");
  }

  const result = await UserService.resendOtpCode(email);
  if (result) {
    createSuccessResponse(200, { email }, "OTP resent successfully", res);
  }
});

// OTP Verification
const otpVerification = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const { otp, email } = req.body;

  const result = await UserService.otpVerification(otp, email);
  if (result) {
    createSuccessResponse(200, null, "OTP verified successfully!", res);
  }
});

// Login user
const loginUser = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError("Validation failed");
  }

  const { token, user, refresh } = await UserService.loginUser(email, password);
  res.cookie(process.env.USER_REFRESH ?? '', refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  createSuccessResponse(200, { token, user }, "Login successfully!", res);
});

// Logout user
const logoutUser = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const refreshToken = req?.cookies[process.env.USER_REFRESH as string];
  if (!refreshToken) throw new UnauthorizedError("No Refresh Token in Cookies");

  res.clearCookie(process.env.USER_REFRESH as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  createSuccessResponse(200, null, "Successfully logged out!", res);
});

// Get Profile
const getProfile = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const profile = await UserService.getProfile(req.user?.id as string);
  createSuccessResponse(200, { profile }, "Successfully retrieved Profile!", res);
});

// Edit Profile
const editProfile = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const { fullName, work, interests } = req.body;
  const userId = req.user.id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestError("Validation failed");
  }

  const profile = await UserService.editProfile(userId, fullName, work, interests );
  createSuccessResponse(200, { profile }, "Profile updated successfully!", res);
});

// Change Password
const passWordChangeProfile = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  await UserService.changePassword(userId, currentPassword, newPassword );
  createSuccessResponse(200, null, "Password changed successfully!", res, req);
});

// Change Email
const emailChangeProfile = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const { email } = req.body;

  const updatedUser = await UserService.changeEmail(req.user?.id as string, email);
  req.user = updatedUser;
  createSuccessResponse(200, { profile: updatedUser, email }, "OTP sent to both current and new emails!", res, req);
});

// Verify OTP for Email Change
const verifyOTP = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const { otpOld, otpNew, email } = req.body;

  const updatedUser = await UserService.verifyOTP(req.user?.id as string, otpOld, otpNew, email);
  createSuccessResponse(200, { profile: updatedUser }, "Email changed successfully!", res, req);
});

export {
  createUser,
  resendOtpCode,
  otpVerification,
  loginUser,
  logoutUser,
  getProfile,
  editProfile,
  passWordChangeProfile,
  emailChangeProfile,
  verifyOTP
};
