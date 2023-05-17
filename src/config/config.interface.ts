/**
 * Configuration data for the app.
 */
export interface ConfigData {
  env: string;

  /** The port number of the http server to listen on. */
  port: number;

  /**
   * The log level to use.
   * @example 'verbose', 'info', 'warn', 'error'
   */
  logLevel: string;

  jwtSecret: string;
  refreshSecret: string;
  cookieSecret: string;
  transactionSecret: string;

  /** Database connection details. */

  o16LabsDatabase: string;
  o16LabsDatabaseType: string;
  o16LabsDatabaseHost: string;
  o16LabsDatabaseUsername: string;
  o16LabsDatabasePassword: string;
  o16LabsDatabasePort: number;

  //* Duration of the token and cookie in  minutes
  tokenExpiresDurationInMinutesForUser: number;
  cacheExpiresDurationInMinutes: number;
  refreshExpiresDurationInYears: number;
}
