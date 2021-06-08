import { Client } from "typesense";
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
}
