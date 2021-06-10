describe("TypesenseClient functions", () => {
  it("createCollection()", async () => {
    const collectionName = "books";
    await global.testTypesense.createCollection(collectionName);
    const result = await global.typesense
      .collections(collectionName)
      .retrieve();
    expect(result.name).toEqual(collectionName);
  });
});
