import type { MigrationConfig } from "drizzle-orm/migrator";
import { envOrThrow } from "./helpers.js";

process.loadEnvFile();
type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  platform: string; 
  fileserverHits: number;
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
fileserverHits: 0,
},
db: {
dbURL: envOrThrow("DB_URL"),
migrationConfig: migrationConfig
},                                  
};
