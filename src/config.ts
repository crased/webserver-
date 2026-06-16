import type { MigrationConfig } from "drizzle-orm/migrator";
import { envOrThrow } from "./helpers.js";

process.loadEnvFile();
type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  platform: string; 
  jwtSecret: string;
  fileserverHits: number;
  polkaKey: string;
};

type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
api: {
platform: envOrThrow("PLATFORM"),
jwtSecret: envOrThrow("JWTSECRET"),  
fileserverHits: 0,
polkaKey: envOrThrow("POLKA_KEY")
},
db: {
dbURL: envOrThrow("DB_URL"),
migrationConfig: migrationConfig
},                                  
};
