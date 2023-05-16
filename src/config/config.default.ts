import { ConfigData } from './config.interface';

export const DEFAULT_CONFIG: ConfigData = {
  databaseType: 'postgres',
  env: 'development',
  port: 3000,
  logLevel: 'info',
  jwtSecret: 'random string',
  refreshSecret: 'random string',
  cookieSecret: 'random string',
  transactionSecret: 'random string',
  o16labsDatabaseURI: undefined,
  tokenExpiresDurationInMinutesForClient: 60,
  cacheExpiresDurationInMinutes: 60,
  refreshExpiresDurationInYears: 1,
};
