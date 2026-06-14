import {
  S3Client as AwsS3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { envConfig } from "../../config";
import strict from "node:assert/strict";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { string } from "zod";

const s3Config = envConfig.s3;

export abstract class S3Client {
  private s3Client = new AwsS3Client({
    region: s3Config.region,
    credentials: {
      accessKeyId: s3Config.accessKeyId,
      secretAccessKey: s3Config.secretAccessKey,
    },
  });
  private bucketName = s3Config.bucketName;

  async putObjectClient(file: Express.Multer.File, key: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    return await this.s3Client.send(command);
  }

  async getSignedUrlClient(key: string ,expiresIn:number =3600) {
    //getobject command
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })
    const url = await getSignedUrl(this.s3Client ,command , {expiresIn:3600})
    return { key , url}
  }
  async deleteObjectClient(key:string){
    const command = new DeleteObjectCommand({
        Bucket:this.bucketName,
        Key:key
    })
    return this.s3Client.send(command)
}

// في src/Clients/s3.client.ts

async deleteObjectsClient(keys: { Key: string }[]) {
  const command = new DeleteObjectsCommand({
    Bucket: this.bucketName,
    Delete: {
      Objects: keys, 
      Quiet: false,  
    },
  });
  return await this.s3Client.send(command);
}
}
