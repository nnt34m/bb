import Module from "library:modules/Module"
import XY from "library:utils/coordinates/XY";
import { Scene, WebGLRenderer, WebGLRendererParameters } from "three";
import Branch from "./Branch";
import Camera from "./Camera";

export default class Canvas extends Module<{}, any> {

  public readonly body: HTMLElement
  public readonly size = new XY()
  public readonly renderer: WebGLRenderer
  public camera?: Camera
  public scene: Scene

  constructor(parameters: { body: HTMLElement, name?: string, renderer?: WebGLRendererParameters }) {

    super()

    this.body = parameters.body
    this.name = parameters.name || 'canvas'
    this.layer = 'canvas'
    this.type = 'canvas'
    this.autoTick = false

    this.renderer = new WebGLRenderer({ ...parameters.renderer })
    this.scene = new Scene()

  }



  public onAdding(module: Module) {

    if (module.type === 'camera') {
      this.camera = (module as Camera)
    }

    else if (module.type === 'branch') {
      this.scene.add((module as Branch).base)

    }

  }


  public onRemoving(module: Module) {

    if (module.name === 'camera') {
      this.camera = undefined
      this.renderer.clear()
    }

    else if (module.type === 'branch') {
      this.scene.remove((module as Branch).base)
    }

  }


  public onLaunch() {

    this.body.appendChild(this.renderer.domElement)
    this.useTick(10)

  }


  public onReset() {

    this.body.removeChild(this.renderer.domElement)

  }


  public onResize() {

    this.size.set(
      this.body.offsetWidth,
      this.body.offsetHeight,
    )

    this.renderer.setSize(this.size.x, this.size.y)
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

  }


  public onTick() {

    if (this.camera && this.camera.indicators.launched) {
      this.renderer.render(this.scene, this.camera.base)
    }

  }

}