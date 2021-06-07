import { Main } from "./main";

export async function cli(args: string[]): Promise<void> {
  await Main();
  console.log(args);
}
