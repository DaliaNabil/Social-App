import { NextFunction, Request, Response } from "express";

export const responseFormatter = (handler: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handler(req, res, next);

      if (res.headersSent) {
        return;
      }
      return res.status(result?.meta?.statusCode || 200).json({
        success: true,
        message: result?.message || "Request successful",
        data: result?.data || result ,
        meta: result?.meta || {},
      });
    } catch (error) {
      next(error);
    }
  };
};

export default responseFormatter;