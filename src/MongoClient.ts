import { MongoClient as Client } from "mongodb";
import { databaseList } from "./interfaces/databaseList";
export class MongoClient {
  private client: Client;
  private url: string;
  private mongoOptions: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
  };

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

  async insertDocuments(
    databaseName: string,
    collectionName: string
  ): Promise<void> {
    const books = await require("../data/books.json");
    const sample_data = books.slice(0, 5000);
    const db = this.client.db(databaseName);
    const result = await db.collection(collectionName).insertMany(sample_data);
    console.log(result.insertedCount);
  }

  constructor(url: string) {
    this.mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    this.client = new Client(url, this.mongoOptions);
    this.url = url;
  }
}
