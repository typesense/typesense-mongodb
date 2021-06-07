import { MongoClient as Client } from "mongodb";

export class MongoClient {
  client: Client;
  async listAlldatabases(): Promise<void> {
    const dbList = await this.client.db().admin().listDatabases();
    console.log(dbList);
  }

  async connectDb(): Promise<void> {
    try {
      await this.client.connect();
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
