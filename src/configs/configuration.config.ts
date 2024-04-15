export interface IDatabaseConfig {
  host: string;
  port: number;
  uri: string;
}

export const databaseConfig = (): IDatabaseConfig => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  uri: process.env.DATABASE_URI,
});

export interface IAppConfig {
  port: number;
  jwt_key: string;
}

export const appConfig = (): IAppConfig => ({
  port: parseInt(process.env.PORT),
  jwt_key: process.env.JWT_SECRET_KEY,
});
