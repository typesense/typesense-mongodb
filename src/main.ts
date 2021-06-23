import { Db, MongoClient } from 'mongodb';
import { Client } from 'typesense';

const mongoUrlLocal = "mongodb://root:example@localhost:27017";

async function listDatabases(client: MongoClient) {
  const databasesList = await client.db().admin().listDatabases();

  console.log('Databases:');
  databasesList.databases.forEach((db: any) => console.log(` - ${db.name}`));
}

export async function Main() {
  const mongodbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const client = new MongoClient(mongoUrlLocal, mongodbOptions);
  try {
    await client.connect();
    await listDatabases(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
