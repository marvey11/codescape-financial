import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger } from "@nestjs/common";
import type { Cache } from "cache-manager";

const DEFAULT_TTL_MILLISECONDS = 60 * 60 * 1000;

@Injectable()
export class PortfolioCachingService {
  private readonly logger = new Logger(PortfolioCachingService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Retrieves an item from the cache, or generates it if not found and then caches it.
   *
   * @param cacheKey The unique key for the item in the cache.
   * @param generateObjectFn An async function that generates the object if it's not in the cache.
   * @param ttlMilliseconds The time-to-live for the cached item in milliseconds. Defaults to DEFAULT_TTL_MILLISECONDS.
   * @returns A Promise that resolves to the cached or newly generated object.
   */
  async getOrCreateAndCache<T>(
    cacheKey: string,
    generateObjectFn: () => Promise<T>,
    ttlMilliseconds: number = DEFAULT_TTL_MILLISECONDS,
  ): Promise<T> {
    try {
      // 1. Attempt to retrieve from cache
      const cachedObject = await this.cacheManager.get<T>(cacheKey);
      if (cachedObject) {
        this.logger.debug(`Cache hit for key: ${cacheKey}`);
        return cachedObject;
      }

      this.logger.debug(
        `Cache miss for key: ${cacheKey}. Generating object...`,
      );

      // 2. If not in cache, generate the object
      const newObject = await generateObjectFn();

      // 3. Store the newly generated object in the cache
      await this.cacheManager.set(cacheKey, newObject, ttlMilliseconds);
      this.logger.debug(`Object generated and cached for key: ${cacheKey}`);

      return newObject;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error during caching operation for key ${cacheKey}:`,
          error.stack,
        );
      }

      // Decide how to handle caching errors:
      // Option A: Re-throw the error, letting the caller handle it. (Recommended for critical errors)
      // Option B: Return null/undefined, or fall back to non-cached data. (If caching is optional)
      // For now, we'll re-throw to ensure the original operation still fails if generation failed.
      throw error;
    }
  }
}
