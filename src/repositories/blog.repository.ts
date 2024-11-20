// repositories/blog.repository.ts
import BaseRepository from './base.repository';
import { IBlogDocument } from '../interfaces/blog.interface';
import Blog from '../models/blog.model';

class BlogRepository extends BaseRepository<IBlogDocument> {
  constructor() {
    super(Blog);
  }

  async getDistinctValues(filter: object, type: string): Promise<string[]>{
      return await this.model.find(filter).distinct(type); 
  }

}

export default BlogRepository;
