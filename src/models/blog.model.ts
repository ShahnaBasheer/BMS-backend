import { IBlog, IBlogDocument } from "../interfaces/blog.interface";
import mongoose, { Model, Schema } from "mongoose";

// Define the Blog schema
const blogSchema: Schema<IBlogDocument> = new Schema(
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User collection
        required: true,
      },
      title: {
        type: String,
        required: true,
        minlength: 5,
      },
      description: {
        type: String,
        required: true,
        minlength: 100,
        maxlength: 400,
      },
      category: {
        type: String,
        required: true,
        minlength: 3,
      },
      content: {
        type: String,
        required: true,
        minlength: 200,
      },
      image: {
        type: String, // If storing image as a URL or path
        required: true,
      },
    },
    {
      timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
  );
  
  // Create the Blog model from the schema
  const Blog = mongoose.model<IBlogDocument>('Blog', blogSchema);

  export default Blog;