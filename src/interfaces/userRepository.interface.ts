// src/repositories/IUserRepository.ts

import { IBaseRepository } from "./baseRepository.interface";
import { IUserDocument } from "./user.interface";

export interface IUserRepository extends IBaseRepository<IUserDocument> {
  findVerifiedUserByEmail(email: string): Promise<IUserDocument | null>;
  findUserByEmail(email: string): Promise<IUserDocument | null>;
  isUserBlocked(id: string): Promise<boolean>;
  updateProfile(userId: string, updateData: Partial<IUserDocument>): Promise<IUserDocument | null>;
  updateEmail(userId: string, newEmail: string): Promise<IUserDocument | null>;
  verifyUser(userId: string): Promise<IUserDocument | null>;
  blockUser(userId: string): Promise<IUserDocument | null>;
  unblockUser(userId: string): Promise<IUserDocument | null>;
}
