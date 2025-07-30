import { ConfigService } from "@codescape-financial/portfolio-config";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as chokidar from "chokidar";
import * as fs from "fs/promises";
import * as path from "path";
import { AppModule } from "./app/app.module.js";
import { CsvProcessingService } from "./csv-processing/csv-processing.service.js";

const logger = new Logger("Portfolio CSV Processor Worker");

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const csvProcessingService = app.get(CsvProcessingService);
  const configService = app.get(ConfigService);

  // Use ConfigService to get validated and expanded paths
  const quotesDir = configService.getCSVQuotesDir();
  const processedDir = configService.getCSVQuotesProcessedDir();
  const errorDir = configService.getCSVQuoteErrorsDir();

  // Ensure destination directories exist
  // This is the crucial fix: ensure the directory to be watched exists.
  await fs.mkdir(quotesDir, { recursive: true });
  await fs.mkdir(processedDir, { recursive: true });
  await fs.mkdir(errorDir, { recursive: true });

  logger.log(`Watching for CSV files in: ${quotesDir}`);
  logger.log(`Processed files will be moved to: ${processedDir}`);
  logger.log(`Files with errors will be moved to: ${errorDir}`);

  // Initialize watcher
  const watcher = chokidar.watch(quotesDir, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    persistent: true,
    awaitWriteFinish: {
      // Important for ensuring file is fully written before reading
      stabilityThreshold: 2000, // wait 2 seconds after file is done being written
      pollInterval: 100,
    },
    depth: 0, // Only watch top-level files, not subdirectories
  });

  const moveFile = async (filePath: string, destDir: string) => {
    const fileName = path.basename(filePath);
    const destPath = path.join(destDir, fileName);
    try {
      await fs.rename(filePath, destPath);
      logger.log(`Moved file ${filePath} to ${destPath}`);
    } catch (moveError) {
      logger.error(
        `Failed to move file ${filePath} to ${destDir}: ${moveError}`
      );
    }
  };

  watcher
    .on("ready", () =>
      // This log confirms the watcher is active and watching the correct path.
      logger.log(`Initial scan complete. Ready for new files in ${quotesDir}.`)
    )
    .on("add", async (filePath) => {
      logger.log(`New CSV file detected: ${filePath}`);
      try {
        await csvProcessingService.processFile(filePath);
        logger.log(`Successfully processed and imported: ${filePath}`);
        await moveFile(filePath, processedDir);
      } catch (error) {
        if (error instanceof Error) {
          logger.error(
            `Failed to process ${filePath}: ${error.message}`,
            error.stack
          );
        } else {
          logger.error(`Failed to process ${filePath}: ${error}`);
        }
        await moveFile(filePath, errorDir);
      }
    })
    .on("error", (error) => logger.error(`Watcher error: ${error}`));

  const shutdown = async () => {
    logger.log("Shutting down watcher and application...");
    await watcher.close();
    await app.close();
    process.exit(0);
  };

  // Graceful shutdown
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap();
