import { Request } from 'express';

interface CustomRequest extends Request {
    user?: any;
    token?: string;
}

export default CustomRequest;
