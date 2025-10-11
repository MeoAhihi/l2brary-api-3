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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";

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
  @ApiCreatedResponse({
    example: {
      id: "e74684f3-b243-4f50-8124-e7d075314902",
      thumbnail:
        "https://img.freepik.com/free-vector/female-coach-explaining-statistics-businessmen-graph-company-analysis-flat-vector-illustration-business-marketing_74855-13069.jpg?semt=ais_hybrid&w=740&q=80",
      title: "How to use NestJS",
      content: "NestJS is a progressive Node.js framework...",
      author: {
        id: "367276c4-f513-4331-86fe-be31f488960c",
        fullName: "Johny Doe",
        internationalName: "J. Doe",
      },
      tags: ["nestjs", "backend", "typescript"],
      isPublished: false,
      createdAt: "2025-10-11T07:14:35.412Z",
      updatedAt: "2025-10-11T07:14:35.412Z",
    },
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
    summary: "Get all public articles",
    description:
      "Retrieve all published articles with filtering options. No authentication required.",
    tags: ["Article Management"],
  })
  @ApiOkResponse({
    example: {
      data: [
        {
          id: "e74684f3-b243-4f50-8124-e7d075314902",
          title: "How to use NestJS",
          author: {
            id: "367276c4-f513-4331-86fe-be31f488960c",
            fullName: "Johny Doe",
            internationalName: "J. Doe",
          },
          tags: ["nestjs", "backend", "typescript"],
          isPublished: true,
          createdAt: "2025-10-11T07:14:35.412Z",
          updatedAt: "2025-10-11T07:21:25.650Z",
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    },
  })
  /* Intentional No Guard */
  @Get("public")
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
    const items = plainToInstance(Article, articles.data, {
      excludeExtraneousValues: true,
    });
    return {
      items: plainToInstance(Article, articles.data, {
        excludeExtraneousValues: true,
      }),
      page: articles.page,
      limit: articles.limit,
      total: articles.total,
      pageCount: Math.ceil(articles.total / articles.limit),
    };
  }

  @ApiOperation({
    summary: "Get all articles (admin)",
    description:
      "Retrieve all articles regardless of publish status. Requires JWT authentication and ARTICLE_READ_ALL permission.",
    tags: ["Article Management"],
  })
  @ApiOkResponse({
    example: {
      data: [
        {
          id: "e74684f3-b243-4f50-8124-e7d075314902",
          title: "How to use NestJS",
          author: {
            id: "367276c4-f513-4331-86fe-be31f488960c",
            fullName: "Johny Doe",
            internationalName: "J. Doe",
          },
          tags: ["nestjs", "backend", "typescript"],
          isPublished: true,
          createdAt: "2025-10-11T07:14:35.412Z",
          updatedAt: "2025-10-11T07:21:25.650Z",
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPage: 1,
    },
  })
  @ApiBearerAuth()
  @RequirePermission(PermissionEnum.ARTICLE_READ_ALL)
  @UseGuards(JwtAuthGuard, PermissionGuard)
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
  async findAllAdmin(
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
      // Do not filter by publish status for admin endpoint
    });
    return {
      items: plainToInstance(Article, articles.data, {
        excludeExtraneousValues: true,
      }),
      page: articles.page,
      limit: articles.limit,
      total: articles.total,
      totalPage: Math.ceil(articles.total / articles.limit),
    };
  }

  @ApiOperation({
    summary: "Get article by ID",
    description:
      "Retrieve a specific article by its ID. No authentication required.",
    tags: ["Article Management"],
  })
  @ApiOkResponse({
    example: {
      id: "e74684f3-b243-4f50-8124-e7d075314902",
      thumbnail:
        "https://img.freepik.com/free-vector/female-coach-explaining-statistics-businessmen-graph-company-analysis-flat-vector-illustration-business-marketing_74855-13069.jpg?semt=ais_hybrid&w=740&q=80",
      title: "How to use NestJS",
      content: "NestJS is a progressive Node.js framework...",
      author: {
        id: "367276c4-f513-4331-86fe-be31f488960c",
        fullName: "Johny Doe",
        internationalName: "J. Doe",
      },
      tags: ["nestjs", "backend", "typescript"],
      isPublished: true,
      createdAt: "2025-10-11T07:14:35.412Z",
      updatedAt: "2025-10-11T07:21:25.650Z",
    },
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
  @ApiOkResponse({
    example: {
      id: "e74684f3-b243-4f50-8124-e7d075314902",
      thumbnail:
        "https://img.freepik.com/free-vector/female-coach-explaining-statistics-businessmen-graph-company-analysis-flat-vector-illustration-business-marketing_74855-13069.jpg?semt=ais_hybrid&w=740&q=80",
      title: "How to use NestJS",
      content: "NestJS is a progressive Node.js framework...",
      author: {
        id: "367276c4-f513-4331-86fe-be31f488960c",
        fullName: "Johny Doe",
        internationalName: "J. Doe",
      },
      tags: ["nestjs", "backend", "typescript"],
      isPublished: false,
      createdAt: "2025-10-11T07:14:35.412Z",
      updatedAt: "2025-10-11T07:20:42.571Z",
    },
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
  @ApiOkResponse({
    example: {
      id: "e74684f3-b243-4f50-8124-e7d075314902",
      thumbnail:
        "https://img.freepik.com/free-vector/female-coach-explaining-statistics-businessmen-graph-company-analysis-flat-vector-illustration-business-marketing_74855-13069.jpg?semt=ais_hybrid&w=740&q=80",
      title: "How to use NestJS",
      content: "NestJS is a progressive Node.js framework...",
      author: {
        id: "367276c4-f513-4331-86fe-be31f488960c",
        fullName: "Johny Doe",
        internationalName: "J. Doe",
      },
      tags: ["nestjs", "backend", "typescript"],
      isPublished: false,
      createdAt: "2025-10-11T07:14:35.412Z",
      updatedAt: "2025-10-11T07:20:42.571Z",
    },
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
