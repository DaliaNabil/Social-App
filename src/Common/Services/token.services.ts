import jwt, { JwtPayload, PrivateKey, PublicKey, Secret, SignOptions, VerifyOptions } from "jsonwebtoken";
import { envConfig } from "../../config";
import UserRepository from "../../DB/Repositories/user.repository";
import {  ICreateTokenCredentials, IDetectData, IGenerateToken, IGetSignatureByTypeAndRole, Isignature, IUser, IVerifyToken, TOKEN_TYPES, USER_ROLES } from "../Types";
import { BadRequstException } from "../Utils/index.js";
import { Types } from "mongoose";

const jwtSecrets = envConfig.jwt;


class TokenService {

  constructor(
    private userRepository: UserRepository = new UserRepository()
  ) {}

  // Generate Token
  generateToken({ payload, secretKey, options }: IGenerateToken) {
    return jwt.sign(payload, secretKey, options  );
  }

  // verify token
  verifyToken({ token, secretKey, options }: IVerifyToken) {
    return jwt.verify(token, secretKey, options as VerifyOptions);
  }

  // Create Login credentials
  createTokenCredentials({ payload, options, requiredToken }: ICreateTokenCredentials ) {
    const signature = this.getSignatureByTypeAndRole({ 
      role: (payload as { role: USER_ROLES }).role, 
      both: true 
    }) as Isignature;
    
    let accessToken, refreshToken;

    switch (requiredToken) {
      case TOKEN_TYPES.ACCESS:
        accessToken = this.generateToken({
          payload,
          secretKey: signature.accessSignature,
          options: options.access,
        });
        break;
        
      case TOKEN_TYPES.REFRESH:
        refreshToken = this.generateToken({
          payload,
          secretKey: signature.refreshSignature,
          options: options.refresh,
        });
        break;

      default:
        accessToken = this.generateToken({
          payload,
          secretKey: signature.accessSignature,
          options: options.access,
        });

        refreshToken = this.generateToken({
          payload,
          secretKey: signature.refreshSignature,
          options: options.refresh,
        });
        break;
    }

    return { accessToken, refreshToken };
  }

  
// Decode and Verify Token
  async decodeToken({ token, tokenType }: { token: string; tokenType: TOKEN_TYPES }): Promise<IDetectData> {
    const data = jwt.decode(token) as JwtPayload;

    if (!data?.role) {
      throw new BadRequstException("Invalid token payload, role is required");
    }

    const signature = this.getSignatureByTypeAndRole({
      role: data.role as USER_ROLES,
      tokenType,
    }) as string;

    const decodedData = this.verifyToken({ token, secretKey: signature }) as jwt.JwtPayload;

    const userIdFromToken = (decodedData as { _id: string })?._id;

    if (!userIdFromToken) {
      throw new BadRequstException("Invalid token payload, user ID is required");
    }

    const user = await this.userRepository.findById(new Types.ObjectId(userIdFromToken));
    
    if (!user) {
      throw new BadRequstException("User not found for the provided token");
    }

    return { user, decodedData };
  }

 
  detectSignature({ role }: { role: USER_ROLES }): Isignature {
    return role === USER_ROLES.ADMIN ? jwtSecrets.admin : jwtSecrets.user;
  }

 
  getSignatureByTypeAndRole({ role, tokenType, both }: IGetSignatureByTypeAndRole) {
    const signature: Isignature = this.detectSignature({ role });
    if (both) return signature;
    
    let tokenSignature;

    switch (tokenType) {
      case TOKEN_TYPES.ACCESS:
        tokenSignature = signature.accessSignature;
        break;
      case TOKEN_TYPES.REFRESH:
        tokenSignature = signature.refreshSignature;
        break;
      default:
        throw new BadRequstException("Invalid token type");
    } 

    return tokenSignature;
  }
}

export default TokenService;