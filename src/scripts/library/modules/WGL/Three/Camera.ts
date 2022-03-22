import { types } from "@theatre/core";
import Module from "library:modules/Module";
import screenFOV from "library:utils/three/screenFOV";
import { PerspectiveCamera as THREEPerspectiveCamera } from "three";
import Canvas from "./Canvas";

export type CameraSettings = {

  fov: number,
  near: number,
  far: number,
  distance: number,

}

export default class Camera extends Module<CameraSettings, Canvas> {

  base: THREEPerspectiveCamera

  constructor(parameters?: { name?: string, settings?: Partial<CameraSettings> }) {

    super()

    this.name = parameters?.name || 'camera'
    this.layer = 'canvas'
    this.type = 'camera'

    const configuration = {
      fov: types.number(0, { range: [0, 200] }),
      near: 1,
      far: 3000,
      distance: 1000,

      ...parameters?.settings
    }

    this.useConfiguration(configuration)

    this.base = new THREEPerspectiveCamera()
    this.base.position.z = configuration.distance

  }


  public onReset() {

    this.parent!.renderer.clear()

  }


  public onSettingsChange() {

    this.onAfterResize()

  }


  public onAfterResize() {

    this.base.aspect = this.parent!.size.x / this.parent!.size.y
    this.base.near = this.configuration!.value.near
    this.base.far = this.configuration!.value.far
    this.base.fov = this.getFOV()
    this.base.updateProjectionMatrix()

  }


  private getFOV() {

    const { fov, distance } = this.configuration!.value
    return fov === 0 ? screenFOV(this.parent!.size.y, distance) : fov

  }

}