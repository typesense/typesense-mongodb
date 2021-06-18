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
    const autoSchema: schema = {
      name: collectionName,
      fields: [{ name: ".*", type: "auto" }],
    };
    await this.client.collections().create(autoSchema);
  }

  async importDocuments(
    collectionName: string,
    documents: Record<string, unknown>[]
  ): Promise<void> {
    await this.client
      .collections(collectionName)
      .documents()
      .import(documents, { action: "create" });
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

  async deleteDocument(collectionName: string, id: string): Promise<void> {
    await this.client.collections(collectionName).documents(id).delete();
  }

  async replaceDocument(
    collectionName: string,
    id: string,
    document: Record<string, unknown>
  ): Promise<void> {
    try {
      await this.client.collections(collectionName).documents(id).delete();
    } catch (err) {
      if (err instanceof Errors.ObjectNotFound) {
        return;
      }
      throw err;
    }
    await this.client.collections(collectionName).documents().create(document);
  }

  async dropCollection(collectionName: string): Promise<void> {
    await this.client.collections(collectionName).delete();
  }

  async renameCollection(
    collectionName: string,
    newCollectionName: string
  ): Promise<void> {
    const aliased_collection = {
      collection_name: collectionName,
    };
    await this.client.aliases().upsert(newCollectionName, aliased_collection);
  }

  async checkCollection(collectionName: string): Promise<boolean> {
    try {
      await this.client.collections(collectionName).retrieve();
      return true;
    } catch (err) {
      if (err instanceof Errors.ObjectNotFound) {
        return false;
      }
      throw err;
    }
  }
}
