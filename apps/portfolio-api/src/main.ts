import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";

const GLOBAL_PREFIX = "api";
const logger = new Logger("Bootstrap");

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(GLOBAL_PREFIX);
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );

    const port = 3000;

    await app.listen(port);

    logger.log(
      `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`,
    );
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`❌ Failed to bootstrap application`, error.stack);
    } else {
      logger.error(
        `❌ Failed to bootstrap application with a non-error`,
        error,
      );
    }
    process.exit(1);
  }
}

bootstrap();
