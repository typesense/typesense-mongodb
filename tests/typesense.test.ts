import { MongoClient } from "mongodb";
import { Client } from "typesense";
import { MongoClient as TestClient } from "../src/MongoClient";
import { TypesenseClient } from "../src/TypesenseClient";
import { schema } from "../src/interfaces/schema";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { book } from "./globalSetup";

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

describe("TypesenseClient functions", () => {
  it("createCollection()", async () => {
    const collectionName = "books";
    await global.testTypesense.createCollection(collectionName);
    const result = await global.typesense
      .collections(collectionName)
      .retrieve();
    expect(result.name).toEqual(collectionName);
  });

  it("importDocuments()", async () => {
    const collectionName = "books";
    await global.typesense.collections().create(global.autoSchema);
    const sample_data = JSON.parse(JSON.stringify(global.books.slice(0, 40)));
    await global.testTypesense.importDocuments(collectionName, sample_data);
    const result = await global.typesense
      .collections(collectionName)
      .retrieve();
    expect(result.num_documents).toEqual(40);
  });

  it("insertDocument()", async () => {
    const collectionName = "books";
    const sample_document = JSON.parse(JSON.stringify(global.books[0]));
    await global.typesense.collections().create(global.autoSchema);
    await global.testTypesense.insertDocument(collectionName, sample_document);
    const result = await global.typesense
      .collections(collectionName)
      .documents(sample_document.id)
      .retrieve();
    expect(result).toEqual(sample_document);
  });

  it("updateDocument()", async () => {
    const collectionName = "books";
    const sample_document = JSON.parse(JSON.stringify(global.books[0]));
    await global.typesense.collections().create(global.autoSchema);
    await global.typesense
      .collections(collectionName)
      .documents()
      .create(sample_document);
    sample_document.title = "test_name";
    await global.testTypesense.updateDocument(collectionName, sample_document);
    const result = await global.typesense
      .collections(collectionName)
      .documents(sample_document.id)
      .retrieve();
    expect(result).toEqual(sample_document);
  });

  it("deleteDocument()", async () => {
    const collectionName = "books";
    const sample_document = JSON.parse(
      JSON.stringify(global.books.slice(0, 100))
    );
    await global.typesense.collections().create(global.autoSchema);
    await global.typesense
      .collections(collectionName)
      .documents()
      .import(sample_document, { action: "create" });
    await global.testTypesense.deleteDocument(collectionName, "10");
    await expect(
      global.typesense.collections(collectionName).documents("10").retrieve()
    ).rejects.toThrow("404");
  });

  it("replaceDocument()", async () => {
    const collectionName = "books";
    const sample_document = JSON.parse(
      JSON.stringify(global.books.slice(0, 100))
    );
    await global.typesense.collections().create(global.autoSchema);
    await global.typesense
      .collections(collectionName)
      .documents()
      .import(sample_document, { action: "create" });
    const replaced_document = JSON.parse(JSON.stringify(global.books[40]));
    replaced_document.id = "10";
    await global.testTypesense.replaceDocument(
      collectionName,
      replaced_document.id,
      replaced_document
    );
    const result = await global.typesense
      .collections(collectionName)
      .documents(replaced_document.id)
      .retrieve();
    expect(result).toEqual(replaced_document);
  });

  it("renameCollection()", async () => {
    const collectionName = "books";
    await global.typesense.collections().create(global.autoSchema);
    await global.testTypesense.renameCollection(collectionName, "books_1");
    await expect(
      global.typesense.collections("books_1").retrieve()
    ).resolves.toBeDefined();
  });

  it("checkCollection()", async () => {
    const collectionName = "books";
    await global.typesense.collections().create(global.autoSchema);
    let result: number = await global.testTypesense.checkCollection(
      collectionName
    );
    expect(result).not.toBeUndefined();
    result = await global.testTypesense.checkCollection("books_1");
    expect(result).toBeUndefined();
  });
});
