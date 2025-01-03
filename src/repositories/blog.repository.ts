// repositories/blog.repository.ts
import BaseRepository from './base.repository';
import { IBlogDocument } from '../interfaces/blog.interface';
import Blog from '../models/blog.model';
import { IBlogRepository } from 'interfaces/blogReository,interface';

class BlogRepository extends BaseRepository<IBlogDocument> implements IBlogRepository{
  constructor() {
    super(Blog);
  }

  async getDistinctValues(filter: object, type: string): Promise<string[]>{
      return await this.model.find(filter).distinct(type); 
  }

}

export default BlogRepository;
