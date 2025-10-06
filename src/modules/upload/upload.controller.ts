import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

import { UploadService } from "./upload.service";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("image")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload an image file" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "The image has been successfully uploaded.",
    schema: {
      example: {
        key: "1681234567890-.jpg",
        url: "https://s3.filebase.com/my-img/1681234567890-.jpg",
      },
    },
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }

  @Get("image/:key")
  @ApiOperation({ summary: "Get image as blob by key" })
  @ApiResponse({
    status: 200,
    description: "Returns the image as a blob (Buffer)",
    schema: {
      type: "string",
      format: "binary",
    },
  })
  async getImageBlob(@Param("key") key: string, @Res() res) {
    const buffer = await this.uploadService.getImageBlob(key);
    res.set({
      "Content-Type": "image/jpeg", // You may want to determine the actual content type
      "Content-Disposition": `inline; filename="${key}"`,
      "Content-Length": buffer.length,
    });
    res.send(buffer);
  }
}
