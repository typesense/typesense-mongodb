import { MongoClient as Client } from "mongodb";

export class MongoClient {
  client: Client;
  constructor(url: string) {
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    this.client = new Client(url, mongoOptions);
  }
}
