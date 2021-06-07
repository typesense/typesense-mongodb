import { Main } from './main';

export async function cli(args) {
  await Main();
  let string = 'hello';
  console.log(args);
}
