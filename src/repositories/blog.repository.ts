// repositories/blog.repository.ts
import BaseRepository from './base.repository';
import { IBlogDocument } from '../interfaces/blog.interface';
import Blog from '../models/blog.model';

class BlogRepository extends BaseRepository<IBlogDocument> {
  constructor() {
    super(Blog);
  }

  // Add any blog-specific methods here, if needed
}

export default BlogRepository;
