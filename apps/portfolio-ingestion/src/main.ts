import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { PortfolioIngestionService } from "./ingest";

async function bootstrap() {
  // Use `createApplicationContext` for a standalone script that doesn't need to listen for connections.
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const ingestionService = app.get(PortfolioIngestionService);
    await ingestionService.ingestAllOperations();
  } catch (error) {
    // The service already logs the specific error, so we just need to ensure the process exits with an error code.
    console.error("The ingestion process failed. See logs for details.", error);
    process.exit(1);
  } finally {
    // Ensure the application context is always closed to allow the process to exit.
    await app.close();
  }
}

bootstrap();
