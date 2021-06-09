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

  async connectMongo(): Promise<void> {
    try {
      await this.client.connect();
    } catch (e) {
      console.error(e);
    }
  }

  async closeMongo(): Promise<void> {
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

  async readDocuments(
    databaseName: string,
    collectionName: string
  ): Promise<Record<string, unknown>[]> {
    const db = this.client.db(databaseName);
    const result: Record<string, unknown>[] = await db
      .collection(collectionName)
      .find()
      .toArray();
    result.forEach((document) => {
      document.id = String(document._id);
      delete document._id;
    });
    console.log(result[0]);
    return result;
  }

  async watchForChanges(
    databaseName: string,
    collectionName: string,
    changesHandler: () => void
  ): Promise<void> {
    const collection = this.client.db(databaseName).collection(collectionName);
    const changeStream = collection.watch();
    changeStream.on("change", (next) => {
      console.log(JSON.stringify(next, null, 2));
    });
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
