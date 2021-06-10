import { MongoClient } from "mongodb";
import { Client } from "typesense";
import { schema } from "../src/interfaces/schema";
import { TypesenseClient } from "../src/TypesenseClient";
import { MongoClient as TestClient } from "../src/MongoClient";

module.exports = () => {
  return;
};

declare global {
  namespace NodeJS {
    interface Global {
      mongoUrl: string;
      mongo: MongoClient;
      testMongo: TestClient;
      typesense: typeof Client;
      testTypesense: TypesenseClient;
      autoSchema: schema;
    }
  }
  namespace jest {
    interface Matchers<R> {
      toBeIn(expected: string): CustomMatcherResult;
    }
  }
}
