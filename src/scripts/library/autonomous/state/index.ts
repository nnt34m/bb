import studio from '@theatre/studio'
import { getProject, IProject } from "@theatre/core"
import Layer, { LayerParameters } from "./Layer"
import { ClusterParameters } from './Cluster'
import { UnitParameters } from './Unit'
import { KV } from 'library:types'

export class State {

  public readonly theatreProject: IProject | null = null
  public readonly layers: Map<string, Map<string, Layer>> = new Map()

  constructor() { }


  public async initialize(name: string, configuration?: KV) {

    // @ts-ignore
    this.theatreProject = getProject(name, { state: configuration })
    return this.theatreProject.ready

  }


  public getLayer(parameters: LayerParameters): Layer {

    if (!this.layers.has(parameters.layerName)) {

      this.layers.set(parameters.layerName, new Map())
      this.layers.get(parameters.layerName)!.set(parameters.layerInstanceID, new Layer({ ...parameters, state: this }))

    }

    return this.layers.get(parameters.layerName)!.get(parameters.layerInstanceID) as Layer

  }


  public getCluster<T>(parameters: LayerParameters & ClusterParameters<T>) {

    const layer = this.getLayer(parameters)

    const cluster = layer.getCluster(parameters)
    return cluster

  }


  public getUnit<T>(parameters: LayerParameters & UnitParameters<T>) {

    const layer = this.getLayer(parameters)
    const unit = layer.getUnit(parameters)
    return unit

  }

}


import.meta.env.DEV && studio.initialize()
const state = new State()
export default state