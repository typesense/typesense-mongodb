import { MongoClient } from "mongodb";
import { MongoClient as TestClient } from "../src/MongoClient";
import { TypesenseClient } from "../src/TypesenseClient";
import { Client } from "typesense";

beforeEach(async () => {
  expect.extend({
    toBeIn(recieved: string[], name: string) {
      if (recieved.includes(name)) {
        return {
          pass: true,
          message: () => "Success",
        };
      } else {
        return {
          pass: false,
          message: () => `${name} not in ${recieved}`,
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
  const testMongo = new TestClient(global.mongoUrl);
  global.testMongo = testMongo;
  try {
    await mongo.connect();
  } catch (e) {
    console.error(e);
  }
  global.testMongo.connectMongo();
  global.mongo = mongo;
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
  global.typesense = typesense;
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
