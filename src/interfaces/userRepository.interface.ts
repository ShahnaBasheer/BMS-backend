// src/repositories/IUserRepository.ts

import { IUserDocument } from "./user.interface";


interface IUserRepository {
  findByEmail(email: string): Promise<IUserDocument | null>;
  create(userData: Partial<IUserDocument>): Promise<IUserDocument>;
  updateById(id: string, updateData: Partial<IUserDocument>): Promise<IUserDocument | null>;
  findOneAndUpdate(filter: object, updateData: object): Promise<IUserDocument | null>;
  deleteByEmail(email: string): Promise<void>;
}

export default IUserRepository;
