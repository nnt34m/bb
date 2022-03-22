import { Constructor, KV } from "library:types";
import { LoadingManager, Loader as THREELoader } from "three";

class Loader extends LoadingManager {

  public readonly loaders: KV<THREELoader> = {}

  constructor() {

    super()

  }


  public addLoader<T extends THREELoader = THREELoader>(name: string, loader: Constructor<T>) {

    if (this.loaders[name]) return this.loaders[name];
    return this.loaders[name] = new loader(this)

  }

}


const loader = new Loader()
export default loader