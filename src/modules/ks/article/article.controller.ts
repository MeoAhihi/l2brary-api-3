import { PermissionEnum } from "@/common/permission.enum";
import { JwtAuthGuard } from "@/modules/iam/authentication/guards/jwt.guard";
import { RequirePermission } from "@/modules/iam/authorization/decorators/permission.decorator";
import { PermissionGuard } from "@/modules/iam/authorization/guards/permission.guard";

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery , ApiOperation } from "@nestjs/swagger";

import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";

@Controller("article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ 
    summary: "Create article", 
    description: "Create a new article. Requires JWT authentication.",
    tags: ["Article Management"]
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiQuery({
    name: "authorId",
    required: true,
    type: String,
    description: "ID of the author creating the article",
    example: "10eb0c67-78a2-470f-998f-ab83dbbe75b2",
  })
  create(
    @Query("authorId") authorId: string,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.create(authorId, createArticleDto);
  }

  @ApiOperation({ 
    summary: "Get all articles", 
    description: "Retrieve all published articles with filtering options. No authentication required.",
    tags: ["Article Management"]
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
  findAll(
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
    return this.articleService.findAll({
      page,
      limit,
      searchTitle,
      tags: tagsArray,
      isPublish: true,
    });
  }

  @ApiOperation({ 
    summary: "Get article by ID", 
    description: "Retrieve a specific article by its ID. No authentication required.",
    tags: ["Article Management"]
  })
  /* Intentional No Guard */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articleService.findOne(id);
  }

  @ApiOperation({ 
    summary: "Update article", 
    description: "Update an existing article. Requires JWT authentication.",
    tags: ["Article Management"]
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @ApiOperation({ 
    summary: "Delete article", 
    description: "Delete an article. Requires JWT authentication.",
    tags: ["Article Management"]
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.articleService.remove(id);
  }

  @ApiOperation({ 
    summary: "Review article", 
    description: "Publish or unpublish an article. Requires admin permissions.",
    tags: ["Article Management"]
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
    return this.articleService.review(id, isPublished);
  }
}
