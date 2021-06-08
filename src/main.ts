import { MongoClient } from "./MongoClient";

const mongoUrlLocal = "mongodb://root:example@localhost:27017";

export async function Main(): Promise<void> {
  const mongo: MongoClient = new MongoClient(mongoUrlLocal);
  await mongo.connectDb();
  const dbList = await mongo.listAlldatabases();
  console.log(dbList);
  // dbList = await mongo.listAlldatabases();
  // console.log(dbList);
  await mongo.listCollections("database");
  mongo.closeDb();
}
