import { config } from "dotenv";

config({
  path: [`.${process.env.NODE_ENV}.env`, ".env"],
});

export const envConfig = {
  app: {
    port: process.env.PORT ?? 3000,
    nodeEnv: process.env.NODE_ENV ?? "dev",
  },

  database: {
    MONGO_URI: process.env.MONGO_URI ?? "mongodb://localhost:27017/social-app",
  },
  encryption: {
  
    ENCRYPTION_KEY: process.env.ENC_KEY ?? "5f3a9e12b7c4d8a1092e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c",
    IV_LENGTH: process.env.ENC_IV_LENGTH ?? "16",
  },
  jwt: {
    user: {
      accessSignature: process.env.JWT_SECRET_USER ?? "default_user_access_secret",
      accessExpiration: process.env.JWT_ACCESS_EXP_USER ??"1h",
      refreshSignature: process.env.JWT_REFRESH_SECRET_USER ?? "default_user_refresh_secret",
      refreshExpiration: process.env.JWT_REFRESH_EXP_USER ?? "7d" ,
    },
    admin: {
      accessSignature: process.env.JWT_SECRET_ADMIN ?? "default_admin_access_secret",
      accessExpiration: process.env.JWT_ACCESS_EXP_ADMIN ?? "1h",
      refreshSignature: process.env.JWT_REFRESH_SECRET_ADMIN ?? "default_admin_refresh_secret",
      refreshExpiration: process.env.JWT_REFRESH_EXP_ADMIN ?? "7d" ,
    },
  },
  cors: {
    whiteListOrgins: process.env.CORS_WHITELISTED_ORIGINS?.split(","),
  },
  gcp: {
    webClientId: process.env.GCP_CLIENT_ID,
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  emails: {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  s3:{
    accessKeyId:process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY ?? '',
    region:process.env.AWS_REGION ?? '',
    bucketName:process.env.AWS_BUCKET_NAME ?? ''
  }
};

export default envConfig;