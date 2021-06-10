import { title } from "process";
import { book } from "./globalSetup";

describe("MongoClient functions", () => {
  it("listAllDatabases()", async () => {
    const expectedDatabasesList = await global.mongo
      .db()
      .admin()
      .listDatabases();
    const recieved = await global.testMongo.listAllDatabases();
    expectedDatabasesList.databases.map((database) => {
      expect(recieved).toBeIn(database.name);
    });
  });

  it("listCollections()", async () => {
    const databaseName = "database";
    const collectionName = "books";
    const document = {
      name: "sample",
      title: "Hello",
    };
    await global.mongo
      .db(databaseName)
      .collection(collectionName)
      .insertOne(document);
    const recieved = await global.testMongo.listCollections(databaseName);
    expect(recieved).toBeIn(collectionName);
  });

  it("insertDocuments()", async () => {
    const databaseName = "database";
    const collectionName = "collection";
    await global.testMongo.insertDocuments("database", "collection");
    const result = await global.mongo
      .db(databaseName)
      .collection(collectionName)
      .countDocuments();
    expect(result).toEqual(5000);
  });

  it("readDocuments()", async () => {
    const databaseName = "database";
    const collectionName = "collection";
    await global.mongo
      .db(databaseName)
      .collection(collectionName)
      .insertMany(global.books.slice(5));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sample_data: book[] = JSON.parse(
      JSON.stringify(global.books.slice(5))
    );
    const titles: string[] = sample_data.map((book) => {
      return book.title;
    });
    const result = await global.testMongo.readDocuments(
      databaseName,
      collectionName
    );
    const recieved = result.map((book) => {
      return book.title;
    });
    titles.forEach((title) => {
      expect(recieved).toBeIn(title);
    });
  });
});
