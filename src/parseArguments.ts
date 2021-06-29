import arg from "arg";
import { config } from "./interfaces/config";

export function parseArguments(rawArgs: string[]): config {
  const args = arg(
    {
      "--mongo-database": String,
      "--mongo-collection": String,
      "--typesense-collection": String,
      "--typesense-api-key": String,
      "--typesense-url": String,
      "--mongo-url": String,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    mongodbDatabaseName: args["--mongo-database"],
    mongodbCollectionName: args["--mongo-collection"],
    typesenseCollectionName: args["--typesense-collection"],
    mongodbURL: args["--mongo-url"],
    typesenseURL: args["--typesense-url"],
    typesenseKey: args["--typesense-api-key"],
  };
}

/*
typesense-mongodb \
    --mongo-database=database \
    --mongo-collection=collection \
    --typesense-collection=collection \
    --mongo-url=mongodb://localhost:27017 \
    --typesense-url=http://localhost:8108 \
    --typesense-api-key=xyz
*/

// --mongo-database=database --mongo-collection=collection --typesense-collection=collection --mongo-url=mongodb://localhost:27017 --typesense-url=http://localhost:8108 --typesense-api-key=xyz
