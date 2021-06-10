import { ChangeEventCR, ChangeEventUpdate } from "mongodb";
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
  mongo: MongoClient;
  typesense: TypesenseClient;
  mongoDatabaseName: string;
  mongoCollectionName: string;
  typesenseCollectionName: string;

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
    const changeStream = this.mongo.changeStreams(
      this.mongoDatabaseName,
      this.mongoCollectionName
    );
    changeStream.on("change", async (response) => {
      if (response.operationType === Events.insert) {
        await this.insert(response);
      }
      if (response.operationType === Events.update) {
        await this.update(response);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async insert(response: ChangeEventCR<any>): Promise<void> {
    const data = response.fullDocument;
    Object.assign(data, {
      id: response.documentKey._id,
    });
    delete data._id;
    await this.typesense.insertDocument(this.typesenseCollectionName, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(response: ChangeEventUpdate<any>): Promise<void> {
    const data = response.fullDocument;
    Object.assign(data, {
      id: response.documentKey._id,
    });
    delete data._id;
    await this.typesense.updateDocument(this.typesenseCollectionName, data);
  }
}
