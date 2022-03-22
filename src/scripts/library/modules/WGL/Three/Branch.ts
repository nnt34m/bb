import { Toggable } from "library:interfaces";
import Module from "library:modules/Module";
import XY from "library:utils/coordinates/XY";
import { dispose } from "library:utils/three/dispose";
import { Group, Object3D } from "three";
import Canvas from "./Canvas";

export interface BranchComponent extends Toggable {
  tick?(t: number): void
  resize?(size?: XY): void
  out?(...args: any[]): void
  base: Object3D
}

export default class Branch extends Module<{}, Canvas> {

  public readonly base = new Group()
  public readonly components: Set<BranchComponent> = new Set()

  constructor(parameters?: { name?: string }) {

    super()

    this.name = parameters?.name || 'branch'
    this.type = 'branch'
    this.autoTick = false

  }


  public onReset() {

    this.components.forEach(component => component.off())
    dispose(this.base)
    this.base.children = []
    this.components.clear()

  }


  public onLaunch() {

    this.components.forEach(component => {
      component.on()
    })


  }


  public onAfterLaunch() {

    this.useTick(9)

  }


  public addObject3d(object3D: Object3D) {

    this.base.add(object3D)

  }


  public removeObject3d(object3D: Object3D) {

    this.base.remove(object3D)

  }


  public addComponent(component: BranchComponent) {

    this.components.add(component)
    this.base.add(component.base)


    if (this.indicators.launched) {
      component.on()
      component.resize?.()
    }

  }


  public removeComponent(component: BranchComponent) {

    this.components.delete(component)
    this.base.remove(component.base)
    component.off()

  }


  public out(...args: any) {

    this.components.forEach(component => {
      component.out?.(...args)
    })

  }


  public onTick(t: number) {

    this.components.forEach(component => {
      component.tick?.(t)
    })

  }


  public onAfterResize() {

    this.components.forEach(component => {
      component.resize?.()
    })

  }

}