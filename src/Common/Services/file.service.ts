import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { S3Client } from "../Clients/s3.client";
import { BadRequstException } from "../Utils";

class FileService extends S3Client {


  async uploadFile(file: Express.Multer.File, key: string) {
    if (!file || !key) {
      throw new BadRequstException("file and folder name are required");
    }

    if (!file.mimetype) {
      throw new BadRequstException("Invalid file: Mimetype is missing");
    }

    const fileKey = `${key}/${Date.now()}-${file.originalname}`;

    await this.putObjectClient(file, fileKey);
    return this.renewFileUrl(fileKey, 60);
  }

 async uploadFiles(files: Express.Multer.File[], key: string) { 
  if (!files || files.length === 0 || !key) {
    throw new BadRequstException("files and folder name are required");
  }

  
  const uploadPromises = files.map(async (file) => {
   
    if (!file.mimetype) {
      throw new BadRequstException(`Invalid file: ${file.originalname} is missing mimetype`);
    }

    const fileKey = `${key}/${Date.now()}-${file.originalname}`;
    
    await this.putObjectClient(file, fileKey);
    
    return { Key: fileKey }; 
  });


  return await Promise.all(uploadPromises);
 }

 
 async renewFileUrl(key: string, expiresIn: number = 60) {
   return this.getSignedUrlClient(key, expiresIn);
  }


  async deleteFile(key:string) {
   if(!key) throw new BadRequstException("Key is required")
    return this.deleteObjectClient(key)
  }
async deletFiles(keys: string[]) {
  
  const validKeys = (keys || []).filter(key => typeof key === 'string' && key.trim().length > 0);


if (validKeys.length === 0) {
  console.error("Error: deletFiles is empty or invalid array.");
  return;
}

const objectsToDelete = validKeys.map((key) => ({ Key: key }));

console.log("Files to be deleted from S3:", JSON.stringify(objectsToDelete));
  return await this.deleteObjectsClient(objectsToDelete);
}
}

const fileService = new FileService();
export default fileService;
