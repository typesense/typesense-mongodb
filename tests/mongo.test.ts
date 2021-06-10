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
      name: "Harisaran",
      title: "Hello",
    };
    await global.mongo
      .db(databaseName)
      .collection(collectionName)
      .insertOne(document);
    const recieved = await global.testMongo.listCollections(databaseName);
    expect(recieved).toBeIn(collectionName);
  });
});
