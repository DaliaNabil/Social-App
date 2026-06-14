import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { BadRequstException } from "../Common/Utils";


type RequestKey = keyof Request
type SchemaType = Partial<Record<RequestKey, ZodType>>



const validation = (schema: SchemaType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validationErrors = [];
    for (const key in schema) {
        const validKey = key as RequestKey;
      const result = schema[validKey]?.safeParse(req[validKey]);
      console.log(validKey, result);
      if (result && !result?.success) {
        validationErrors.push(result?.error.issues);
       }

    }
    if (validationErrors.length > 0) {
throw new BadRequstException("Validation failed", validationErrors );
    }
    next();
  };
};


export default validation;