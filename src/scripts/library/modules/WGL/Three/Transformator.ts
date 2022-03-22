import Stairs3d from "library:tools/Stairs3d";
import { Euler, Object3D, Vector3 } from "three";
import Controller from "./Controller";

export default class Transformator {

  public readonly initialPosition: Vector3
  public readonly initialRotation: Euler
  public readonly initialScale: Vector3

  public readonly positionStairs = new Stairs3d()
  public readonly rotationStairs = new Stairs3d()
  public readonly scaleStairs = new Stairs3d()
  public readonly controllers: Map<string, Controller> = new Map()

  constructor(readonly object: Object3D) {

    this.initialPosition = this.object.position.clone()
    this.initialRotation = this.object.rotation.clone()
    this.initialScale = this.object.scale.clone()

  }


  public tick() {

    this.controllers.forEach((controller, key) => {
      this.positionStairs.setFromObject(key, controller.cluster.activeUnit!.theatreObject.value.position)
      this.rotationStairs.setFromObject(key, controller.cluster.activeUnit!.theatreObject.value.rotation)
      this.scaleStairs.setFromObject(key, controller.cluster.activeUnit!.theatreObject.value.scale)
    })


    this.positionStairs.add()
    this.rotationStairs.add()
    this.scaleStairs.multi()

    this.object.position.x = this.initialPosition.x + this.positionStairs.value.x
    this.object.position.y = this.initialPosition.y + this.positionStairs.value.y
    this.object.position.z = this.initialPosition.z + this.positionStairs.value.z

    this.object.rotation.x = this.initialRotation.x + this.rotationStairs.value.x
    this.object.rotation.y = this.initialRotation.y + this.rotationStairs.value.y
    this.object.rotation.z = this.initialRotation.z + this.rotationStairs.value.z

    this.object.scale.x = this.initialScale.x * this.scaleStairs.value.x
    this.object.scale.y = this.initialScale.y * this.scaleStairs.value.y
    this.object.scale.z = this.initialScale.z * this.scaleStairs.value.z

  }


  public addController(controller: Controller) {

    const name = 'controller' + this.controllers.size

    this.positionStairs.addStep(name)
    this.rotationStairs.addStep(name)
    this.scaleStairs.addStep(name)

    this.controllers.set(name, controller)

  }

}