import { types } from "@theatre/core"
import ComplexActor from "library:tools/ComplexActor"
import Actor from "library:tools/ComplexActor"
import { KV } from "library:types"
import { ElementParameters } from "./Element"
import RunnerElement, { RunnerElementSettings } from "./RunnerElement"


export default class StickyElement<Settings extends KV = {}> extends RunnerElement<Settings> {

  public readonly rails?: Actor

  constructor(parameters: ElementParameters<Settings & RunnerElementSettings, ComplexActor> & { rails?: Actor }) {

    super({
      name: 'sticky',
      ...parameters,
      //@ts-ignore
      settings: {
        offset: types.number(1, { range: [0, 1] }),
        ...parameters.settings
      }
    })

    this.rails = parameters.rails

  }


  public onLaunch() {

    super.onLaunch()
    this.stick()

  }


  protected calculateSceneStart() {

    super.calculateSceneStart()

    this.scene.start += this.actor.size[this.parent!.configuration!.value.axis] * (1 - this.configuration!.value.offset)

  }

  protected calculateSceneLength() {

    this.rails?.resize()

    this.scene.length = this.rails
      ? this.rails.size[this.parent!.configuration!.value.axis]
      - this.actor.size[this.parent!.configuration!.value.axis]
      : this.configuration!.value.length
      * this.parent!.size.viewport
      - this.configuration!.value.cut * this.parent!.size.viewport
      - this.actor.size[this.parent!.configuration!.value.axis]

  }


  public tick() {

    super.tick()
    this.stick()

  }


  protected stick() {

    if (this.parent!.configuration!.value.axis === 'y') {

      this.actor.translate(0, this.track.progress.lerp)

    } else {

      this.actor.translate(this.track.progress.lerp, 0)

    }

    this.actor.receiveEvent('stick', {
      track: this.track,
    })

  }

}