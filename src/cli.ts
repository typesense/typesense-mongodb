import { config } from "./interfaces/config";
import { parseArguments } from "./parseArguments";

export async function cli(args: string[]): Promise<void> {
  const parsed: config = parseArguments(args);
  console.log(parsed);
}
