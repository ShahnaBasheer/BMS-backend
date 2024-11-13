import mongoose, { Document, Schema, Model } from 'mongoose';


interface UserData {
  fullName: string;
  work: string;
  email: string;
  password: string;

}

// Define the User interface
interface IUser extends UserData{
    otp?: string;
    otpTimestamp?: Date;
    interests: string[];
    newotp?: string;
    newotpTimestamp?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    role: string;
    isVerified: boolean;
    isDeleted: boolean;
    isBlocked: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(enteredPassword: string): Promise<boolean>;
  }

  interface IUserDocument extends Document, IUser {}


  export {
    IUser,
    IUserDocument,
    UserData
  }