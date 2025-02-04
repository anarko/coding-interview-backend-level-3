import "reflect-metadata";
import { DataSource } from "typeorm";
import { Item } from "../entities/item";
import { environment } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: environment.DATABASE_HOST,
  port: parseInt(environment.DATABASE_PORT ?? "5432"),
  username: environment.DATABASE_USER,
  password: environment.DATABASE_PASSWORD,
  database: environment.DATABASE_NAME,
  entities: [Item],
  synchronize: true,
  logging: false,
});

export const initializeDataSource = async (isTest = false) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
      .then(() => {})
      .catch((error) => console.log(error));
  }
  if (isTest) {
    await AppDataSource.manager.clear(Item);
  }
};

export const stopDataSource = async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy()
      .then(() => {})
      .catch((error) => console.log(error));
  }
};
