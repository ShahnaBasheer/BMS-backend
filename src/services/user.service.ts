import { generateToken, generateRefreshToken } from "../config/jwToken.config";
import { ConflictError, NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError } from "../utils/customError.utils";
import { isOtpExpired, otpEmailSend } from "../utils/helperFunctions.utils";
import sendEmail from "../utils/sendEmail.utils";
import bcrypt from "bcrypt";
import { IUser, IUserDocument, UserData } from "../interfaces/user.interface";
import UserRepository from "../repositories/user.repository";
import { UpdateQuery } from "mongoose";

class UserService {

  private _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository(); // Assuming _userRepository is imported
  }

  async createUser(userData: UserData): Promise<boolean> {
    const email  = userData.email;
    const user = await this._userRepository.findUserByEmail(email);

    if (user) {
      if (!user.isVerified) await this._userRepository.deleteByEmail(email);
      else {
        throw new ConflictError("You have already signed up. Please log in!");
      }
    }
   
    const emailInfo = await otpEmailSend(email);
    await this._userRepository.create({...userData, otp: emailInfo.otp,otpTimestamp: new Date()} );
    await sendEmail({ email, subject: emailInfo.subject, text: emailInfo.text });
    return true;
  }

  async resendOtpCode(email: string): Promise<boolean> {
    const user = await this._userRepository.findUserByEmail(email);

    if (user && !user.isVerified) {
      await otpEmailSend(email);
      const emailInfo = await otpEmailSend(email);
      await sendEmail({ email, subject: emailInfo.subject, text: emailInfo.text });
      return true;
    } else {
      throw new NotFoundError("User not found or already verified");
    }
  }

  async otpVerification(otp: string, email: string): Promise<boolean> {
    const user = await this._userRepository.findUserByEmail(email);

    if (user && user.isVerified) throw new ConflictError("User Already Exist!");

    if (!user?.otp || !user?.otpTimestamp || user.otp !== otp) {
      throw new BadRequestError("Invalid OTP");
    }

    if(isOtpExpired(user.otpTimestamp, 2)){
      throw new BadRequestError("Expired OTP")
    }
   
    // Send welcome email
    const subject = "Welcome to nextThoughts";
    const text = `Dear ${user.fullName},\nWelcome to nextThoughts! We're thrilled to have you on board. Thank you for choosing us.`;
    await sendEmail({ email, subject, text });

    const updateData: UpdateQuery<IUserDocument> = {
      $set: { isVerified: true }, // Set fields you want to keep
      $unset: { otpTimestamp: "", otp: "" }, // Unset fields you want to remove
    };

    await this._userRepository.updateProfile( user.id, updateData);
    return true;
  }

  async loginUser(email: string, password: string): Promise<{ token: string, user: IUserDocument, refresh: string}> {
    const user = await this._userRepository.findVerifiedUserByEmail(email);
    if (user && user?.isBlocked) {
      throw new ForbiddenError("User account is blocked");
    }

    if (user && (await bcrypt.compare(password, user.password)) && user.role === "user" && user.isVerified) {
      const accessToken = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      return { token: accessToken, refresh: refreshToken, user };
    } else {
      throw new UnauthorizedError("Invalid email or password");
    }
  }

  async getProfile(userId: string): Promise<boolean | IUser> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
        throw new NotFoundError("Profile not found");
    }
    return user;
  }

  async editProfile(userId: string, fullName: string, work: string, interests: string[]): Promise<boolean | IUser> {
    const updateData: Record<string, any> = {};

    if (fullName) updateData.fullName = fullName;
    if (work) updateData.work = work;
    if (interests) updateData.interests = interests;

    const user = await this._userRepository.updateProfile(userId, updateData);
    if (!user) {
        throw new NotFoundError("Profile not found");
    }
    return user;
  }

  // Change user password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<any> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Current password is incorrect");
    }
    user.password = newPassword;
    await user.save();
    return user;
  }

  // Change user email and send OTP for verification
  async changeEmail(userId: string, newEmail: string): Promise<any> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const oldOtpInfo = await otpEmailSend(user.email);
    const newOtpInfo = await otpEmailSend(newEmail);

    const profile = await this._userRepository.updateProfile(
        userId,
        {
          otp: oldOtpInfo.otp,
          otpTimestamp: new Date(),
          newotp: newOtpInfo.otp,
          newotpTimestamp: new Date(),
        }
      );
      
    return profile;
  }

  // Verify OTP for email change
  async verifyOTP(userId: string, otpOld: string, otpNew: string, newEmail: string): Promise<any> {
    const user: IUserDocument | null = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const currentTime = new Date();

    // Validate old OTP
    if (!user?.otp || !user?.otpTimestamp || user?.otp !== otpOld) {
      throw new BadRequestError(`Invalid OTP for ${user.email}`);
    }
    // Validate new OTP
    if (!user?.newotp || !user?.newotpTimestamp || user?.newotp !== otpNew) {
        throw new BadRequestError(`Invalid OTP for ${newEmail}`);
    }

    if (isOtpExpired(user.otpTimestamp, 2)) {
        throw new BadRequestError(`OTP is Expired for ${user.email}`);
      }
      if (isOtpExpired(user.newotpTimestamp, 3)) {
        throw new BadRequestError(`OTP is Expired for ${newEmail}`);
      }


    const updateData: UpdateQuery<IUserDocument> = {
      $set: { email: newEmail },
      $unset: { otpTimestamp: "", otp: "", newotpTimestamp: "", newotp: "" },
    };

    // Update user in the database
    const profile = await this._userRepository.updateProfile(
        user.id, updateData
    )

    return profile;
  }
}

export default new UserService();
