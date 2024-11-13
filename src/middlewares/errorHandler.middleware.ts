import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customError.utils';



function notFoundHandler(req: Request, res: Response, next: NextFunction): void  {
    res.status(404).json({status: 'not-found', message: `Not Found: ${req.originalUrl}` });
}



function errorHandler(error: any, req: Request, res: Response, next: NextFunction): void  {
    console.log('An error occurred:', error);

    if (error instanceof CustomError) {
        res.status(error.statusCode).json({status: 'error', message: error?.message });
    } else {
        res.status(500).json({status: 'error', message: 'Internal Server Error' });
    }
}

export { errorHandler, notFoundHandler}