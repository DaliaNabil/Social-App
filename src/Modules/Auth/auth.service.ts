import { SecurityService, TokenService } from "../../Common/Services";
import {
  IUser,
  SignInBodyType,
  SignUpBodyType,
  USER_ROLES,
} from "../../Common/Types";
import { BadRequstException, ConflictException } from "../../Common/Utils";
import { envConfig } from "../../config";
import UserRepository from "../../DB/Repositories/user.repository";
import { randomUUID } from "node:crypto";
import { SignOptions } from "jsonwebtoken";

const jwtSecrets = envConfig.jwt;
class AuthService {
  constructor(
    private userRepository: UserRepository = new UserRepository(),
    private securityService: SecurityService = new SecurityService(),
    private tokenService: TokenService = new TokenService(),
  ) {}

  health = async (body: SignUpBodyType) => {
    if (body && body.phone) {
      body.phone = this.securityService.encrypt(body.phone);
    }

    const token = this.tokenService.generateToken({
      payload: body,
      secretKey: envConfig.jwt.user.accessSignature,
      options: {
        expiresIn: parseInt(envConfig.jwt.user.accessExpiration as string),
      },
    });
    return token;
  };

  async _checkDuplication(body: SignUpBodyType) {
    const { email, phone } = body;

    if (phone) {
      const encryptedPhoneToSearch = SecurityService.encryptPhone(phone);
      const existingPhone = await this.userRepository.findOne({
        phone: encryptedPhoneToSearch,
      });
      if (existingPhone) {
        throw new ConflictException("Phone number already exists", {
          duplicateValue: phone,
          deplicatedField: "phone",
        });
      }
    }
  }

  // async _prepareData(body: SignUpBodyType) {
  //   const { password, phone, email } = body;

  //   const hashedPassword = await this.securityService.hashPassword(password);
  //   const encryptedPhone = phone  ? SecurityService.encryptPhone(phone): undefined;

  //   return {
  //     ...body,
  //     email,
  //     password: hashedPassword,
  //     phone: encryptedPhone,
  //   };
  // }

  async _buildTokens(data: Pick<IUser, "_id" | "email" | "role">) {
    const tokenPayload = {
      _id: data._id,
      email: data.email,
      role: data.role || USER_ROLES.USER,
    };

    const { accessToken, refreshToken } =
      this.tokenService.createTokenCredentials({
        payload: tokenPayload,
        options: {
          access: {
            expiresIn: parseInt(envConfig.jwt.user.accessExpiration as string),
            jwtid: randomUUID(),
          },
          refresh: {
            expiresIn: parseInt(envConfig.jwt.user.refreshExpiration as string),
            jwtid: randomUUID(),
          },
        },
      });

    return { accessToken, refreshToken };
  }

  signUp = async (body: SignUpBodyType) => {
    const {
      firstName,
      lastName,
      age,
      gender,
      workExperience,
      password,
      phone,
      email,
    } = body;

    await this._checkDuplication(body);
    return this.userRepository.create({
      firstName,
      lastName,
      age,
      gender,
      password,
      phone,
      email,
    });
  };

  SignIn = async (body: SignInBodyType) => {
    const { email, password } = body;
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequstException("User not found");
    }

    if (!password) {
      throw new BadRequstException("Password is required");
    }
    const hashedPassword = await this.securityService.hashPassword(password);

    return this._buildTokens(user);
  };
    listUsers = ()=> this.userRepository.find({})
}

export default new AuthService();
