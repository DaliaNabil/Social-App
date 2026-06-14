import crypto from "node:crypto";
import argon2 from "argon2";
import envConfig from "../../config/env.config";

const encryptionEnv = envConfig.encryption;

class SecurityService {

    encryptionKey = Buffer.from(encryptionEnv.ENCRYPTION_KEY, 'hex')
 
  encrypt(plainText: string): string {
        const iv = crypto.randomBytes(parseInt(encryptionEnv.IV_LENGTH));

    const cipher = crypto.createCipheriv("aes-256-cbc", this.encryptionKey, iv);

    let encrypted = cipher.update(plainText, "utf-8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
  }
  
  //phoneNumber

  static encryptPhone(plainText: string): string {
    const encryptionEnv = envConfig.encryption;
    const key = Buffer.from(encryptionEnv.ENCRYPTION_KEY, 'hex');
    
    return crypto
      .createHmac("sha256", key)
      .update(plainText)
      .digest("hex");
  }

 
decrypt(inputCipher: string): string {

  if (!inputCipher || !inputCipher.includes(":")) {
    console.warn("Skipping decryption: Invalid format or plain text data");
    return inputCipher;
  }

  try {
    const [iv, encryptData] = inputCipher.split(":");
    if (!iv || !encryptData) return inputCipher;

    const bufferedIv = Buffer.from(iv, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", this.encryptionKey, bufferedIv);

    let decrypted = decipher.update(encryptData, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return inputCipher; 
  }
}
  
  async hashPassword(plainText: string): Promise<string> {
    return await argon2.hash(plainText);
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return await argon2.verify(hashedText, plainText);
  }
}

export default  SecurityService; 