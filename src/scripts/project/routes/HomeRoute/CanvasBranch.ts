import Branch from "library:modules/WGL/Three/Branch"
import { query } from "library:utils/dom/query"
import Years from "./Years"
import { DirectionalLight, Object3D } from 'three'
import Background from "./Background"

export default class CanvasBranch extends Branch {

  private years?: Years
  private background?: Background

  constructor(model: Object3D) {

    super({ name: 'homeBranch' })

    query(
      '.logo-model',

      (el) => {

        this.createYears(el, model)
        this.createBackground()
        this.createLights()

      }
    )

  }


  private createYears(el: HTMLElement, model: Object3D) {

    this.years = new Years(el, model)
    this.addComponent(this.years)

  }


  private createBackground() {

    this.background = new Background()
    this.addComponent(this.background)

  }


  private createLights() {

    const light = new DirectionalLight()
    light.intensity = 2
    light.position.z = 1000
    light.position.x = 500
    light.position.y = 1500
    this.addObject3d(light)

  }


  public inYears() {

    this.years?.in()

  }


  public outYears() {

    this.years?.out()

  }


  public hideYears() {

    this.years?.hide()

  }


  public hideBackground() {

    this.background?.hide()

  }


  public showBackground() {

    this.background?.in()

  }

}