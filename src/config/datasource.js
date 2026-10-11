import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5437,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "cidades_inteligentes",
  synchronize: false, // Conforme o guia: o banco só muda por migration!
  logging: true,
  entities: ["src/model/**/*.js"],
  migrations: ["db/migration/**/*.js"],
});