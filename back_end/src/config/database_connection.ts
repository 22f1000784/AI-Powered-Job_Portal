//data source
import { AppDataSource } from "./data_source";

export class DatabaseConnection {
    public static instance: DatabaseConnection;

    async init() {
        await this.postgresConnection();
    }

    async postgresConnection() {
        try {
            await AppDataSource.initialize();
            console.log("Postgres Connected...");
        } catch (error) {
            console.log("Postgres Error-", error);
        }
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
}