import {Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config";
import { BadRequstException } from "../Common/Utils";
import { IAuth, TOKEN_TYPES } from "../Common/Types";
import { TokenService } from "../Common/Services";


const tokenService = new TokenService()
 export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const authorization = req.headers['authorization'] as string | undefined;

    if (!authorization) {
      throw new BadRequstException('Authorization header is required');
    }

    const [prefix, token] = authorization.split(' ');
    if (prefix !== 'Bearer' || !token) {
      throw new BadRequstException('Invalid authorization format');
    }

    const { user, decodedData } = await tokenService.decodeToken({ 
      token, 
      tokenType: TOKEN_TYPES.ACCESS 
    });

    if (!user) {
      throw new BadRequstException('Invalid user credential, please register');
    }

     const authenticatedRequest = req as IAuth
   authenticatedRequest.user = user
    authenticatedRequest.accessTokenData = decodedData;
    next();
  } catch (error) {
    next(error); 
  }
};


