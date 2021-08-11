import { ChangeStream, MongoClient as Client } from 'mongodb';
export class MongoClient {
  private client: Client;
  private url: string;
  private mongoOptions: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
  };

  async listAllDatabases(): Promise<string[]> {
    let dbList = await this.client.db().admin().listDatabases();
    dbList = dbList.databases.map((database) => {
      return database.name;
    });
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

  async listCollections(databaseName: string): Promise<string[]> {
    let collectionList = await this.client
      .db(databaseName)
      .listCollections()
      .toArray();
    collectionList = collectionList.map((collection) => {
      return collection.name;
    });
    return collectionList;
  }

  async insertDocuments(
    databaseName: string,
    collectionName: string
  ): Promise<void> {
    const books = await require('../data/books.json');
    const sample_data = books.slice(0, 5000);
    const db = this.client.db(databaseName);
    await db.collection(collectionName).insertMany(sample_data);
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
    return result;
  }

  changeStreams(
    databaseName: string,
    collectionName: string
  ): ChangeStream<unknown> {
    const collection = this.client.db(databaseName).collection(collectionName);
    const changeStream = collection.watch([], { fullDocument: 'updateLookup' });
    return changeStream;
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
