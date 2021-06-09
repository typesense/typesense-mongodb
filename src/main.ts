import { MongoClient } from "./MongoClient";
import { TypesenseClient } from "./TypesenseClient";

const mongoUrlLocal = "mongodb://localhost:27017";

export async function Main(): Promise<void> {
  const mongo: MongoClient = new MongoClient(mongoUrlLocal);
  const typesense: TypesenseClient = new TypesenseClient("xyz", [
    {
      host: "localhost",
      port: "8108",
      protocol: "http",
    },
  ]);
  await typesense.createCollection("books");
  await mongo.connectMongo();
  await mongo.insertDocuments("database", "books");
  await typesense.importDocuments(
    "books",
    await mongo.readDocuments("database", "books")
  );
}
