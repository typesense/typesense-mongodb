import { MongoClient } from "mongodb";
import { Client } from "typesense";
import { schema } from "../src/interfaces/schema";
import { TypesenseClient } from "../src/TypesenseClient";
import { MongoClient as TestClient } from "../src/MongoClient";
import { setup as setupDevServer } from "jest-dev-server";
import { exec } from "child_process";
import * as util from "util";

export interface book {
  id: string;
  title: string;
  publication_year: number;
  ratings_count: number;
  average_rating: number;
  authors: string[];
}
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

export default async function globalSetup(): Promise<void> {
  await setupDevServer([
    {
      command: "docker-compose up -d",
      port: 27017,
      host: "0.0.0.0",
      protocol: "tcp",
      usedPortAction: "ignore",
      launchTimeout: 120000,
    },
  ]);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const newExec = util.promisify(exec);
  await newExec('docker exec -i mongo mongo --eval "rs.initiate()"');
}
