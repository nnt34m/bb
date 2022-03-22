import state from "library:autonomous/state";
import { LayerParameters } from "library:autonomous/state/Layer";
import Cluster, { ClusterParameters } from "library:autonomous/state/Cluster";
import { types } from "@theatre/core";

export type ControllerSettings = {
  position: {
    x: any,
    y: any,
    z: any,
  },

  rotation: {
    x: any,
    y: any,
    z: any,
  },

  scale: {
    x: any,
    y: any,
    z: any,
  },
}

export default class Controller {

  public readonly cluster: Cluster<ControllerSettings>

  constructor(parameters: Partial<LayerParameters & ClusterParameters<ControllerSettings>>) {

    this.cluster = state.getCluster<ControllerSettings>({

      settings: {

        position: {
          x: types.number(0, { nudgeMultiplier: 1 }),
          y: types.number(0, { nudgeMultiplier: 1 }),
          z: types.number(0, { nudgeMultiplier: 1 }),
        },

        rotation: {
          x: types.number(0, { nudgeMultiplier: 0.01 }),
          y: types.number(0, { nudgeMultiplier: 0.01 }),
          z: types.number(0, { nudgeMultiplier: 0.01 }),
        },

        scale: {
          x: types.number(1, { nudgeMultiplier: 0.01 }),
          y: types.number(1, { nudgeMultiplier: 0.01 }),
          z: types.number(1, { nudgeMultiplier: 0.01 }),
        },

        ...parameters.settings

      },

      breakpoints: parameters.breakpoints || [],
      layerName: parameters.layerName || 'controller',
      layerInstanceID: parameters.layerInstanceID || 'default',
      clusterName: parameters.clusterName || 'controller',

    })

    this.subscribe()

  }


  public subscribe() {

    this.cluster.subscribe()

  }


  public unsubscribe() {

    this.cluster.unsubscribe()

  }

}