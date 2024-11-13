import mongoose, { Document } from 'mongoose';


interface BlogData {
  title: string;
  description: string;
  category: string;
  content: string;
  image: string | Express.Multer.File[];
}

// Define the interface for a blog document
interface IBlog extends BlogData{
    author: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  }

interface IBlogDocument extends Document, IBlog {}

  export {
    IBlog,
    IBlogDocument,
    BlogData
  }