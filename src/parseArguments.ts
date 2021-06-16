import arg from "arg";
import { config } from "./interfaces/config";

export function parseArguments(rawArgs: string[]): config {
  const args = arg(
    {
      "--db": String,
      "--coll": String,
      "--port": Number,
      "--host": String,
      "--user": String,
      "--pass": String,
      "--apiKey": String,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    db: args["--db"],
    coll: args["--coll"],
    port: args["--port"],
    user: args["--user"],
    pass: args["--pass"],
    apikey: args["--apiKey"],
  };
}
