import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateArticleDto {
  @ApiProperty({
    example: "How to use NestJS",
    description: "Title of the article",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: ["nestjs", "backend", "typescript"],
    description: "Tags associated with the article",
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    example: "NestJS is a progressive Node.js framework...",
    description: "Content of the article",
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
