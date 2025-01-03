// repositories/blog.repository.ts

import { IBaseRepository } from "./baseRepository.interface";
import { IBlogDocument } from "./blog.interface";


export interface IBlogRepository extends IBaseRepository<IBlogDocument> {
  getDistinctValues(filter: object, type: string): Promise<string[]>;
}