import { ChangeEventCR, ChangeEventUpdate, ChangeStream } from "mongodb";
import { MongoClient } from "./MongoClient";
import { TypesenseClient } from "./TypesenseClient";

enum Events {
  insert = "insert",
  update = "update",
  replace = "replace",
  delete = "delete",
  drop = "drop",
  rename = "rename",
  dropDatabase = "dropDatabase",
  invalidate = "invalidate",
}

export class ChangeStreams {
  private mongo: MongoClient;
  private typesense: TypesenseClient;
  private mongoDatabaseName: string;
  private mongoCollectionName: string;
  private typesenseCollectionName: string;
  private changeStream: ChangeStream<unknown>;

  constructor(
    mongo: MongoClient,
    typesense: TypesenseClient,
    databaseName: string,
    collectionName: string
  ) {
    this.mongo = mongo;
    this.typesense = typesense;
    this.mongoDatabaseName = databaseName;
    this.mongoCollectionName = collectionName;
    this.typesenseCollectionName = `${databaseName}_${collectionName}`;
    this.changeStream = this.mongo.changeStreams(
      this.mongoDatabaseName,
      this.mongoCollectionName
    );
    this.changeStream.on("change", async (response) => {
      console.log(response.operationType);
      if (response.operationType === Events.insert) {
        await this.insert(response);
      }
      if (response.operationType === Events.update) {
        await this.update(response);
      }
      if (response.operationType === Events.replace) {
        await this.replace(response);
      }
    });
  }

  async closeChangeStream(): Promise<void> {
    this.changeStream.close();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async insert(response: ChangeEventCR<any>): Promise<void> {
    const data = response.fullDocument;
    Object.assign(data, {
      id: String(response.documentKey._id),
    });
    delete data._id;
    await this.typesense.insertDocument(this.typesenseCollectionName, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(response: ChangeEventUpdate<any>): Promise<void> {
    const data = response.fullDocument;
    Object.assign(data, {
      id: String(response.documentKey._id),
    });
    delete data._id;
    await this.typesense.updateDocument(this.typesenseCollectionName, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async replace(response: ChangeEventCR<any>): Promise<void> {
    const id = String(response.documentKey._id);
    const data = response.fullDocument;
    Object.assign(data, {
      id: id,
    });
    delete data._id;
    await this.typesense.replaceDocument(
      this.typesenseCollectionName,
      id,
      data
    );
  }
}
