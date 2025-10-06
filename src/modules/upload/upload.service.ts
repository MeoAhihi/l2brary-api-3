import { NotFound, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { extname } from "path";

import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucket: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>("FILEBASE_BUCKET") ?? "my-img";

    this.s3 = new S3Client({
      region: "us-east-1",
      endpoint:
        this.config.get<string>("FILEBASE_ENDPOINT") ??
        "https://s3.filebase.com",
      credentials: {
        accessKeyId: this.config.get<string>("FILEBASE_ACCESS_KEY") ?? "",
        secretAccessKey: this.config.get<string>("FILEBASE_SECRET_KEY") ?? "",
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const key = `${Date.now()}${extname(file.originalname)}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);
    const baseUrl = this.config.get<string>("BASE_URL") ?? "";
    return {
      key,
      url: `${baseUrl}/v1/api/upload/image/${key}`,
    };
  }

  async getImageBlob(key: string): Promise<Buffer> {
    try {
      const { GetObjectCommand } = await import("@aws-sdk/client-s3");
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.s3.send(command);

      // response.Body is a stream, so we need to convert it to a Buffer
      const streamToBuffer = (stream: any): Promise<Buffer> => {
        return new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          stream.on("data", (chunk: Buffer) => chunks.push(chunk));
          stream.on("end", () => resolve(Buffer.concat(chunks)));
          stream.on("error", reject);
        });
      };

      return streamToBuffer(response.Body);
    } catch (error) {
      // You can customize the error handling as needed
      console.error(error);
      throw new NotFoundException("File not found");
    }
  }
}
