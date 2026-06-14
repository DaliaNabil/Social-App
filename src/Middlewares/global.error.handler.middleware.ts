import { Request, Response, NextFunction } from "express"; 
import { envConfig } from "../config";
import { IHttpAppError } from "../Common/Types";

// Global error handling middleware
/** * @param {Error} err - The error object 
* @param {Request} req -  request object
* @param {Response} res -  response object
* @param {NextFunction} next - The next middleware function
*/

const globalErrorHandler = (err: IHttpAppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error 
  
 
  res.status(err?.statusCode || 500).json({
    message: err.message || "Internal server error",
    stack: envConfig.app.nodeEnv === "dev" ? err.stack : undefined,
    error: {
      code: err.code,
      details: err.details,
    },
  });
};

export default globalErrorHandler;