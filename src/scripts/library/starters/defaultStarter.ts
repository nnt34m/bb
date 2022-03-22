import state from "library:autonomous/state";
import ticker from "library:autonomous/ticker";
import Module from "library:modules/Module";
import { KV } from "library:types";

export default async function defaultStarter(starter: {

  projectName: string,
  projectConfiguration?: KV | undefined,
  callback: (root: Module) => void

}) {

  await state.initialize(starter.projectName, starter.projectConfiguration)
  const root = new Module()
  starter.callback(root)




}