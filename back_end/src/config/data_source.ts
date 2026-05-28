import { DataSource } from "typeorm";
import "reflect-metadata";
import { config } from "dotenv";
config();

console.log("DB URL:", process.env.DATABASE_URL);
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // comes from .env

  synchronize: true, // auto-create tables (dev only)
  logging: false,

  entities: [__dirname + "/../entities/*.{ts,js}"],


  migrations: [],
  subscribers: [],
});