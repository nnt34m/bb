import HTMLActor, { HTMLActorPositionTypes, HTMLActorSizeTypes } from "library:tools/HTMLActor";
import XY from "library:utils/coordinates/XY";
import { dispose } from "library:utils/three/dispose";
import { Group, Object3D } from "three";
import { BranchComponent } from "./Branch";
import Transformator from "./Transformator";

export default class THTMLActor extends HTMLActor implements BranchComponent {

  public readonly base = new Group()
  public readonly transformator: Transformator

  constructor(
    body: HTMLElement,
    sizeType: HTMLActorSizeTypes = 'offset',
    positionType: HTMLActorPositionTypes = 'absolute',
  ) {

    super(body, sizeType, positionType)

    this.transformator = new Transformator(this.base)
    this.transformator.positionStairs.addStep('actor')
    this.transformator.scaleStairs.addStep('actor', 1)

  }


  public on() { }


  public off() {

    this.body.style.transform = ''
    dispose(this.base)
    this.base.children = []

  }


  public resize(size?: XY) {

    super.resize()

    size = size || new XY(innerWidth, innerHeight)

    this.setInitialScaleX(size)
    this.setInitialScaleY(size)
    this.setInitialScaleZ(size)
    this.setInitialPositionX(size)
    this.setInitialPositionY(size)
    this.setInitialPositionZ(size)
    this.tick(0)

  }


  public setInitialScaleX(canvasSize: XY) {

    this.transformator.initialScale.x = this.size.x

  }


  public setInitialScaleY(canvasSize: XY) {

    this.transformator.initialScale.y = this.size.y

  }


  public setInitialScaleZ(canvasSize: XY) {

    this.transformator.initialScale.z = 1

  }


  public setInitialPositionX(canvasSize: XY) {

    this.transformator.initialPosition.x = (this.position.x - canvasSize.x / 2) * 1 + this.size.x / 2

  }


  public setInitialPositionY(canvasSize: XY) {

    this.transformator.initialPosition.y = (this.position.y - canvasSize.y / 2) * -1 - this.size.y / 2

  }


  public setInitialPositionZ(canvasSize: XY) {

    this.transformator.initialPosition.z = 0

  }


  protected transform() {

    super.transform()

    this.transformator.positionStairs.set('actor', this.translatedPosition.x, this.translatedPosition.y * -1)
    this.transformator.scaleStairs.set('actor', this.translatedSize.x, this.translatedSize.y, 1)

  }


  public tick(t: number) {

    this.transformator.tick()

  }


  public addObject3d(object3d: Object3D) {

    this.base.add(object3d)

  }


  public removeObject3d(object3d: Object3D) {

    this.base.remove(object3d)

  }

}