import { ISheet } from "@theatre/core"
import { State } from "."
import Cluster, { ClusterParameters } from "./Cluster"
import Unit, { UnitParameters } from "./Unit"

export type LayerParameters = {
  layerName: string,
  layerInstanceID: string
}

export default class Layer {

  public readonly theatreSheet: ISheet
  public readonly units: Map<string, Unit<any>> = new Map()
  public readonly clusters: Map<string, Cluster<any>> = new Map()

  constructor(readonly parameters: LayerParameters & { state: State }) {

    this.theatreSheet = this.parameters.state.theatreProject!.sheet(this.parameters.layerName, this.parameters.layerInstanceID)

  }


  public getCluster<T>(parameters: ClusterParameters<T>): Cluster<T> {

    if (!this.clusters.has(parameters.clusterName)) {

      this.clusters.set(

        parameters.clusterName,

        new Cluster<T>({
          layer: this,
          clusterName: parameters.clusterName,
          settings: parameters.settings,
          breakpoints: parameters.breakpoints
        })

      )

    }

    return this.clusters.get(parameters.clusterName) as Cluster<T>

  }


  public getUnit<T>(parameters: UnitParameters<T>): Unit<T> {

    if (!this.units.has(parameters.unitName)) {

      this.units.set(

        parameters.unitName,

        new Unit<T>({
          layer: this,
          unitName: parameters.unitName,
          settings: parameters.settings,
        })

      )

    }

    return this.units.get(parameters.unitName) as Unit<T>

  }

}