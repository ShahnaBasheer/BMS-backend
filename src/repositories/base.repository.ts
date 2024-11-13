// repositories/base.repository.ts
import { Model, Document } from 'mongoose';



export default class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).populate('author').exec();
  }

  async find(filter: object, sortOptions = {}): Promise<T[]> {
    return this.model.find(filter).populate('author').sort(sortOptions).exec();
  }

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).populate('author').exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
