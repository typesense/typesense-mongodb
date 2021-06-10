import { Client, Errors } from "typesense";
import { node } from "./interfaces/node";
import { schema } from "./interfaces/schema";

export class TypesenseClient {
  private client: Client;
  constructor(
    apiKey: string,
    nodes: node[],
    nearestNode?: node,
    connectionTimeout?: number
  ) {
    this.client = new Client({
      nodes: nodes,
      nearestNode: nearestNode,
      apiKey: apiKey,
      connectionTimoutSeconds: connectionTimeout,
    });
  }

  async createCollection(collectionName: string): Promise<void> {
    try {
      await this.client.collections(collectionName).retrieve();
      console.log("Found a collection deleting it !");
      await this.client.collections(collectionName).delete();
    } catch (err) {
      if (err instanceof Errors.ObjectNotFound) {
        console.log("Creating a new collection !");
      } else {
        console.log("Something unexpected Happened !");
        throw err;
      }
    }
    const autoSchema: schema = {
      name: collectionName,
      fields: [{ name: ".*", type: "auto" }],
    };
    const result: schema = await this.client.collections().create(autoSchema);
    console.log(result);
  }

  async importDocuments(
    collectionName: string,
    documents: Record<string, unknown>[]
  ): Promise<void> {
    interface success {
      success: boolean;
    }
    const result: success[] = await this.client
      .collections(collectionName)
      .documents()
      .import(documents, { action: "create" });
    console.log(result.length);
  }

  async insertDocument(
    collectionName: string,
    document: Record<string, unknown>
  ): Promise<void> {
    await this.client.collections(collectionName).documents().create(document);
  }

  async updateDocument(
    collectionName: string,
    updatedDocument: Record<string, unknown>
  ): Promise<void> {
    await this.client
      .collections(collectionName)
      .documents()
      .upsert(updatedDocument);
  }
}
