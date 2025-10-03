import { Injectable, Logger, OnModuleInit } from "@nestjs/common";

import { MemoryMonitor } from "../common/memory-monitor";

@Injectable()
export class MemoryCleanupService implements OnModuleInit {
  private readonly logger = new Logger(MemoryCleanupService.name);
  private cleanupInterval: NodeJS.Timeout;
  private healthCheckInterval: NodeJS.Timeout;

  onModuleInit() {
    this.logger.log("Memory cleanup service initialized");
    MemoryMonitor.logMemoryUsage("Service Init");

    // Set up periodic cleanup (every 5 minutes)
    this.cleanupInterval = setInterval(
      () => {
        this.performMemoryCleanup();
      },
      5 * 60 * 1000,
    );

    // Set up health check (every hour)
    this.healthCheckInterval = setInterval(
      () => {
        this.memoryHealthCheck();
      },
      60 * 60 * 1000,
    );
  }

  async performMemoryCleanup() {
    try {
      MemoryMonitor.logMemoryUsage("Before Cleanup");

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
        this.logger.debug("Forced garbage collection completed");
      }

      // Log memory after cleanup
      setTimeout(() => {
        MemoryMonitor.logMemoryUsage("After Cleanup");
      }, 1000);
    } catch (error) {
      this.logger.error(`Memory cleanup failed: ${error.message}`);
    }
  }

  async memoryHealthCheck() {
    const used = process.memoryUsage();
    const heapUsedMB = Math.round((used.heapUsed / 1024 / 1024) * 100) / 100;

    if (heapUsedMB > 2048) {
      // 2GB threshold
      this.logger.warn(`Critical memory usage: ${heapUsedMB}MB heap used`);

      // Force aggressive cleanup
      if (global.gc) {
        for (let i = 0; i < 3; i++) {
          global.gc();
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    }
  }

  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
}
