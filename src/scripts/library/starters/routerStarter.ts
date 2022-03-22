import state from "library:autonomous/state";
import Module from "library:modules/Module";
import Router from "library:modules/Router";
import { KV } from "library:types";

export default async function routerStarter(starter: {

  projectName: string,
  projectConfiguration?: KV | undefined,
  routerBase?: string,
  callback: (root: Module, router: Router) => void

}) {

  await state.initialize(starter.projectName, starter.projectConfiguration)
  const router = new Router(starter.routerBase)
  const root = new Module()
  root.add(router)
  starter.callback(root, router)

}