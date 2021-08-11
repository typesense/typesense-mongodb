import { config } from './interfaces/config';
import { Main } from './main';
import { parseArguments } from './parseArguments';

export async function cli(args: string[]): Promise<void> {
  const parsed: config = parseArguments(args);
  await Main(parsed);
}
