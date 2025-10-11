import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateArticleDto {
  @ApiPropertyOptional({
    example:
      "https://img.freepik.com/free-vector/female-coach-explaining-statistics-businessmen-graph-company-analysis-flat-vector-illustration-business-marketing_74855-13069.jpg?semt=ais_hybrid&w=740&q=80",
    description: "Thumbnail image URL for the article",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

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
