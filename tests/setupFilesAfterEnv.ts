import { MongoClient } from "mongodb";
import { MongoClient as TestClient } from "../src/MongoClient";
import { TypesenseClient } from "../src/TypesenseClient";
import { Client } from "typesense";
import { schema } from "../src/interfaces/schema";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { book } from "./globalSetup";
import { type } from "os";

declare global {
  namespace NodeJS {
    interface Global {
      mongoUrl: string;
      mongo: MongoClient;
      testMongo: TestClient;
      typesense: typeof Client;
      testTypesense: TypesenseClient;
      autoSchema: schema;
      books: book[];
    }
  }
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R> {
      toBeIn(expected: string): CustomMatcherResult;
    }
  }
}
beforeEach(async () => {
  expect.extend({
    toBeIn(received: string[], name: string) {
      if (received.includes(name)) {
        return {
          pass: true,
          message: () => "Success",
        };
      } else {
        return {
          pass: false,
          message: () => `${name} not in ${received}`,
        };
      }
    },
  });
  global.books = await require("../data/books.json");
  global.mongoUrl = "mongodb://localhost:27017";
  const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const mongo = new MongoClient(global.mongoUrl, mongoOptions);
  global.mongo = mongo;
  global.testMongo = new TestClient(global.mongoUrl);
  try {
    await mongo.connect();
  } catch (e) {
    console.error(e);
  }
  await global.testMongo.connectMongo();
  const typesense = new Client({
    nodes: [
      {
        host: "localhost",
        port: "8108",
        protocol: "http",
      },
    ],
    apiKey: "xyz",
  });
  global.typesense = new Client({
    nodes: [
      {
        host: "localhost",
        port: "8108",
        protocol: "http",
      },
    ],
    apiKey: "xyz",
  });
  global.autoSchema = {
    name: "books",
    fields: [
      {
        name: ".*",
        type: "auto",
      },
    ],
  };
  global.testTypesense = new TypesenseClient("xyz", [
    {
      host: "localhost",
      port: "8108",
      protocol: "http",
    },
  ]);
  const typesenseCollections = await typesense.collections().retrieve();
  const typesenseAliases = await typesense.aliases().retrieve();
  await Promise.all(
    typesenseAliases.aliases.map(async (c) =>
      typesense.aliases(c.name).delete()
    )
  );
  await Promise.all(
    typesenseCollections.map(
      async (c) => await typesense.collections(c.name).delete()
    )
  );
  const mongoDatabases = await global.mongo.db().admin().listDatabases();
  await Promise.all(
    mongoDatabases.databases.map(async (database) => {
      if (!["admin", "local", "config"].includes(database.name)) {
        await global.mongo.db(database.name).dropDatabase();
      }
    })
  );
});

afterEach(async () => {
  const mongoDatabases = await global.mongo.db().admin().listDatabases();
  await Promise.all(
    mongoDatabases.databases.map(async (database) => {
      if (!["admin", "local", "config"].includes(database.name)) {
        await global.mongo.db(database.name).dropDatabase();
      }
    })
  );

  const typesenseCollections = await global.typesense.collections().retrieve();
  await Promise.all(
    typesenseCollections.map(
      async (c) => await global.typesense.collections(c.name).delete()
    )
  );

  await global.mongo.close();
  await global.testMongo.closeMongo();
});
