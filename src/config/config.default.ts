import { ConfigData } from './config.interface';

export const DEFAULT_CONFIG: ConfigData = {

  env: 'development',
  port: 3000,
  logLevel: 'info',
  jwtSecret: 'random string',
  refreshSecret: 'random string',
  cookieSecret: 'random string',
  transactionSecret: 'random string',
  tokenExpiresDurationInMinutesForUser: 60,
  cacheExpiresDurationInMinutes: 60,
  refreshExpiresDurationInYears: 1,
  o16LabsDatabaseType: 'postgres',
  o16LabsDatabaseHost: 'db',
  o16LabsDatabaseUsername: 'postgres',
  o16LabsDatabasePassword: 'postgres',
  o16LabsDatabase: 'postgres',
  o16LabsDatabasePort: 5432,
};
