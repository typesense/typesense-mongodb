import { MongoClient as Client } from "mongodb";
import { databaseList } from "./interfaces/databaseList";

export class MongoClient {
  client: Client;
  async listAlldatabases(): Promise<databaseList> {
    const dbList = await this.client.db().admin().listDatabases();
    return dbList;
  }

  async connectDb(): Promise<void> {
    try {
      await this.client.connect();
    } catch (e) {
      console.error(e);
    }
  }

  async closeDb(): Promise<void> {
    try {
      await this.client.close();
    } catch (e) {
      console.error(e);
    }
  }

  constructor(url: string) {
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    this.client = new Client(url, mongoOptions);
  }
}
