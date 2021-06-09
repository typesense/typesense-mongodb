import { ChangeEventCR } from "mongodb";
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
    changeStream.on("change", (response) => {
      if (response.operationType === Events.insert) {
        this.insert(response);
      }
    });
  }

  async insert(response: ChangeEventCR<unknown>): Promise<void> {
    const data = JSON.parse(JSON.stringify(response.fullDocument));
    data.id = String(data._id);
    delete data._id;
    await this.typesense.insertDocument(this.typesenseCollectionName, data);
  }
}
