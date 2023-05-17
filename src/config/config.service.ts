import { Injectable } from '@nestjs/common';

import { DEFAULT_CONFIG } from './config.default';
import { ConfigData } from './config.interface';

/**
 * Provides a means to access the application configuration.
 */
@Injectable()
export class ConfigService {
  private config: ConfigData;

  constructor(data: ConfigData = DEFAULT_CONFIG) {
    this.config = data;
  }

  /**
   * Loads the config from environment variables.
   */
  public lofusingDotEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
    return {
      env: env.NODE_ENV || DEFAULT_CONFIG.env,
      port: Number(env.PORT) || DEFAULT_CONFIG.port,
      logLevel: env.LOG_LEVEL || DEFAULT_CONFIG.logLevel,
      jwtSecret: env.JWT_SECRET || DEFAULT_CONFIG.jwtSecret,
      refreshSecret: env.REFRESH_SECRET || DEFAULT_CONFIG.refreshSecret,
      cookieSecret: env.COOKIE_SECRET || DEFAULT_CONFIG.cookieSecret,
      transactionSecret:
        env.TRANSACTION_SECRET || DEFAULT_CONFIG.transactionSecret,
      tokenExpiresDurationInMinutesForUser:
        Number(env.TOKEN_EXPIRES_DURATION_IN_MINUTES) ||
        DEFAULT_CONFIG.tokenExpiresDurationInMinutesForUser,
      cacheExpiresDurationInMinutes:
        Number(env.CACHE_EXPIRES_DURATION_IN_MINUTES) ||
        DEFAULT_CONFIG.cacheExpiresDurationInMinutes,
      refreshExpiresDurationInYears:
        Number(env.REFRESH_EXPIRES_DURATION_IN_YEARS) ||
        DEFAULT_CONFIG.refreshExpiresDurationInYears,
      o16LabsDatabase: env.O16_LABS_DB || DEFAULT_CONFIG.o16LabsDatabase,
      o16LabsDatabaseType:
        env.O16_LABS_DB_TYPE || DEFAULT_CONFIG.o16LabsDatabaseType,
      o16LabsDatabaseHost:
        env.O16_LABS_DB_HOST || DEFAULT_CONFIG.o16LabsDatabaseHost,
      o16LabsDatabaseUsername:
        env.O16_LABS_DB_USERNAME || DEFAULT_CONFIG.o16LabsDatabaseUsername,
      o16LabsDatabasePassword:
        env.O16_LABS_DB_PASSWORD || DEFAULT_CONFIG.o16LabsDatabasePassword,
      o16LabsDatabasePort:
        Number(env.O16_LABS_DB_PORT) || DEFAULT_CONFIG.o16LabsDatabasePort,
    };
  }
  public get(): Readonly<ConfigData> {
    return this.config;
  }
}
