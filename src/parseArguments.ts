import arg from "arg";
import { config } from "./interfaces/config";

export function parseArguments(rawArgs: string[]): config {
  const args = arg(
    {
      "--mdb": String,
      "--mcol": String,
      "--tcol": String,
      "--murl": String,
      "--turl": String,
      "--tkey": String,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    mongodbDatabaseName: args["--mdb"],
    mongodbCollectionName: args["--mcol"],
    typesenseCollectionName: args["--tcol"],
    mongodbURL: args["--murl"],
    typesenseURL: args["--turl"],
    typesenseKey: args["--tkey"],
  };
}
