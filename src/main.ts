import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix("/v1/api");

  if (process.env.ENABLE_CORS === "true") {
    app.enableCors({
      origin: "*",
      methods: "*",
      credentials: true,
    });
  }

  // Swagger config.
  const enableSwagger = process.env.ENABLE_SWAGGER === "true";
  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle("Backend APIs")
      .setDescription("All backend APIs for the product.")
      .setVersion("1.0")
      .addBearerAuth({ type: "http", in: "header" })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };
    SwaggerModule.setup("docs", app, document, customOptions);
  }

  const port = process.env.PORT ?? 3000;
  const mainUrl = `http://localhost:${port}`;

  await app.listen(port, () =>
    logger.log(`application is running on port ${port}`),
  );

  if (enableSwagger) {
    console.log(`Swagger API documentation is running on ${mainUrl}/docs`);
  }
}
void bootstrap();
