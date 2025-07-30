import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { ApplicationConfigSchema } from "./application-config-schema";
import { ConfigService } from "./config.service";

@Module({
  imports: [
    NestConfigModule.forRoot({
      // Load .env files from the root of the monorepo first, then from the app's directory
      // This allows you to have a global .env and then app-specific .env files.
      envFilePath: [
        `${process.cwd()}/.env`, // Monorepo root .env
        `${process.cwd()}/apps/portfolio-api/.env`, // .env specific to REST API
        `${process.cwd()}/apps/portfolio-csv-processor/.env`, // .env specific to CSV processor
      ],
      isGlobal: true, // Makes ConfigModule available everywhere without re-importing
      validationSchema: ApplicationConfigSchema,
      // The validate function is required to bridge Zod's .parse method
      // with NestJS's configuration validation system.
      validate: ApplicationConfigSchema.parse,
      validationOptions: {
        allowUnknown: true, // Allow unknown keys in process.env
        abortEarly: false, // Report all errors, not just the first
      },
      expandVariables: true, // Expand environment variables in .env files
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class SharedConfigModule {}
