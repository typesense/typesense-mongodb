import { MongoClient as Client } from "mongodb";
import { databaseList } from "./interfaces/databaseList";

export class MongoClient {
  client: Client;
  url: string;
  mongoOptions: { useNewUrlParser: boolean; useUnifiedTopology: boolean };

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

  async listCollections(databaseName: string): Promise<void> {
    const collectionList = await this.client
      .db(databaseName)
      .listCollections()
      .toArray();
    console.log(collectionList);
  }

  constructor(url: string) {
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    this.client = new Client(url, mongoOptions);
    this.url = url;
  }
}
