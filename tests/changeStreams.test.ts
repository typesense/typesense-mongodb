import { ChangeStreams } from "../src/ChangeStreams";

let changeStream: ChangeStreams;
const databaseName = "database";
const collectionName = "books";
const typesenseCollectionName = "database_books";

describe("ChangeStreams functions", () => {
  beforeEach(async () => {
    let data = JSON.parse(JSON.stringify(global.books.slice(0, 40)));
    data = data.map((obj) => {
      return { ...obj, _id: obj.id };
    });
    await global.mongo
      .db(databaseName)
      .collection(collectionName)
      .insertMany(data);
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
    await global.mongo
      .db(databaseName)
      .collection(collectionName)
      .insertOne({
        ...global.books[60],
        _id: "61",
      });
    await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 1000)));
    const result = await global.typesense
      .collections(typesenseCollectionName)
      .documents("61")
      .retrieve();
    expect(global.books[60]).toEqual({
      ...result,
    });
  });

  it("update()", async () => {
    const query = {
      _id: "1",
    };
    const data = JSON.parse(JSON.stringify(global.books[100]));
    const update = {
      title: data.title,
    };
    await global.mongo
      .db(databaseName)
      .collection(collectionName)
      .updateOne(query, {
        $set: update,
      });
    await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 1000)));
    const result = await global.typesense
      .collections(typesenseCollectionName)
      .documents("1")
      .retrieve();
    expect(global.books[100].title).toEqual(result.title);
    expect(global.books[0].publication_year).toEqual(result.publication_year);
    expect(global.books[0].id).toEqual(result.id);
  });

  it("replace()", async () => {
    const data = JSON.parse(JSON.stringify(global.books[100]));
    const query = {
      _id: "1",
    };
    await global.mongo
      .db(databaseName)
      .collection(collectionName)
      .replaceOne(query, data, {
        upsert: true,
      });
    await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 1000)));
    const result = await global.typesense
      .collections(typesenseCollectionName)
      .documents("1")
      .retrieve();
    expect(global.books[100].title).toEqual(result.title);
    expect(global.books[100].publication_year).toEqual(result.publication_year);
    expect(global.books[0].id).toEqual(result.id);
  });

  it("delete()", async () => {
    const id = "1";
    await global.mongo.db(databaseName).collection(collectionName).deleteOne({
      _id: id,
    });
    await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 1000)));
    await expect(
      global.typesense
        .collections(typesenseCollectionName)
        .documents(id)
        .retrieve()
    ).rejects.toThrow("404");
  });

  it("drop()", async () => {
    await global.mongo.db(databaseName).collection(collectionName).drop();
    await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 1000)));
    await expect(
      global.typesense.collections(typesenseCollectionName).retrieve()
    ).rejects.toThrow("404");
  });
});
