import express, { Application, RequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import dbConnect from './config/dbConnect.config';
import logger from 'morgan';
import cors from 'cors';
import userRouter from './routes/userRouter';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

// Database connection
dbConnect();

// Middlewares
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json({ limit: '100mb' })); // Increase limit to 100MB
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors({
  credentials: true,
  origin: [
    process.env.LOCALHOST_URL || '',
    process.env.FRONTEND_WWW_URL || '',
    process.env.FRONTEND_AMPLIFY_URL || '',
    process.env.FRONTEND_WWW_SLASH || '',
    process.env.FRONTEND_SLASH_URL || ''
  ],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']
}));

// Routes
app.use('/api', userRouter);

// Error handling middlewares

app.use(errorHandler);
app.use(notFoundHandler);


// Start server
const port: string | number = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
