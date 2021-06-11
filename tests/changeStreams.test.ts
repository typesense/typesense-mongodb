import { ObjectId } from "mongodb";
import { ChangeStreams } from "../src/ChangeStreams";

let changeStream: ChangeStreams;
const databaseName = "database";
const collectionName = "books";
const typesenseCollectionName = "database_books";

describe("ChangeStreams functions", () => {
  beforeEach(async () => {
    await global.mongo
      .db(databaseName)
      .collection(collectionName)
      .insertMany(global.books.slice(0, 40));
    await global.typesense
      .collections()
      .create({ ...global.autoSchema, name: typesenseCollectionName });
    await global.typesense
      .collections(typesenseCollectionName)
      .documents()
      .import(global.books.slice(0, 40), { action: "create" });
    changeStream = new ChangeStreams(
      global.testMongo,
      global.testTypesense,
      databaseName,
      collectionName
    );
    await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 1000)));
  });

  afterEach(async () => {
    changeStream.closeChangeStream();
  });
  it("insert()", async () => {
    const id = new ObjectId();
    await global.mongo
      .db(databaseName)
      .collection(collectionName)
      .insertOne({
        ...global.books[60],
        _id: id,
      });
    await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 1000)));
    const result = await global.typesense
      .collections(typesenseCollectionName)
      .documents(String(id))
      .retrieve();
    expect(global.books[60]).toEqual({
      ...result,
      id: "61",
    });
  });
});
