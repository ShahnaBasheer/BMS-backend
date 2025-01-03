import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt, { TokenExpiredError, JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';
import { ForbiddenError, UnauthorizedError } from '../utils/customError.utils';
import { generateToken } from '../config/jwToken.config';
import CustomRequest from '../interfaces/request.interface';
import { Constants } from '../utils/variables';



export const authMiddleware = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const authorizationHeader = req.headers?.authorization;
      if (!authorizationHeader || !authorizationHeader.startsWith(Constants.Bearer)) {
        throw new UnauthorizedError('Not authorized: no Bearer');
      }

      const accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken) {
        throw new UnauthorizedError('Not authorized: no access token');
      }

      const decode = jwt.verify(accessToken, process.env.JWT_SECRET!) as JwtPayload;
      const user = await User.findById(decode?.id);

      if (!user) throw new UnauthorizedError('User not found!');

      if (user.isBlocked) {
        res.clearCookie(process.env.USER_REFRESH!, {
          httpOnly: true,
          secure: process.env.NODE_ENV === Constants.Production,
          sameSite: process.env.NODE_ENV === Constants.Production ? Constants.None : Constants.Lax,
        });
        throw new ForbiddenError('User account is blocked');
      }

      req.user = user;
      return next();
    } catch (error: any) {
      console.log(error.message, 'line 75 authMiddleware');
      if (error instanceof TokenExpiredError) {
        const refreshToken = req?.cookies[process.env.USER_REFRESH!];

        try {
          if (!refreshToken) {
            throw new UnauthorizedError('Session Expired! Login Again.');
          }

          const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
          const user = await User.findById(decode?.id);
  
          if (!user) throw new UnauthorizedError('User not found!');
          if (user.isBlocked) throw new ForbiddenError('User account is blocked');

          const token = generateToken(user?.id);
          console.log('New token has been generated and stored');
          req.user = user;
          req.token = token;
        } catch (error: any) {
          res.clearCookie(process.env.USER_REFRESH!, {
            httpOnly: true,
            secure: process.env.NODE_ENV === Constants.Production,
            sameSite: Constants.Production ? Constants.None : Constants.Lax,
          });
          if (error instanceof ForbiddenError || error instanceof UnauthorizedError) {
            next(error); 
          } else {
            next(new Error('Internal Server Error')); 
          }
          console.log(error?.message, 'session expired');
        }
      } else if (error instanceof ForbiddenError) {
        return next(error);
      }
      return next();
    }
  }
);

export const isUser = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req?.user) {
      return next();
    }
    console.log('Authorization Failed');
    throw new UnauthorizedError('Login again!');
  }
);
