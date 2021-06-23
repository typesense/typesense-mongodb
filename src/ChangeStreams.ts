/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeEventCR,
  ChangeEventDelete,
  ChangeEventRename,
  ChangeEventUpdate,
  ChangeStream,
} from "mongodb";
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
    collectionName: string,
    typesenseCollectionName: string
  ) {
    this.mongo = mongo;
    this.typesense = typesense;
    this.mongoDatabaseName = databaseName;
    this.mongoCollectionName = collectionName;
    this.typesenseCollectionName = typesenseCollectionName;
    this.changeStream = this.mongo.changeStreams(
      this.mongoDatabaseName,
      this.mongoCollectionName
    );
    this.eventMapper();
  }

  eventMapper(): void {
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
      if (response.operationType === Events.delete) {
        await this.delete(response);
      }
      if (response.operationType === Events.drop) {
        await this.drop();
      }
      if (response.operationType === Events.rename) {
        await this.rename(response);
      }
    });
  }

  async closeChangeStream(): Promise<void> {
    this.changeStream.close();
  }

  async insert(response: ChangeEventCR<any>): Promise<void> {
    const data = response.fullDocument;
    Object.assign(data, {
      id: String(response.documentKey._id),
    });
    delete data._id;
    await this.typesense.insertDocument(this.typesenseCollectionName, data);
  }

  async update(response: ChangeEventUpdate<any>): Promise<void> {
    const data = response.fullDocument;
    Object.assign(data, {
      id: String(response.documentKey._id),
    });
    delete data._id;
    await this.typesense.updateDocument(this.typesenseCollectionName, data);
  }

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

  async delete(response: ChangeEventDelete<any>): Promise<void> {
    const id = String(response.documentKey._id);
    await this.typesense.deleteDocument(this.typesenseCollectionName, id);
  }

  async drop(): Promise<void> {
    await this.typesense.dropCollection(this.typesenseCollectionName);
    await this.closeChangeStream();
  }

  async rename(response: ChangeEventRename<any>): Promise<void> {
    await this.typesense.renameCollection(
      this.typesenseCollectionName,
      `${this.mongoDatabaseName}_${response.to.coll}`
    );
    this.mongoCollectionName = response.to.coll;
    this.typesenseCollectionName = `${this.mongoDatabaseName}_${response.to.coll}`;
    this.closeChangeStream();
    this.changeStream = this.mongo.changeStreams(
      this.mongoDatabaseName,
      this.mongoCollectionName
    );
    this.eventMapper();
  }
}
