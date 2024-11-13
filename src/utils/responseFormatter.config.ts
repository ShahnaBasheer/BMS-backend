import { Response, Request } from 'express';
import CustomRequest from '../interfaces/request.interface';

interface User {
  id: string;
  fullName: string;
  work: string;
  email: string;
  role: string;
}

interface ResponseData {
  token?: string;
  user?: any;
  [key: string]: any; // Allows additional properties
}


const createSuccessResponse = <T>(statusCode: number, info: T, message: string, res: Response, req?: CustomRequest): void => {
  let data: ResponseData = {};

  if (info) {
    data = { ...info };
  }

  if (req) {
    if (req?.token) {
      data.token = req.token;
    }
    if (req?.user) {
      data.user = {
        id: req?.user?.id,
        fullName: req?.user?.fullName,
        work: req?.user?.work,
        email: req?.user?.email,
        role: req?.user?.role,
      };
    }
  }

  res.status(statusCode).json({ status: 'success', data, message });
};

export default createSuccessResponse;

