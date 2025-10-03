import { Logger } from "@nestjs/common";

export class MemoryMonitor {
  private static readonly logger = new Logger("MemoryMonitor");

  static logMemoryUsage(context?: string): void {
    const used = process.memoryUsage();
    const memoryInfo = {
      rss: `${Math.round((used.rss / 1024 / 1024) * 100) / 100} MB`, // Resident Set Size
      heapTotal: `${Math.round((used.heapTotal / 1024 / 1024) * 100) / 100} MB`,
      heapUsed: `${Math.round((used.heapUsed / 1024 / 1024) * 100) / 100} MB`,
      external: `${Math.round((used.external / 1024 / 1024) * 100) / 100} MB`,
      arrayBuffers: `${Math.round((used.arrayBuffers / 1024 / 1024) * 100) / 100} MB`,
    };

    const contextStr = context ? `[${context}]` : "";
    this.logger.debug(
      `Memory usage ${contextStr}: ${JSON.stringify(memoryInfo)}`,
    );

    // Log warning if heap usage is high (>1536MB - half of 3072MB)
    if (used.heapUsed > 1536 * 1024 * 1024) {
      this.logger.warn(
        `High memory usage detected: ${memoryInfo.heapUsed} heap used`,
      );
    }
  }

  static async withMemoryMonitoring<T>(
    operation: () => Promise<T>,
    context: string,
  ): Promise<T> {
    this.logMemoryUsage(`${context} - Before`);
    try {
      const result = await operation();
      this.logMemoryUsage(`${context} - After`);
      return result;
    } catch (error) {
      this.logMemoryUsage(`${context} - Error`);
      throw error;
    }
  }

  static forceGarbageCollection(): void {
    if (global.gc) {
      global.gc();
      this.logger.debug("Forced garbage collection");
    } else {
      this.logger.warn(
        "Garbage collection not available. Run with --expose-gc flag",
      );
    }
  }
}
