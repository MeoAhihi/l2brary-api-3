import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";
import { AuthRequest } from "@/modules/iam/types/auth-request.type";
import { plainToInstance } from "class-transformer";

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery } from "@nestjs/swagger";

import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { Article } from "./entities/article.entity";

@Controller("article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({
    summary: "Create article",
    description: "Create a new article. Requires JWT authentication.",
    tags: ["Article Management"],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: AuthRequest,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    const article = await this.articleService.create(
      req.user.sub,
      createArticleDto,
    );
    return plainToInstance(Article, article, { excludeExtraneousValues: true });
  }

  @ApiOperation({
    summary: "Get all articles",
    description:
      "Retrieve all published articles with filtering options. No authentication required.",
    tags: ["Article Management"],
  })
  /* Intentional No Guard */
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({
    name: "searchTitle",
    required: false,
    type: String,
  })
  @ApiQuery({
    name: "tags",
    required: false,
    type: String,
    description: "Filter by tags (space separated or repeated query param)",
  })
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("searchTitle") searchTitle?: string,
    @Query("tags") tags?: string,
  ) {
    // Support both space-separated and repeated query param for tags
    let tagsArray: string[] | undefined;
    if (typeof tags === "string") {
      tagsArray = tags
        .split(" ")
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (Array.isArray(tags)) {
      tagsArray = tags;
    }
    const articles = await this.articleService.findAll({
      page,
      limit,
      searchTitle,
      tags: tagsArray,
      isPublish: true,
    });
    articles.data = plainToInstance(Article, articles.data, {
      excludeExtraneousValues: true,
    });
    return articles;
  }

  @ApiOperation({
    summary: "Get article by ID",
    description:
      "Retrieve a specific article by its ID. No authentication required.",
    tags: ["Article Management"],
  })
  /* Intentional No Guard */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articleService
      .findOne(id)
      .then((article) =>
        plainToInstance(Article, article, { excludeExtraneousValues: true }),
      );
  }

  @ApiOperation({
    summary: "Update article",
    description: "Update an existing article. Requires JWT authentication.",
    tags: ["Article Management"],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService
      .update(id, updateArticleDto)
      .then((article) =>
        plainToInstance(Article, article, { excludeExtraneousValues: true }),
      );
  }

  @ApiOperation({
    summary: "Review article",
    description: "Publish or unpublish an article. Requires admin permissions.",
    tags: ["Article Management"],
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ARTICLE_REVIEW_UPDATE)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch(":id/review")
  @ApiQuery({
    name: "isPublished",
    required: true,
    type: Boolean,
    description: "Set to true to publish the article, false to unpublish",
  })
  review(@Param("id") id: string, @Query("isPublished") isPublished: boolean) {
    return this.articleService
      .review(id, isPublished)
      .then((article) =>
        plainToInstance(Article, article, { excludeExtraneousValues: true }),
      );
  }
}
