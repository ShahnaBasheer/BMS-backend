import { IUserRepository } from './../interfaces/userRepository.interface';
// repositories/user.repository.ts
import { IUserDocument } from "../interfaces/user.interface";
import User from "../models/user.model";
import BaseRepository from "./base.repository";

class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository{
  constructor() {
      super(User);
  }

  // Check if the user exists and is verified
  async findVerifiedUserByEmail(email: string): Promise<IUserDocument | null> {
    return this.model.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') }, isVerified: true }).exec();
  }

  // Find a user by email (whether verified or not)
  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return this.model.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } }).exec();
  }


  // Delete user by email
  public async deleteByEmail(email: string): Promise<IUserDocument | null> {
    return this.model.findOneAndDelete({ email: { $regex: new RegExp(`^${email}$`, 'i') }}, { new: true});
  }

  // Check if user is blocked
  async isUserBlocked(id: string): Promise<boolean> {
    const user = await this.findById(id);
    return user ? user.isBlocked : false;
  }


  // Find user by ID
  public async findById(userId: string): Promise<IUserDocument | null> {
    return this.model.findById(userId);
  }

  // Update user profile
  public async updateProfile(userId: string, updateData: Partial<IUserDocument>): Promise<IUserDocument | null> {
    return this.model.findByIdAndUpdate(userId, updateData, { new: true });
  }

  // Update email after OTP verification
  public async updateEmail(userId: string, newEmail: string): Promise<IUserDocument | null> {
    return this.model.findByIdAndUpdate(userId, { email: newEmail }, { new: true });
  }

 
  // Mark user as verified
  public async verifyUser(userId: string): Promise<IUserDocument | null> {
    return this.model.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
  }

  // Block a user
  public async blockUser(userId: string): Promise<IUserDocument | null> {
    return this.model.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
  }

  // Unblock a user
  public async unblockUser(userId: string): Promise<IUserDocument | null> {
    return this.model.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
  }
}

export default UserRepository;
