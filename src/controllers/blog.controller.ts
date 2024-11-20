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
  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.size as string, 10);
  const selected: string = (req.query.interest as string) || '';
  const interests: string[] = req?.user?.interests ?? [];
  const blogs = await BlogService.getDashboard(selected, interests, page, limit);
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
  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.size as string, 10);
  const selected: string = (req.query?.category as string) || '';
  const data = await BlogService.getMyBlogs(req?.user?.id, page, limit, selected);
  createSuccessResponse(200, { blogs: data.blogs, categories: data.categories }, 'Blogs retrieved successfully', res, req);
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













