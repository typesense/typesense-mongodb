import { config } from "./interfaces/config";

const defaults: config = {
  mongodbDatabaseName: "database",
  mongodbCollectionName: "collection",
  typesenseCollectionName: "collection",
  mongodbURL: "mongodb://localhost:27017",
  typesenseURL: "http://localhost:8108",
  typesenseKey: "xyz",
};

export default defaults;
