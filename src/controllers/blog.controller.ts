// controllers/blog.controller.ts
import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import BlogService from '../services/blog.service';
import createSuccessResponse from '../utils/responseFormatter.config';
import { validationResult } from 'express-validator';
import CustomRequest from '../interfaces/request.interface';
import { BadRequestError } from '../utils/customError.utils';
import { BlogData, IBlog } from '../interfaces/blog.interface';
import blogService from '../services/blog.service';


const getDashBoard = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const selected: string = (req.query.interest as string) || '';
  const interests: string[] = req?.user?.interests ?? [];
  const blogs = await BlogService.getDashboard(selected, interests);
  createSuccessResponse(200, { blogs, interests }, 'Successfully fetched dashboard data', res, req);
});

const createBlog = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError('Validation failed');
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const data: IBlog = {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    description: req.body.description,
    author: req.user.id,
    image: ''
  };

  const blog = await BlogService.createBlog(data, files.image);
  createSuccessResponse(200, { blog }, 'Blog created successfully', res, req);
});

const getMyBlogs = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const blogs = await BlogService.getMyBlogs(req?.user?.id);
  createSuccessResponse(200, { blogs }, 'Blogs retrieved successfully', res, req);
});

const getBlogDetail = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const blog = await BlogService.getBlogDetail(req.params.blogId);
  createSuccessResponse(200, { blog }, 'Blog retrieved successfully', res, req);
});

const deleteBlog = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const blog = await BlogService.deleteBlog(req.params.blogId);
  createSuccessResponse(200, { blog }, 'Blog successfully deleted', res, req);
});


const editBlog = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Validate incoming request data
  if (!errors.isEmpty()) {
    console.log(errors.array());
    throw new BadRequestError("Validation failed");
  }

  if (!req.body.blogId) {
    throw new BadRequestError("Blog ID is required");
  }
  const data: BlogData = {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    description: req.body.description,
    image: ''
  }

  const blog = await blogService.editBlog(data, files.image, req.body.blogId);
  createSuccessResponse(200, { blog }, "Blog updated successfully", res, req);
});

export { getDashBoard, createBlog, getMyBlogs, getBlogDetail, deleteBlog, editBlog };















// import { Response } from 'express';
// import asyncHandler from 'express-async-handler';
// import createSuccessResponse from '../utils/responseFormatter.config';
// import { CloudinaryfileStore } from '../utils/helperFunctions.utils';
// import { validationResult } from 'express-validator';
// import Blog from '../models/blog.model';
// import { BadRequestError, ConflictError } from '../utils/customError.utils';
// import CustomRequest from '../interfaces/request.interface';

// const getDashBoard = asyncHandler(async (req:  CustomRequest, res: Response):Promise<void> => {
//   const selected: string = (req.query.interest as string) || '';
//   const interests: string[] = req?.user?.interests ?? [];

//   let filter = {};
//   console.log(selected, 'knkjjkn');

//   if (selected) {
//     filter = { category: selected };
//   } else if (interests?.length > 0) {
//     filter = { category: { $in: interests } };
//   }

//   const blogs = await Blog.find(filter).populate('author').sort({ createdAt: -1 });
//   createSuccessResponse(200, { blogs, interests }, 'successfully fetch dashboard data', res, req);
// });

// const createBlog = asyncHandler(async (req:  CustomRequest, res: Response): Promise<void> => {
//   const errors = validationResult(req);

//   // Validate incoming  CustomRequest data
//   if (!errors.isEmpty()) {
//     console.log(errors.array());
//     throw new BadRequestError('Validation failed');
//   }

//   // Assert req.files as a type that includes an 'image' key
//   const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//   // Ensure an image file is uploaded
//   if (!files?.image || files.image.length === 0) {
//     throw new ConflictError('Image is required');
//   }

//   // Upload the image to Cloudinary (or relevant storage)
//   const coverPicPath = await CloudinaryfileStore(files.image, '/Blogs/CoverPics', 'AR_coverpic');

//   if (!coverPicPath || coverPicPath.length === 0) {
//     throw new Error('Image upload failed');
//   }

//   // Prepare Blog data to be saved
//   const data = {
//     title: req.body.title,
//     content: req.body.content,
//     category: req.body.category,
//     description: req.body.description,
//     author: req.user.id, // assuming req.user.id is set by an authentication middleware
//     image: coverPicPath[0], // store the first URL/path from the array
//   };

//   // Save Blog to database
//   const blog = await Blog.create(data);
//   createSuccessResponse(200, { blog }, 'Blog created successfully', res, req);
// });

// const getMyBlogs = asyncHandler(async (req:  CustomRequest, res: Response):Promise<void> => {
//   const blogs = await Blog.find({ author: req?.user?.id }).sort({ createdAt: -1 });
//   createSuccessResponse(200, { blogs }, 'Blogs retrieved successfully', res, req);
// });

// const getBlogDetail = asyncHandler(async (req:  CustomRequest, res: Response):Promise<void> => {
//   const { blogId } = req.params;
//   const blog = await Blog.findById(blogId).populate('author');
//   createSuccessResponse(200, { blog }, 'Blog retrieved successfully', res, req);
// });

// const editBlog = asyncHandler(async (req:  CustomRequest, res: Response):Promise<void> => {
//   const errors = validationResult(req);
//   let coverPicPath: string[] | null = null;

//   // Validate incoming  CustomRequest data
//   if (!errors.isEmpty()) {
//     console.log(errors.array());
//     throw new BadRequestError('Validation failed');
//   }

//   // Additional code for editing the blog can be placed here...
// });


// const deleteBlog = asyncHandler(async (req:  CustomRequest, res: Response):Promise<void> => {
//   const { blogId } = req.params;
//   const getBlog = await Blog.findById(blogId);
  
//   if (!getBlog) {
//     throw new Error("Blog not found"); 
//   }

//   const blog = await Blog.findByIdAndDelete(blogId);
//   createSuccessResponse(200,{ blog }, "Blog successfully deleted", res, req);
// });

// export {
//   getDashBoard,
//   createBlog,
//   getMyBlogs,
//   getBlogDetail,
//   editBlog,
//   deleteBlog
// }