// repositories/base.repository.ts
import { IBaseRepository } from '../interfaces/baseRepository.interface';
import { Model, Document } from 'mongoose';



export default class BaseRepository<T extends Document> implements IBaseRepository<T>{
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).populate('author').exec();
  }

  async find(filter: object, sortOptions = {}, skip: number = 0, limit: number = 10): Promise<T[]> {
    return await this.model.find(filter).populate('author').sort(sortOptions).skip(skip).limit(limit).exec();
  }

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).populate('author').exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
