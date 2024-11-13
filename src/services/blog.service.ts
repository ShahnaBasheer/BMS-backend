// services/blog.service.ts
import BlogRepository from "../repositories/blog.repository";
import { BlogData, IBlog } from "../interfaces/blog.interface";
import { CloudinaryfileStore } from "../utils/helperFunctions.utils";
import { NotFoundError } from "../utils/customError.utils";

class BlogService {
  private _blogRepository!: BlogRepository;

  constructor() {
    this._blogRepository = new BlogRepository();
  }

  async createBlog(
    data: IBlog,
    imageFile: Express.Multer.File[]
  ): Promise<any> {
    if (!imageFile || imageFile.length === 0) {
      throw new Error("Image is required");
    }

    const coverPicPath = await CloudinaryfileStore(
      imageFile,
      "/Blogs/CoverPics",
      "AR_coverpic"
    );
    if (!coverPicPath || coverPicPath.length === 0) {
      throw new Error("Image upload failed");
    }

    data.image = coverPicPath[0];
    return this._blogRepository.create(data);
  }

  async getDashboard(selected: Object, interests: string[]): Promise<any> {
    let filter = {};
    if(selected){
      filter = { category: selected }
    } else if(interests?.length > 0) {
      filter = { category: { $in: interests } };
    }
    console.log(filter, "knkjjkn")
    return this._blogRepository.find(filter, { createdAt: -1 });
  }

  async getMyBlogs(authorId: string): Promise<any> {
    return this._blogRepository.find({ author: authorId }, { createdAt: -1 });
  }

  async getBlogDetail(blogId: string): Promise<any> {
    return this._blogRepository.findById(blogId);
  }

  async deleteBlog(blogId: string): Promise<any> {
    return this._blogRepository.deleteById(blogId);
  }

  async editBlog(
    data: BlogData,
    imageFile: Express.Multer.File[],
    blogId: string
  ) {
    let coverPicPath = null;

    const existingBlog = await this._blogRepository.findById(blogId);
    if (!existingBlog) {
      throw new NotFoundError("Blog not found");
    }

    // Ensure an image file is uploaded
    if (imageFile) {
      coverPicPath = await CloudinaryfileStore(
        imageFile,
        "/Blogs/CoverPics",
        "Blog_coverpic"
      );

      if (!coverPicPath || coverPicPath.length === 0) {
        throw new Error("Image upload failed");
      }
      existingBlog.image = coverPicPath[0];
    }

    // Update the Blog fields with the new data from the request
    existingBlog.title = data.title || existingBlog.title;
    existingBlog.content = data.content || existingBlog.content;
    existingBlog.category = data.category || existingBlog.category;
    existingBlog.description = data.description || existingBlog.description;

    // Save the updated Blog back to the database
    await existingBlog.save();

    return existingBlog;
  }
}

export default new BlogService();
