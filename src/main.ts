import defaults from "./defaults";
import { config } from "./interfaces/config";
import { node } from "./interfaces/node";
import { MongoClient } from "./MongoClient";
import { TypesenseClient } from "./TypesenseClient";
import Listr from "listr";
import chalk from "chalk";

function typesenseURLParser(url: string): node {
  const splits = url.split(":");

  return {
    host: splits[1].slice(2, splits[1].length),
    port: splits[splits.length - 1],
    protocol: splits[0],
  };
}

function intitializeTypesenseClient(options: config): TypesenseClient {
  return new TypesenseClient(options.typesenseKey, [
    typesenseURLParser(options.typesenseURL),
  ]);
}

async function intitializeMongoClient(options: config): Promise<MongoClient> {
  const client = new MongoClient(options.mongodbURL);
  try {
    await client.connectMongo();
  } catch (err) {
    console.error(err);
  }
  return client;
}

async function checkForExistingCollection(
  typesense: TypesenseClient,
  options: config
): Promise<boolean> {
  return await typesense.checkCollection(options.typesenseCollectionName);
}

export async function Main(parsed: config): Promise<void> {
  const options: config = {
    mongodbDatabaseName:
      parsed.mongodbDatabaseName || defaults.mongodbDatabaseName,
    mongodbCollectionName:
      parsed.mongodbCollectionName || defaults.mongodbCollectionName,
    mongodbURL: parsed.mongodbURL || defaults.mongodbURL,
    typesenseCollectionName:
      parsed.typesenseCollectionName || defaults.typesenseCollectionName,
    typesenseKey: parsed.typesenseKey || defaults.typesenseKey,
    typesenseURL: parsed.typesenseURL || defaults.typesenseURL,
  };

  let typesense: TypesenseClient;
  let mongo: MongoClient;
  let need: boolean;
  const tasks = new Listr([
    {
      title: "Initialize Typesense Client",
      task: () => {
        typesense = intitializeTypesenseClient(options);
      },
    },
    {
      title: "Initialize Mongo Client",
      task: async () => {
        mongo = await intitializeMongoClient(options);
      },
    },
    {
      title: "Check for an existing typesense collection",
      task: async () => {
        need = await checkForExistingCollection(typesense, options);
      },
    },
    {
      title: "Create a new Typesense Collection",
      task: async () =>
        await typesense.createCollection(options.typesenseCollectionName),
      skip: () =>
        need
          ? "Found an existing collection skipping create collection"
          : undefined,
    },
  ]);

  await tasks.run();
  console.log("%s Till now successful", chalk.green("DONE"));
}
