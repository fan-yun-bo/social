import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  check() {
    return {
      status: 'ok',
      service: 'social-ad-platform-api',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  async readiness() {
    const startedAt = new Date().toISOString();
    try {
      await this.dataSource.query('SELECT 1 AS ready');
      return {
        status: 'ready',
        database: 'ok',
        timestamp: startedAt,
      };
    } catch (error) {
      return {
        status: 'not_ready',
        database: 'error',
        message: error instanceof Error ? error.message : 'Unknown database error',
        timestamp: startedAt,
      };
    }
  }
}
