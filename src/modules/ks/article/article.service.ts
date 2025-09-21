import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { UserService } from "src/modules/iam/user/user.service";
import { Article } from "./entities/article.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly userService: UserService
  ) {}

  async create(
    authorId: string,
    createArticleDto: CreateArticleDto
  ): Promise<Article> {
    const author = await this.userService.findOne(authorId);

    const article = this.articleRepository.create({
      title: createArticleDto.title,
      content: createArticleDto.content,
      author,
      tags: createArticleDto.tags,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.articleRepository.save(article);
  }

  async findAll({
    page = 1,
    limit = 10,
    searchTitle,
    tags,
  }: {
    page?: number;
    limit?: number;
    searchTitle?: string;
    tags?: string[];
  } = {}): Promise<{
    data: Partial<Article>[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.author", "author")
      .orderBy("article.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .select([
        "article.id",
        "article.title",
        "article.tags",
        "article.isPublished",
        "article.createdAt",
        "article.updatedAt",
        "author.id",
        "author.fullName",
        "author.internationalName",
        "author.gender",
        "author.birthdate",
        "author.phoneNumber",
        "author.email",
      ]);

    // Build where conditions
    let whereExpr = "";
    let params: Record<string, any> = {};

    if (searchTitle) {
      whereExpr = "article.title LIKE :searchTitle";
      params.searchTitle = `%${searchTitle}%`;
    }

    if (tags && tags.length > 0) {
      // Filter articles that have ALL the specified tags
      // For each tag, add a condition: FIND_IN_SET(:tagN, article.tags) > 0
      const tagConds = tags.map((tag, idx) => {
        const paramName = `tag${idx}`;
        params[paramName] = tag;
        // For Postgres, use array position; for MySQL, use FIND_IN_SET
        // Since article.tags is a simple-array, we can use LIKE for each tag
        // e.g. ','||article.tags||',' LIKE '%,tag,%'
        // But for simplicity, use LIKE '%,tag,%' or LIKE 'tag,%' or LIKE '%,tag' or = 'tag'
        // But here, we use: article.tags LIKE :tagPatternN
        params[`${paramName}Pattern`] = `%${tag}%`;
        return `article.tags LIKE :${paramName}Pattern`;
      });
      if (whereExpr) {
        whereExpr += " AND ";
      }
      whereExpr += tagConds.join(" AND ");
    }

    if (whereExpr) {
      queryBuilder.where(whereExpr, params);
    }

    const [articles, total] = await queryBuilder.getManyAndCount();

    // Remove content field if it exists (shouldn't be selected, but for safety)
    const data = articles.map(({ content, ...rest }) => rest);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} does not exist`);
    }

    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} does not exist`);
    }

    // Update fields
    Object.assign(article, updateArticleDto);
    article.updatedAt = new Date()

    await this.articleRepository.save(article);

    return article;
  }

  remove(id: string) {
    return `This action removes a #${id} article`;
  }
}
