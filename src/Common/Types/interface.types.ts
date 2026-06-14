import {
  JwtPayload,
  PrivateKey,
  PublicKey,
  Secret,
  SignOptions,
  VerifyOptions,
} from "jsonwebtoken";
import { Types } from "mongoose";
import { Request } from "express";
import { POST_PRIVACY, PROVIDERS, TOKEN_TYPES, USER_ROLES } from "./enum.types";
import z from "zod";

export interface IworkExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date | undefined;
  description?: string | undefined;
  currentlyWorking?: boolean | undefined;
}

export interface IOTP {
  value: string;
  expireAt: Date;
  channel: string;
}
export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  age?: number | undefined;
  phone?: string | undefined;
  password?: string | undefined;
  isActive?: boolean | undefined;
  gender?: string | undefined;
  role?: USER_ROLES;
  status?: string;
  isEmailVerified?: boolean;
  provider?: PROVIDERS;
  googleSub?: string;
  profilePicture?: string;
  coverPicture?: string;
  fcmToken?:String 
  workExperience?: IworkExperience[] | undefined;
  OTPs?: IOTP[];
}

export interface IHttpAppError {
  statusCode: number;
  code: string;
  details: unknown;
  message: string;
  stack?: string;
}

export interface IGenerateToken {
  payload: string | Buffer | object;
  secretKey: Secret | PrivateKey | string;
  options?: SignOptions;
}

export interface IVerifyToken {
  token: string;
  secretKey: Secret | PublicKey | string;
  options?: VerifyOptions;
}

export interface MySignOptions {
  algorithm?: any;
  keyid?: string;
  expiresIn: string | number;
  notBefore?: string | number;
  audience?: string | string[];
  subject?: string;
  issuer?: string;
  jwtid?: string;
}
export interface ICreateTokenCredentials {
  payload: string | Buffer | object;
  options: {
    access: SignOptions;
    refresh: SignOptions;
  };
  requiredToken?: TOKEN_TYPES;
}

export interface Isignature {
  accessSignature: string;
  accessExpiration?: string | undefined;
  refreshSignature: string;
  refreshExpiration?: string | undefined;
}

export interface IGetSignatureByTypeAndRole {
  role: USER_ROLES;
  tokenType?: TOKEN_TYPES;
  both?: boolean;
}

export interface IDetectData {
  user: IUser;
  decodedData: JwtPayload;
}
export interface IAuth extends Request {
  user: IUser;
  accessTokenData: JwtPayload | string;
}

export interface IPost {
  _id: Types.ObjectId;
  content: string;
  authorId: Types.ObjectId;
  privacy: POST_PRIVACY;
  media: string[];
  allowComments: boolean;
  tags: Types.ObjectId[];
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePost {
  title: string;
  content: string;
  image?: string;
  tags?: Types.ObjectId[];
  allowComments: boolean;
    location: string;
      privacy: POST_PRIVACY;



}