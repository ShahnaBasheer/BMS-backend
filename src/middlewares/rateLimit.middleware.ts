import rateLimit from 'express-rate-limit';
import { Request, RequestHandler, Response } from 'express';
import { TooManyRequestsError } from '../utils/customError.utils';

// Express rate limiter middleware
const resendOtpLimiter: RequestHandler = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  keyGenerator: (req: Request): string => {
    return req.ip || ''; // Use IP address for rate limiting
  },
  handler: (req: Request, res: Response) => {
    throw new TooManyRequestsError('Too many OTP requests. Try again later.');
  },
});

export default resendOtpLimiter;
