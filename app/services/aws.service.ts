import path from "node:path";

import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

class AwsService {
  client: S3Client;

  constructor() {
    const config: S3ClientConfig = {
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET as string,
      },
    };

    this.client = new S3Client(config);
  }

  async createPresignedUrl(key?: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET as string,
      Key: key || uuidv4(),
    });
    return getSignedUrl(this.client, command, { expiresIn: 180 }); // 3 min
  }

  async uploadImage(
    file: File,
    key?: string,
  ): Promise<string | { error: string }> {
    try {
      const client = this.client;

      const upload = new Upload({
        client,
        params: {
          Bucket: process.env.AWS_BUCKET,
          Key: key ? `${key}_${file?.name}` : `${uuidv4()}_${file.name}`,
          Body: file,
          ContentType: file.type,
        },
      });

      const res = await upload.done();

      if (!res.Location) {
        throw new Error("Failed to upload file");
      }

      return res.Location;
    } catch (err) {
      console.log(err);
      return { error: err?.message || "Unhandled error AWS service" };
    }
  }

  async uploadFileFromUrlToS3(fileUrl: string, key?: string) {
    try {
      const response = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "stream",
      });

      const fileExtension = path.extname(fileUrl);

      const s3FileName = `uploaded-file${fileExtension}`;

      const client = this.client;

      const upload = new Upload({
        client,
        params: {
          Bucket: process.env.AWS_BUCKET,
          Key: key ? `${key}_${s3FileName}` : `${uuidv4()}_${s3FileName}`,
          Body: response.data,
        },
      });

      const res = await upload.done();

      return res?.Location;
    } catch (err) {
      // console.error('Error uploading file:', err);
      throw err;
    }
  }
}

export default new AwsService();
